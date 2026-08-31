// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminSubscriptionProductController.cs,
// AdminSubscriptionController.cs, and AdminSubscriptionTransactionController.cs.
//
//   GET/POST /api/admin/subscription-products[...]  -> subscriptionProductService.*
//   GET/PATCH /api/admin/subscriptions[...]          -> subscriptionService.*        (no create/delete — read + status only)
//   GET /api/admin/subscription-transactions[...]    -> transactionService.*          (fully read-only)
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const subscriptionProductService = {
  /** GET /api/admin/subscription-products — AdminSubscriptionProductListRequest */
  getProducts(params = {}) {
    const { page = 1, pageSize = 20, search, isActive, billingPeriod } = params;
    return apiClient.get(
      `/api/admin/subscription-products${buildQuery({ page, pageSize, search, isActive, billingPeriod })}`,
    );
  },
  /** GET /api/admin/subscription-products/{id} */
  getProductById(id) {
    return apiClient.get(`/api/admin/subscription-products/${id}`);
  },
  /** POST /api/admin/subscription-products — AdminUpsertSubscriptionProductRequest */
  createProduct(payload) {
    return apiClient.post(`/api/admin/subscription-products`, payload);
  },
  /** PUT /api/admin/subscription-products/{id} — AdminUpsertSubscriptionProductRequest */
  updateProduct(id, payload) {
    return apiClient.put(`/api/admin/subscription-products/${id}`, payload);
  },
  /** DELETE /api/admin/subscription-products/{id} */
  deleteProduct(id) {
    return apiClient.delete(`/api/admin/subscription-products/${id}`);
  },
  /** PATCH /api/admin/subscription-products/{id}/status — AdminUpdateSubscriptionProductStatusRequest */
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/subscription-products/${id}/status`, { isActive });
  },
  /** GET /api/admin/subscription-products/{id}/features */
  getFeatures(id) {
    return apiClient.get(`/api/admin/subscription-products/${id}/features`);
  },
  /** PUT /api/admin/subscription-products/{id}/features — AdminSetSubscriptionProductFeaturesRequest (replace-all) */
  setFeatures(id, featureIds) {
    return apiClient.put(`/api/admin/subscription-products/${id}/features`, { featureIds });
  },
};

export const subscriptionService = {
  /** GET /api/admin/subscriptions — AdminSubscriptionListRequest (read + status only, no create/delete) */
  getSubscriptions(params = {}) {
    const { page = 1, pageSize = 20, search, status, provider, subscriptionProductId, dateRange } = params;
    const [startedFrom, startedTo] = dateRange ?? [];
    return apiClient.get(
      `/api/admin/subscriptions${buildQuery({
        page, pageSize, search, status, provider, subscriptionProductId, startedFrom, startedTo,
      })}`,
    );
  },
  /** GET /api/admin/subscriptions/{id} */
  getSubscriptionById(id) {
    return apiClient.get(`/api/admin/subscriptions/${id}`);
  },
  /** PATCH /api/admin/subscriptions/{id}/status — AdminUpdateSubscriptionStatusRequest */
  updateStatus(id, { status, reason }) {
    return apiClient.patch(`/api/admin/subscriptions/${id}/status`, { status, reason });
  },
};

export const transactionService = {
  /** GET /api/admin/subscription-transactions — fully read-only */
  getTransactions(params = {}) {
    const { page = 1, pageSize = 20, search, provider, productId, dateRange } = params;
    const [from, to] = dateRange ?? [];
    return apiClient.get(
      `/api/admin/subscription-transactions${buildQuery({ page, pageSize, search, provider, productId, from, to })}`,
    );
  },
  /** GET /api/admin/subscription-transactions/{id} */
  getTransactionById(id) {
    return apiClient.get(`/api/admin/subscription-transactions/${id}`);
  },
};
