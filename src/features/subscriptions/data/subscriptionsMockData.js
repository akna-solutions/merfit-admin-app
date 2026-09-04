// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/SubscriptionProducts, .../Subscriptions,
// .../SubscriptionTransactions, and the matching Admin*Controller.cs files).

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// AdminSubscriptionProductDto[]
export const subscriptionProductsMockData = [
  {
    id: 1,
    code: "plus_monthly",
    name: "Merfit Plus — Aylık",
    storeProductIdIos: "com.merfit.plus.monthly",
    storeProductIdAndroid: "plus_monthly",
    billingPeriod: "Monthly",
    price: 149.99,
    currency: "TRY",
    isActive: true,
    createdAt: daysAgo(400),
    updatedAt: daysAgo(20),
  },
  {
    id: 2,
    code: "plus_yearly",
    name: "Merfit Plus — Yıllık",
    storeProductIdIos: "com.merfit.plus.yearly",
    storeProductIdAndroid: "plus_yearly",
    billingPeriod: "Yearly",
    price: 1199.99,
    currency: "TRY",
    isActive: true,
    createdAt: daysAgo(400),
    updatedAt: daysAgo(60),
  },
  {
    id: 3,
    code: "plus_monthly_promo",
    name: "Merfit Plus — Promosyonlu Aylık",
    storeProductIdIos: "com.merfit.plus.promo",
    storeProductIdAndroid: "plus_monthly_promo",
    billingPeriod: "Monthly",
    price: 99.99,
    currency: "TRY",
    isActive: false,
    createdAt: daysAgo(200),
    updatedAt: daysAgo(150),
  },
];

// AdminSubscriptionProductFeatureItemDto[] keyed by productId
export const productFeaturesMockData = {
  1: [
    { featureId: 1, featureCode: "ai_workouts", featureName: "Yapay Zeka Destekli Antrenmanlar" },
    { featureId: 2, featureCode: "no_ads", featureName: "Reklamsız Deneyim" },
  ],
  2: [
    { featureId: 1, featureCode: "ai_workouts", featureName: "Yapay Zeka Destekli Antrenmanlar" },
    { featureId: 2, featureCode: "no_ads", featureName: "Reklamsız Deneyim" },
    { featureId: 3, featureCode: "priority_support", featureName: "Öncelikli Destek" },
  ],
  3: [{ featureId: 2, featureCode: "no_ads", featureName: "Reklamsız Deneyim" }],
};

const USER_EMAILS = [
  "emreyilmaz001@example.com", "aysekaya002@example.com", "mehmetdemir003@example.com",
  "zeynepcelik004@example.com", "canahin005@example.com", "elifaydin006@example.com",
];
const STATUSES = ["Active", "Expired", "Cancelled", "Refunded", "Paused", "GracePeriod"];
const PROVIDERS = ["Apple", "Google"];

// AdminSubscriptionListItemDto[]
export const subscriptionsMockData = Array.from({ length: 30 }, (_, i) => {
  const seed = i + 1;
  const product = subscriptionProductsMockData[seed % subscriptionProductsMockData.length];
  const status = STATUSES[seed % STATUSES.length];
  const startedAt = daysAgo(30 + Math.floor(seeded(seed) * 300));
  return {
    id: seed,
    userId: 1 + (seed % 6),
    userEmail: USER_EMAILS[seed % USER_EMAILS.length],
    subscriptionProductId: product.id,
    productName: product.name,
    provider: PROVIDERS[seed % PROVIDERS.length],
    status,
    startedAt,
    expiresAt: status === "Active" ? daysAgo(-30 + (seed % 10)) : daysAgo(5 + (seed % 20)),
    autoRenew: status === "Active" && seed % 3 !== 0,
    cancelledAt: status === "Cancelled" ? daysAgo(5) : null,
    externalTransactionId: `txn_${1000000 + seed}`,
  };
});

// AdminSubscriptionTransactionListItemDto[] (+ Detail extras)
export const transactionsMockData = Array.from({ length: 30 }, (_, i) => {
  const seed = i + 1;
  const sub = subscriptionsMockData[seed % subscriptionsMockData.length];
  const product = subscriptionProductsMockData.find((p) => p.id === sub.subscriptionProductId);
  return {
    id: seed,
    subscriptionId: sub.id,
    userId: sub.userId,
    userEmail: sub.userEmail,
    transactionId: `txn_${2000000 + seed}`,
    productId: product?.code ?? "unknown",
    provider: sub.provider,
    amount: product?.price ?? 149.99,
    currency: product?.currency ?? "TRY",
    purchasedAt: sub.startedAt,
    expiresAt: sub.expiresAt,

    // Detail extras — RawReceipt is intentionally never returned in full.
    originalTransactionId: `txn_${2000000 + seed}`,
    hasRawReceipt: seed % 2 === 0,
  };
});
