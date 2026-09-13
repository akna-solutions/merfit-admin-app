// Real MBFitApi calls (see MBFitApi repo, running at http://localhost:5000):
// MBFitApi.Api/Controllers/Admin/AdminFaqController.cs
//
//   GET/POST/PUT/DELETE /api/admin/faq/categories[...]  -> faqCategoryService.*
//   GET/POST/PUT/DELETE /api/admin/faqs[...]            -> faqService.*
//   PATCH /api/admin/faqs/{id}/status                    -> faqService.updateStatus
//   PUT   /api/admin/faqs/order                           -> faqService.reorder
//
// Every endpoint here is behind the "AdminOnly" policy (AdminControllerBase),
// so apiClient automatically attaches the stored Bearer token to each call.
// Responses already arrive in the exact ApiResponse<T> / PagedResult<T>
// envelope this app's hooks (useListQuery) expect, so services just return
// the parsed response body as-is.
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const faqCategoryService = {
  /** GET /api/admin/faq/categories */
  getCategories(params = {}) {
    const { page = 1, pageSize = 50, search } = params;
    return apiClient.get(`/api/admin/faq/categories${buildQuery({ page, pageSize, search })}`);
  },
  /** GET /api/admin/faq/categories/{id} */
  getCategoryById(id) {
    return apiClient.get(`/api/admin/faq/categories/${id}`);
  },
  /** POST /api/admin/faq/categories — AdminUpsertFaqCategoryRequest */
  createCategory(payload) {
    return apiClient.post(`/api/admin/faq/categories`, payload);
  },
  /** PUT /api/admin/faq/categories/{id} — AdminUpsertFaqCategoryRequest */
  updateCategory(id, payload) {
    return apiClient.put(`/api/admin/faq/categories/${id}`, payload);
  },
  /** DELETE /api/admin/faq/categories/{id} */
  deleteCategory(id) {
    return apiClient.delete(`/api/admin/faq/categories/${id}`);
  },
};

export const faqService = {
  /** GET /api/admin/faqs — AdminFaqListRequest */
  getFaqs(params = {}) {
    const { page = 1, pageSize = 20, search, categoryId, isActive } = params;
    return apiClient.get(`/api/admin/faqs${buildQuery({ page, pageSize, search, categoryId, isActive })}`);
  },
  /** GET /api/admin/faqs/{id} */
  getFaqById(id) {
    return apiClient.get(`/api/admin/faqs/${id}`);
  },
  /** POST /api/admin/faqs — AdminUpsertFaqRequest */
  createFaq(payload) {
    return apiClient.post(`/api/admin/faqs`, payload);
  },
  /** PUT /api/admin/faqs/{id} — AdminUpsertFaqRequest */
  updateFaq(id, payload) {
    return apiClient.put(`/api/admin/faqs/${id}`, payload);
  },
  /** DELETE /api/admin/faqs/{id} */
  deleteFaq(id) {
    return apiClient.delete(`/api/admin/faqs/${id}`);
  },
  /** PATCH /api/admin/faqs/{id}/status — AdminUpdateFaqStatusRequest */
  updateStatus(id, payload) {
    return apiClient.patch(`/api/admin/faqs/${id}/status`, payload);
  },
  /** PUT /api/admin/faqs/order — AdminReorderFaqsRequest { items } */
  reorder(items) {
    return apiClient.put(`/api/admin/faqs/order`, { items });
  },
};
