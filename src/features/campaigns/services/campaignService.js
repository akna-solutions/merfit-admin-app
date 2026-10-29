// MerfitApi: MerfitApi.Api/Controllers/Admin/AdminCampaignController.cs
// Kampanyalar AppContent tablosunda Type = "Campaign" olarak tutulur; mobil ana sayfada gösterilir.
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const campaignService = {
  /** GET /api/admin/campaigns — AdminCampaignListRequest */
  getCampaigns(params = {}) {
    const { page = 1, pageSize = 50, search, isActive, status } = params;
    return apiClient.get(`/api/admin/campaigns${buildQuery({ page, pageSize, search, isActive, status })}`);
  },

  /** GET /api/admin/campaigns/{id} */
  getCampaignById(id) {
    return apiClient.get(`/api/admin/campaigns/${id}`);
  },

  /** POST /api/admin/campaigns — AdminUpsertCampaignRequest */
  createCampaign(payload) {
    return apiClient.post(`/api/admin/campaigns`, payload);
  },

  /** PUT /api/admin/campaigns/{id} — AdminUpsertCampaignRequest */
  updateCampaign(id, payload) {
    return apiClient.put(`/api/admin/campaigns/${id}`, payload);
  },

  /** DELETE /api/admin/campaigns/{id} */
  deleteCampaign(id) {
    return apiClient.delete(`/api/admin/campaigns/${id}`);
  },

  /** PATCH /api/admin/campaigns/{id}/status — aktif/pasif (arşivleme) */
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/campaigns/${id}/status`, { isActive });
  },

  /** PUT /api/admin/campaigns/order — AdminReorderCampaignsRequest */
  reorder(items) {
    return apiClient.put(`/api/admin/campaigns/order`, { items });
  },
};
