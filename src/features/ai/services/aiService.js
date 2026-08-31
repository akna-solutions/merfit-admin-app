// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminAiController.cs. Fully read-only — no
// create/update/delete anywhere in this controller.
//
//   GET /api/admin/ai/requests            -> getRequests(params)   AdminAiRequestListRequest
//   GET /api/admin/ai/requests/{id}        -> getRequestById(id)
//   GET /api/admin/ai/results             -> getResults(params)    AdminAiResultListRequest
//   GET /api/admin/ai/results/{id}         -> getResultById(id)
//   GET /api/admin/ai/statistics          -> getStatistics()
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const aiService = {
  /** GET /api/admin/ai/requests — AdminAiRequestListRequest */
  getRequests(params = {}) {
    const { page = 1, pageSize = 20, search, userId, type, status, model, dateRange } = params;
    const [from, to] = dateRange ?? [];
    return apiClient.get(
      `/api/admin/ai/requests${buildQuery({ page, pageSize, search, userId, type, status, model, from, to })}`,
    );
  },

  /** GET /api/admin/ai/requests/{id} */
  getRequestById(id) {
    return apiClient.get(`/api/admin/ai/requests/${id}`);
  },

  /** GET /api/admin/ai/results — AdminAiResultListRequest */
  getResults(params = {}) {
    const { page = 1, pageSize = 20, requestId } = params;
    return apiClient.get(`/api/admin/ai/results${buildQuery({ page, pageSize, requestId })}`);
  },

  /** GET /api/admin/ai/results/{id} */
  getResultById(id) {
    return apiClient.get(`/api/admin/ai/results/${id}`);
  },

  /** GET /api/admin/ai/statistics — AdminAiStatisticsDto */
  getStatistics() {
    return apiClient.get("/api/admin/ai/statistics");
  },
};
