// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminDashboardController.cs.
//
//   GET /api/admin/dashboard/summary        -> getSummary()
//   GET /api/admin/dashboard/user-growth     -> getUserGrowth(dateRange)
//   GET /api/admin/dashboard/revenue         -> getRevenue(dateRange)
//   GET /api/admin/dashboard/subscriptions   -> getSubscriptions()
//   GET /api/admin/dashboard/activity        -> getActivity(dateRange)
//
// `dateRange` is `{ from?: string, to?: string }` (ISO date strings); the
// server defaults to "last 30 days" when either is omitted (see
// AdminDashboardDateRangeRequest).
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const dashboardService = {
  /** GET /api/admin/dashboard/summary -> AdminDashboardSummaryDto */
  getSummary() {
    return apiClient.get(`/api/admin/dashboard/summary`);
  },
  /** GET /api/admin/dashboard/user-growth -> AdminUserGrowthDto */
  getUserGrowth(dateRange) {
    const { from, to } = dateRange ?? {};
    return apiClient.get(`/api/admin/dashboard/user-growth${buildQuery({ from, to })}`);
  },
  /** GET /api/admin/dashboard/revenue -> AdminRevenueDto */
  getRevenue(dateRange) {
    const { from, to } = dateRange ?? {};
    return apiClient.get(`/api/admin/dashboard/revenue${buildQuery({ from, to })}`);
  },
  /** GET /api/admin/dashboard/subscriptions -> AdminDashboardSubscriptionsDto */
  getSubscriptions() {
    return apiClient.get(`/api/admin/dashboard/subscriptions`);
  },
  /** GET /api/admin/dashboard/activity -> AdminDashboardActivityDto */
  getActivity(dateRange) {
    const { from, to } = dateRange ?? {};
    return apiClient.get(`/api/admin/dashboard/activity${buildQuery({ from, to })}`);
  },
};
