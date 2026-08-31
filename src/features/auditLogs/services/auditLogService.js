// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminAuditLogController.cs. Fully
// read-only — audit records can never be edited or deleted from the panel.
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const auditLogService = {
  /** GET /api/admin/audit-logs — AdminAuditLogListRequest */
  getAuditLogs(params = {}) {
    const { page = 1, pageSize = 20, search, adminUserId, action, entity, entityId, dateRange } = params;
    const [from, to] = dateRange ?? [];
    return apiClient.get(
      `/api/admin/audit-logs${buildQuery({ page, pageSize, search, adminUserId, action, entity, entityId, from, to })}`,
    );
  },

  /** GET /api/admin/audit-logs/{id} */
  getAuditLogById(id) {
    return apiClient.get(`/api/admin/audit-logs/${id}`);
  },
};
