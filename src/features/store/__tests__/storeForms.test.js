import dayjs from "dayjs";
import {
  campaignToPayload,
  categoryToPayload,
  orderFiltersToQuery,
  productToFormValues,
  productToPayload,
  validateProductPayload,
} from "../utils/storeForms";
import { describeActor, formatMoney } from "../utils/storeLabels";
import { storeOrderService, storeProductService } from "../services/storeService";
import { apiClient } from "../../../utils/apiClient";

jest.mock("../../../utils/apiClient", () => ({
  apiClient: {
    get: jest.fn(() => Promise.resolve({ data: { items: [], totalCount: 0 } })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
  },
  buildQuery: (params) => {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    return qs ? `?${qs}` : "";
  },
}));

const baseProduct = {
  name: "  Whey Protein ",
  brand: " PureLab ",
  sku: " whey-2kg ",
  categoryId: "3",
  description: "  Yüksek proteinli toz karışım  ",
  price: 1000,
  discountPrice: undefined,
  stockQuantity: 12,
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  features: [" 24 g protein ", ""],
  specs: [{ label: "Porsiyon", value: "30 g" }, { label: "", value: "x" }],
  variants: [],
  imageUrls: [" https://cdn.example.com/a.jpg ", ""],
};

describe("ürün formu", () => {
  it("değerleri kırpar, SKU'yu büyütür, boş satırları atar; fiyat sayıya çevrilir", () => {
    const payload = productToPayload(baseProduct);
    expect(payload).toMatchObject({
      name: "Whey Protein",
      brand: "PureLab",
      sku: "WHEY-2KG",
      categoryId: 3,
      description: "Yüksek proteinli toz karışım",
      price: 1000,
      discountPrice: null,
      features: ["24 g protein"],
      specs: [{ label: "Porsiyon", value: "30 g" }],
      imageUrls: ["https://cdn.example.com/a.jpg"],
    });
    expect(validateProductPayload(payload)).toEqual([]);
  });

  it("indirimli fiyat satış fiyatından düşük olmalı", () => {
    const errors = validateProductPayload(productToPayload({ ...baseProduct, discountPrice: 1000 }));
    expect(errors).toContain("İndirimli fiyat, satış fiyatından düşük olmalıdır.");
  });

  it("varyant kodlarını, renkleri, tekrarları, fiyatı ve stokta seçenek kuralını denetler", () => {
    const payload = productToPayload({
      ...baseProduct,
      discountPrice: 100,
      variants: [
        {
          id: "Beden",
          label: "Beden",
          kind: "size",
          options: [
            { id: "m", label: "M", priceDelta: 0, inStock: false, swatch: "red" },
            { id: "m", label: "M2", priceDelta: -150, inStock: false },
          ],
        },
      ],
    });
    const errors = validateProductPayload(payload).join("\n");
    expect(errors).toMatch(/Beden: kod yalnızca küçük harf/);
    expect(errors).toMatch(/"m" kodu tekrar ediyor/);
    expect(errors).toMatch(/M2: fiyat farkıyla birlikte/);
    expect(errors).toMatch(/M: renk #RRGGBB/);
    expect(errors).toMatch(/en az bir seçenek stokta/);
  });

  it("detay kaydını forma çevirirken ana görseli başa alır", () => {
    const values = productToFormValues({
      name: "A",
      images: [
        { imageUrl: "https://x/2.jpg", sortOrder: 1, isPrimary: false },
        { imageUrl: "https://x/1.jpg", sortOrder: 2, isPrimary: true },
      ],
      variants: [{ id: "size", label: "Beden", kind: "size", options: [{ id: "m", label: "M", priceDelta: 0, inStock: true, swatch: null }] }],
      specs: [],
      features: [],
    });
    expect(values.imageUrls).toEqual(["https://x/1.jpg", "https://x/2.jpg"]);
    expect(values.variants[0].options[0]).toEqual({ id: "m", label: "M", priceDelta: 0, inStock: true, swatch: undefined });
  });
});

describe("kategori ve kampanya formları", () => {
  it("kategori: boşları null yapar", () => {
    expect(categoryToPayload({ name: " Protein ", slug: " ", parentCategoryId: undefined, isActive: true, sortOrder: "2" })).toEqual({
      name: "Protein",
      slug: null,
      description: null,
      imageUrl: null,
      icon: null,
      parentCategoryId: null,
      isActive: true,
      sortOrder: 2,
    });
  });

  it("kampanya: rengi büyütür, ürünleri tekilleştirir, tarihleri gün başı/sonu yapar", () => {
    const payload = campaignToPayload({
      title: " Ekim ",
      tint: "#ffe5d0",
      isActive: true,
      sortOrder: 0,
      productIds: [3, "3", 5],
      dateRange: [dayjs("2026-10-01T15:00:00"), dayjs("2026-10-31T09:00:00")],
    });
    expect(payload.title).toBe("Ekim");
    expect(payload.tint).toBe("#FFE5D0");
    expect(payload.productIds).toEqual([3, 5]);
    expect(dayjs(payload.startAt).format("HH:mm")).toBe("00:00");
    expect(dayjs(payload.endAt).format("HH:mm")).toBe("23:59");
  });
});

describe("sipariş filtreleri ve servis", () => {
  afterEach(() => jest.clearAllMocks());

  it("tarih aralığını from/to olarak, diğer filtreleri olduğu gibi gönderir", async () => {
    const query = orderFiltersToQuery({ status: "Received", dateRange: [dayjs("2026-10-01T12:00:00"), null], page: 1, pageSize: 20 });
    expect(query.status).toBe("Received");
    expect(query.from).toBeDefined();
    expect(query.to).toBeUndefined();
    await storeOrderService.getOrders({ ...query, paymentStatus: "Pending" });
    const url = apiClient.get.mock.calls[0][0];
    expect(url).toMatch(/^\/api\/admin\/store\/orders\?/);
    expect(url).toContain("status=Received");
    expect(url).toContain("paymentStatus=Pending");
    expect(url).toContain("from=");
  });

  it("stok düzeltme ve durum güncelleme doğru uçlara gider", async () => {
    await storeProductService.adjustStock(9, { delta: -3, note: "Sayım" });
    expect(apiClient.patch).toHaveBeenCalledWith("/api/admin/store/products/9/stock", { delta: -3, note: "Sayım" });
    await storeOrderService.updateStatus(4, { status: "Shipped", note: null });
    expect(apiClient.patch).toHaveBeenCalledWith("/api/admin/store/orders/4/status", { status: "Shipped", note: null });
    await storeOrderService.updatePaymentStatus(4, { paymentStatus: "Paid", paymentReference: "DK-1", note: null });
    expect(apiClient.patch).toHaveBeenCalledWith("/api/admin/store/orders/4/payment-status", { paymentStatus: "Paid", paymentReference: "DK-1", note: null });
  });

  it("etiket yardımcıları", () => {
    expect(formatMoney(1349.9)).toMatch(/1\.349,90/);
    expect(formatMoney(null)).toBe("—");
    expect(describeActor("admin:12")).toBe("Yönetici #12");
    expect(describeActor("user:5")).toBe("Müşteri");
  });
});
