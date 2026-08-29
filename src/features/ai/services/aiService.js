// Mock implementation of AdminAiController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminAiController.cs). Fully read-only —
// no create/update/delete anywhere in this controller.
//
//   GET /api/admin/ai/requests            -> getRequests(params)
//   GET /api/admin/ai/requests/{id}        -> getRequestById(id)
//   GET /api/admin/ai/results             -> getResults(params)
//   GET /api/admin/ai/results/{id}         -> getResultById(id)
//   GET /api/admin/ai/statistics          -> getStatistics()
import { aiRequestsMockData, aiResultsMockData, buildAiStatistics } from "../data/aiMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

const requests = [...aiRequestsMockData];
const results = [...aiResultsMockData];

export const aiService = {
  /** GET /api/admin/ai/requests — AdminAiRequestListRequest */
  getRequests(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(requests, {
      search: params.search,
      searchFields: ["userEmail"],
      filters: { type: params.type, status: params.status, model: params.model, userId: params.userId },
      dateRange: params.dateRange,
      dateField: "createdAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  getRequestById(id) {
    return simulateLatency(apiSuccess(requests.find((r) => r.id === Number(id)) ?? null), 150);
  },

  /** GET /api/admin/ai/results — AdminAiResultListRequest */
  getResults(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(results, {
      filters: { requestId: params.requestId },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  getResultById(id) {
    return simulateLatency(apiSuccess(results.find((r) => r.id === Number(id)) ?? null), 150);
  },

  /** GET /api/admin/ai/statistics */
  getStatistics() {
    return simulateLatency(apiSuccess(buildAiStatistics()), 250);
  },
};
