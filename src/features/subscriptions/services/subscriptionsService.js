// Mock implementations of AdminSubscriptionProductController,
// AdminSubscriptionController, and AdminSubscriptionTransactionController
// (see MerfitApi repo: MerfitApi.Api/Controllers/Admin/*.cs). Method names
// mirror the real endpoints one to one:
//
//   GET/POST /api/admin/subscription-products[...]  -> subscriptionProductService.*
//   GET/PATCH /api/admin/subscriptions[...]          -> subscriptionService.*        (no create/delete — read + status only)
//   GET /api/admin/subscription-transactions[...]    -> transactionService.*          (fully read-only)
import {
  subscriptionProductsMockData,
  productFeaturesMockData,
  subscriptionsMockData,
  transactionsMockData,
} from "../data/subscriptionsMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let products = [...subscriptionProductsMockData];
let subscriptions = [...subscriptionsMockData];
const transactions = [...transactionsMockData];

export const subscriptionProductService = {
  /** GET /api/admin/subscription-products — AdminSubscriptionProductListRequest */
  getProducts(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(products, {
      search: params.search,
      searchFields: ["name", "code"],
      filters: { isActive: params.isActive, billingPeriod: params.billingPeriod },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getProductById(id) {
    return simulateLatency(apiSuccess(products.find((p) => p.id === Number(id)) ?? null), 150);
  },
  /** POST /api/admin/subscription-products — AdminUpsertSubscriptionProductRequest */
  createProduct(payload) {
    const newProduct = {
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    products = [newProduct, ...products];
    return simulateLatency(apiSuccess(newProduct), 250);
  },
  /** PUT /api/admin/subscription-products/{id} */
  updateProduct(id, payload) {
    products = products.map((p) =>
      p.id === Number(id) ? { ...p, ...payload, updatedAt: new Date().toISOString() } : p,
    );
    return simulateLatency(apiSuccess(products.find((p) => p.id === Number(id))), 250);
  },
  /** DELETE /api/admin/subscription-products/{id} */
  deleteProduct(id) {
    products = products.filter((p) => p.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
  /** PATCH /api/admin/subscription-products/{id}/status */
  updateStatus(id, { isActive }) {
    products = products.map((p) => (p.id === Number(id) ? { ...p, isActive } : p));
    return simulateLatency(apiSuccess(null), 200);
  },
  /** GET /api/admin/subscription-products/{id}/features */
  getFeatures(id) {
    return simulateLatency(apiSuccess(productFeaturesMockData[Number(id)] ?? []), 150);
  },
};

export const subscriptionService = {
  /** GET /api/admin/subscriptions — AdminSubscriptionListRequest (read + status only, no create/delete) */
  getSubscriptions(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(subscriptions, {
      search: params.search,
      searchFields: ["userEmail", "productName"],
      filters: {
        status: params.status,
        provider: params.provider,
        subscriptionProductId: params.subscriptionProductId,
      },
      dateRange: params.dateRange,
      dateField: "startedAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getSubscriptionById(id) {
    return simulateLatency(apiSuccess(subscriptions.find((s) => s.id === Number(id)) ?? null), 150);
  },
  /** PATCH /api/admin/subscriptions/{id}/status — AdminUpdateSubscriptionStatusRequest */
  updateStatus(id, { status, reason }) {
    subscriptions = subscriptions.map((s) => (s.id === Number(id) ? { ...s, status } : s));
    void reason;
    return simulateLatency(apiSuccess(null), 200);
  },
};

export const transactionService = {
  /** GET /api/admin/subscription-transactions — fully read-only */
  getTransactions(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(transactions, {
      search: params.search,
      searchFields: ["userEmail", "transactionId", "productId"],
      filters: { provider: params.provider, productId: params.productId },
      dateRange: params.dateRange,
      dateField: "purchasedAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getTransactionById(id) {
    return simulateLatency(apiSuccess(transactions.find((t) => t.id === Number(id)) ?? null), 150);
  },
};
