import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { App } from "antd";
import OrderDetailDrawer from "../components/OrderDetailDrawer";
import { storeOrderService } from "../services/storeService";

jest.mock("../services/storeService", () => ({
  storeOrderService: { getOrder: jest.fn(), updateStatus: jest.fn(), updatePaymentStatus: jest.fn() },
}));

beforeAll(() => {
  // jsdom (Jest 27) MessageChannel sağlamaz; antd Form izleyicisi bir makro görev için kullanır.
  if (typeof global.MessageChannel === "undefined") {
    global.MessageChannel = class {
      constructor() {
        this.port1 = { onmessage: null };
        this.port2 = { postMessage: (data) => setTimeout(() => this.port1.onmessage?.({ data }), 0) };
      }
    };
  }
  if (typeof global.ResizeObserver === "undefined") {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
});

const order = (overrides = {}) => ({
  id: 4,
  orderNumber: "MB-20261029-000004",
  userId: 7,
  userEmail: "ayse@example.com",
  recipientName: "Ayşe",
  status: "Received",
  paymentStatus: "Pending",
  paymentMethod: "BankTransfer",
  totalAmount: 649.9,
  currency: "TRY",
  itemCount: 1,
  createdAt: "2026-10-29T10:00:00Z",
  subtotal: 700,
  discountAmount: 100,
  shippingCost: 49.9,
  paymentReference: null,
  paidAt: null,
  cancelledAt: null,
  cancelReason: null,
  shippingAddress: { title: "Ev", recipientName: "Ayşe", phoneNumber: "0532", city: "İstanbul", district: "Kadıköy", addressLine: "Adres 1", postalCode: null },
  items: [{ id: 1, productId: 3, productName: "Whey", sku: "WHEY", brand: "PureLab", imageUrl: null, variantLabel: "2 kg", unitListPrice: 700, unitPrice: 600, quantity: 1, discountAmount: 100, lineTotal: 600 }],
  history: [{ status: "Received", paymentStatus: "Pending", changedBy: "user:7", note: null, createdAt: "2026-10-29T10:00:00Z" }],
  allowedStatusTransitions: ["Preparing", "Cancelled"],
  allowedPaymentTransitions: ["Paid", "Failed"],
  ...overrides,
});

const renderDrawer = (onChanged = jest.fn()) => {
  render(
    <App>
      <OrderDetailDrawer orderId={4} onClose={jest.fn()} onChanged={onChanged} />
    </App>,
  );
  return onChanged;
};

const pickOption = async (label, optionText) => {
  fireEvent.mouseDown(screen.getByLabelText(label));
  const option = await screen.findByTitle(optionText);
  fireEvent.click(option);
};

describe("OrderDetailDrawer", () => {
  afterEach(() => jest.clearAllMocks());

  it("sunucu verisini gösterir ve yalnızca izinli geçişleri sunar", async () => {
    storeOrderService.getOrder.mockResolvedValue({ data: order() });
    renderDrawer();
    expect(await screen.findByText("MB-20261029-000004")).toBeInTheDocument();
    expect(screen.getByText("Ödeme bekleniyor")).toBeInTheDocument();
    expect(screen.getByText("Havale / EFT")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText("Yeni durum"));
    expect(await screen.findByTitle("Hazırlanıyor")).toBeInTheDocument();
    expect(screen.getByTitle("İptal edildi")).toBeInTheDocument();
    expect(screen.queryByTitle("Kargoda")).not.toBeInTheDocument();
  });

  it("durum güncellemesi sunucuya gider ve dönen siparişi gösterir", async () => {
    storeOrderService.getOrder.mockResolvedValue({ data: order() });
    storeOrderService.updateStatus.mockResolvedValue({
      data: order({ status: "Preparing", allowedStatusTransitions: ["Shipped", "Cancelled"] }),
    });
    const onChanged = renderDrawer();
    await screen.findByText("MB-20261029-000004");
    await pickOption("Yeni durum", "Hazırlanıyor");
    fireEvent.click(screen.getByRole("button", { name: /Durumu güncelle/ }));
    await waitFor(() => expect(storeOrderService.updateStatus).toHaveBeenCalledWith(4, { status: "Preparing", note: null }));
    await waitFor(() => expect(onChanged).toHaveBeenCalled());
  });

  it("sunucu 409 dönerse hata mesajı gösterir ve siparişi yeniden yükler", async () => {
    storeOrderService.getOrder.mockResolvedValue({ data: order() });
    const conflict = Object.assign(new Error("Sipariş durumu değişti. Lütfen sayfayı yenileyin."), { status: 409, errors: [] });
    storeOrderService.updatePaymentStatus.mockRejectedValue(conflict);
    const onChanged = renderDrawer();
    await screen.findByText("MB-20261029-000004");
    await pickOption("Yeni ödeme durumu", "Ödendi");
    fireEvent.change(screen.getByLabelText("Ödeme referansı"), { target: { value: " DK-55 " } });
    fireEvent.click(screen.getByRole("button", { name: /Ödeme durumunu güncelle/ }));
    await waitFor(() =>
      expect(storeOrderService.updatePaymentStatus).toHaveBeenCalledWith(4, { paymentStatus: "Paid", paymentReference: "DK-55", note: null }),
    );
    expect(await screen.findByText(/Sipariş durumu değişti/)).toBeInTheDocument();
    await waitFor(() => expect(storeOrderService.getOrder).toHaveBeenCalledTimes(2));
    expect(onChanged).not.toHaveBeenCalled();
  });

  it("geçiş yoksa işlem formu göstermez", async () => {
    storeOrderService.getOrder.mockResolvedValueOnce({ data: order({ status: "Delivered", paymentStatus: "Paid", allowedStatusTransitions: [], allowedPaymentTransitions: [] }) });
    renderDrawer();
    expect(await screen.findByText("Bu sipariş için başka durum geçişi yok.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Durumu güncelle/ })).not.toBeInTheDocument();
  });

  it("yükleme hatasında tekrar dene gösterir", async () => {
    storeOrderService.getOrder.mockRejectedValueOnce(new Error("Sunucuya ulaşılamadı.")).mockResolvedValueOnce({ data: order() });
    renderDrawer();
    expect(await screen.findByText("Sunucuya ulaşılamadı.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Tekrar dene/ }));
    expect(await screen.findByText("MB-20261029-000004")).toBeInTheDocument();
    expect(within(document.body).getByText("Whey")).toBeInTheDocument();
  });
});
