// Kod değerleri API ile birebir eşleşir (MerfitApi StoreEnums) — yalnızca etiketler Türkçe.
export const ORDER_STATUS_LABELS = {
  Received: "Alındı",
  Preparing: "Hazırlanıyor",
  Shipped: "Kargoda",
  Delivered: "Teslim edildi",
  Cancelled: "İptal edildi",
};

export const ORDER_STATUS_COLORS = {
  received: "blue",
  preparing: "gold",
  shipped: "cyan",
  delivered: "green",
  cancelled: "red",
};

export const PAYMENT_STATUS_LABELS = {
  Pending: "Ödeme bekleniyor",
  Paid: "Ödendi",
  Failed: "Başarısız",
  RefundPending: "İade bekleniyor",
  Refunded: "İade edildi",
  Cancelled: "İptal",
};

export const PAYMENT_STATUS_COLORS = {
  pending: "gold",
  paid: "green",
  failed: "red",
  refundpending: "orange",
  refunded: "purple",
  cancelled: "default",
};

export const PAYMENT_METHOD_LABELS = {
  CashOnDelivery: "Kapıda ödeme",
  BankTransfer: "Havale / EFT",
  Card: "Kart",
};

export const STORE_CAMPAIGN_STATUS_LABELS = {
  Live: "Yayında",
  Scheduled: "Planlandı",
  Ended: "Sona erdi",
  Passive: "Pasif",
};

export const STORE_CAMPAIGN_STATUS_COLORS = {
  live: "green",
  scheduled: "blue",
  ended: "default",
  passive: "red",
};

export const VARIANT_KIND_LABELS = {
  size: "Beden",
  color: "Renk",
  package: "Paket",
  option: "Seçenek",
};

const moneyFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

export function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return moneyFormatter.format(Number(value));
}

/** Sipariş geçmişindeki "admin:12" / "user:5" / "system" değerlerini okunur yapar. */
export function describeActor(changedBy) {
  if (!changedBy) return "—";
  const [kind, id] = String(changedBy).split(":");
  if (kind === "admin") return id ? `Yönetici #${id}` : "Yönetici";
  if (kind === "user") return "Müşteri";
  if (kind === "system") return "Sistem";
  return changedBy;
}
