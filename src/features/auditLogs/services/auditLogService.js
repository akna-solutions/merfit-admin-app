// Mock implementation of AdminAuditLogController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminAuditLogController.cs). Fully
// read-only — audit records can never be edited or deleted from the panel.
import { auditLogsMockData } from "../data/auditLogsMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

const auditLogs = [...auditLogsMockData];

export const auditLogService = {
  /** GET /api/admin/audit-logs — AdminAuditLogListRequest */
  getAuditLogs(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(auditLogs, {
      search: params.search,
      searchFields: ["adminEmail", "entity", "action"],
      filters: { adminUserId: params.adminUserId, action: params.action, entity: params.entity },
      dateRange: params.dateRange,
      dateField: "createdAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  /** GET /api/admin/audit-logs/{id} */
  getAuditLogById(id) {
    return simulateLatency(apiSuccess(auditLogs.find((a) => a.id === Number(id)) ?? null), 150);
  },
};
