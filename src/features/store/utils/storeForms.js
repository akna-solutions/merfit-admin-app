import dayjs from "dayjs";

// Form <-> API dönüşümleri ve sunucudaki doğrulamaların istemci tarafı kopyaları (kullanıcıya erken geri bildirim
// için). Asıl kurallar MerfitApi'dedir; sunucu her isteği yeniden doğrular.

export const VARIANT_ID_PATTERN = /^[a-z0-9_-]{1,40}$/;
export const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
export const SKU_PATTERN = /^[A-Za-z0-9._-]+$/;
const HTTPS_URL = /^https:\/\/\S+$/i;

const blankToNull = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
};

const toNumberOrNull = (value) => (value === undefined || value === null || value === "" ? null : Number(value));

/** antd Form kuralı: boş değer serbest, doluysa https adresi olmalı (sunucu yalnızca https kabul eder). */
export const httpsUrlRule = (message = "Adres https:// ile başlamalıdır") => ({
  validator: (_, value) => (!value || HTTPS_URL.test(String(value).trim()) ? Promise.resolve() : Promise.reject(new Error(message))),
});

// ---------- Kategori ----------

export function categoryToFormValues(item) {
  if (!item) return { isActive: true, sortOrder: 0 };
  return {
    name: item.name,
    slug: item.slug,
    description: item.description ?? undefined,
    imageUrl: item.imageUrl ?? undefined,
    icon: item.icon ?? undefined,
    parentCategoryId: item.parentCategoryId ?? undefined,
    isActive: item.isActive,
    sortOrder: item.sortOrder ?? 0,
  };
}

/** AdminUpsertStoreCategoryRequest */
export function categoryToPayload(values) {
  return {
    name: String(values.name ?? "").trim(),
    slug: blankToNull(values.slug),
    description: blankToNull(values.description),
    imageUrl: blankToNull(values.imageUrl),
    icon: blankToNull(values.icon),
    parentCategoryId: values.parentCategoryId ?? null,
    isActive: Boolean(values.isActive),
    sortOrder: Number(values.sortOrder ?? 0),
  };
}

// ---------- Ürün ----------

export function productToFormValues(item) {
  if (!item) {
    return { isActive: true, isFeatured: false, sortOrder: 0, stockQuantity: 0, features: [], specs: [], variants: [], imageUrls: [] };
  }
  const images = [...(item.images ?? [])].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);
  return {
    name: item.name,
    slug: item.slug,
    sku: item.sku,
    brand: item.brand,
    categoryId: item.categoryId,
    description: item.description,
    price: item.price,
    discountPrice: item.discountPrice ?? undefined,
    stockQuantity: item.stockQuantity,
    isActive: item.isActive,
    isFeatured: item.isFeatured,
    sortOrder: item.sortOrder ?? 0,
    features: item.features ?? [],
    specs: (item.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
    variants: (item.variants ?? []).map((g) => ({
      id: g.id,
      label: g.label,
      kind: g.kind || "option",
      options: (g.options ?? []).map((o) => ({ id: o.id, label: o.label, priceDelta: o.priceDelta ?? 0, inStock: o.inStock !== false, swatch: o.swatch ?? undefined })),
    })),
    imageUrls: images.map((i) => i.imageUrl),
  };
}

/**
 * Form değerlerini AdminUpsertProductRequest gövdesine çevirir. İlk görsel ana görsel olur.
 * isEdit true ise stockQuantity gönderilmez anlamı taşımaz: sunucu güncellemede stoğu değiştirmez (stok için ayrı uç).
 */
export function productToPayload(values) {
  return {
    name: String(values.name ?? "").trim(),
    slug: blankToNull(values.slug),
    sku: String(values.sku ?? "").trim().toUpperCase(),
    brand: String(values.brand ?? "").trim(),
    categoryId: Number(values.categoryId),
    description: String(values.description ?? "").trim(),
    price: Number(values.price),
    discountPrice: toNumberOrNull(values.discountPrice),
    stockQuantity: Number(values.stockQuantity ?? 0),
    isActive: Boolean(values.isActive),
    isFeatured: Boolean(values.isFeatured),
    sortOrder: Number(values.sortOrder ?? 0),
    features: (values.features ?? []).map((f) => String(f ?? "").trim()).filter(Boolean),
    specs: (values.specs ?? [])
      .map((s) => ({ label: String(s?.label ?? "").trim(), value: String(s?.value ?? "").trim() }))
      .filter((s) => s.label && s.value),
    variants: (values.variants ?? []).map((g) => ({
      id: String(g.id ?? "").trim(),
      label: String(g.label ?? "").trim(),
      kind: g.kind || "option",
      options: (g.options ?? []).map((o) => ({
        id: String(o.id ?? "").trim(),
        label: String(o.label ?? "").trim(),
        priceDelta: Number(o.priceDelta ?? 0),
        inStock: o.inStock !== false,
        swatch: blankToNull(o.swatch),
      })),
    })),
    imageUrls: (values.imageUrls ?? []).map((u) => String(u ?? "").trim()).filter(Boolean),
  };
}

/** Sunucudaki fiyat/varyant kurallarının istemci kopyası; hata mesajlarının listesini döner (boşsa geçerli). */
export function validateProductPayload(payload) {
  const errors = [];
  if (payload.discountPrice !== null && payload.discountPrice >= payload.price) {
    errors.push("İndirimli fiyat, satış fiyatından düşük olmalıdır.");
  }
  const groupIds = new Set();
  payload.variants.forEach((group, gi) => {
    const name = group.label || `${gi + 1}. varyant grubu`;
    if (!VARIANT_ID_PATTERN.test(group.id)) errors.push(`${name}: kod yalnızca küçük harf, rakam, - ve _ içermelidir.`);
    if (groupIds.has(group.id)) errors.push(`${name}: aynı kodla iki varyant grubu olamaz.`);
    groupIds.add(group.id);
    if (group.options.length === 0) errors.push(`${name}: en az bir seçenek ekleyin.`);
    const optionIds = new Set();
    group.options.forEach((option) => {
      if (!VARIANT_ID_PATTERN.test(option.id)) errors.push(`${name} / ${option.label || "seçenek"}: kod geçersiz.`);
      if (optionIds.has(option.id)) errors.push(`${name}: "${option.id}" kodu tekrar ediyor.`);
      optionIds.add(option.id);
      const effective = (payload.discountPrice ?? payload.price) + option.priceDelta;
      if (effective <= 0) errors.push(`${name} / ${option.label}: fiyat farkıyla birlikte fiyat 0'dan büyük olmalıdır.`);
      if (option.swatch && !HEX_COLOR_PATTERN.test(option.swatch)) errors.push(`${name} / ${option.label}: renk #RRGGBB olmalıdır.`);
    });
    if (group.options.length > 0 && !group.options.some((o) => o.inStock)) errors.push(`${name}: en az bir seçenek stokta olmalıdır.`);
  });
  return errors;
}

// ---------- Mağaza kampanyası ----------

export function campaignToFormValues(item) {
  if (!item) return { isActive: true, sortOrder: 0, productIds: [] };
  return {
    title: item.title,
    description: item.description ?? undefined,
    imageUrl: item.imageUrl ?? undefined,
    tint: item.tint ?? undefined,
    sortOrder: item.sortOrder ?? 0,
    isActive: item.isActive,
    productIds: item.productIds ?? [],
    dateRange:
      item.startAt || item.endAt ? [item.startAt ? dayjs(item.startAt) : null, item.endAt ? dayjs(item.endAt) : null] : undefined,
  };
}

/** AdminUpsertStoreCampaignRequest */
export function campaignToPayload({ dateRange, ...values }) {
  const [start, end] = dateRange ?? [];
  return {
    title: String(values.title ?? "").trim(),
    description: blankToNull(values.description),
    imageUrl: blankToNull(values.imageUrl),
    tint: blankToNull(values.tint)?.toUpperCase() ?? null,
    sortOrder: Number(values.sortOrder ?? 0),
    isActive: Boolean(values.isActive),
    startAt: start ? start.startOf("day").toISOString() : null,
    endAt: end ? end.endOf("day").toISOString() : null,
    productIds: [...new Set((values.productIds ?? []).map(Number))],
  };
}

// ---------- Sipariş ----------

/** Sipariş listesi filtrelerini API sorgusuna çevirir (tarih aralığı günün başı/sonu, UTC). */
export function orderFiltersToQuery({ dateRange, ...filters }) {
  const [from, to] = dateRange ?? [];
  return {
    ...filters,
    from: from ? from.startOf("day").toISOString() : undefined,
    to: to ? to.endOf("day").toISOString() : undefined,
  };
}
