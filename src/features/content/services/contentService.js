// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminContentController.cs
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const contentService = {
  /** GET /api/admin/content — AdminContentListRequest */
  getContent(params = {}) {
    const { page = 1, pageSize = 20, search, type, isActive, dateRange } = params;
    void dateRange; // no date filter on AdminContentListRequest server-side
    return apiClient.get(`/api/admin/content${buildQuery({ page, pageSize, search, type, isActive })}`);
  },

  /** GET /api/admin/content/{id} */
  getContentById(id) {
    return apiClient.get(`/api/admin/content/${id}`);
  },

  /** POST /api/admin/content — AdminUpsertContentRequest */
  createContent(payload) {
    return apiClient.post(`/api/admin/content`, payload);
  },

  /** PUT /api/admin/content/{id} — AdminUpsertContentRequest */
  updateContent(id, payload) {
    return apiClient.put(`/api/admin/content/${id}`, payload);
  },

  /** DELETE /api/admin/content/{id} */
  deleteContent(id) {
    return apiClient.delete(`/api/admin/content/${id}`);
  },

  /** PATCH /api/admin/content/{id}/status — AdminUpdateContentStatusRequest */
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/content/${id}/status`, { isActive });
  },

  /** POST /api/admin/content/{id}/publish */
  publish(id) {
    return apiClient.post(`/api/admin/content/${id}/publish`);
  },
};
