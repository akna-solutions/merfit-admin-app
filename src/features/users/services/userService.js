// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminUserController.cs. Method names mirror
// the real endpoints one to one:
//
//   GET    /api/admin/users                     -> getUsers(params)
//   GET    /api/admin/users/{id}                 -> getUserById(id)
//   PATCH  /api/admin/users/{id}/status          -> updateStatus(id, { isActive, reason })
//   DELETE /api/admin/users/{id}                 -> deleteUser(id)          (soft-delete)
//   PATCH  /api/admin/users/{id}/restore         -> restoreUser(id)
//   GET    /api/admin/users/{id}/profile         -> getProfile(id)
//   GET    /api/admin/users/{id}/subscriptions   -> getSubscriptions(id, params)
//   GET    /api/admin/users/{id}/workouts        -> getWorkoutSessions(id, params)
//   GET    /api/admin/users/{id}/workout-plans   -> getWorkoutPlans(id, params)
//   GET    /api/admin/users/{id}/meals           -> getMeals(id, params)
//   GET    /api/admin/users/{id}/nutrition-goals -> getNutritionGoal(id)
//   GET    /api/admin/users/{id}/water-logs      -> getWaterLogs(id, params)
//   GET    /api/admin/users/{id}/measurements    -> getMeasurements(id, params)
//   GET    /api/admin/users/{id}/score           -> getScore(id)
//   GET    /api/admin/users/{id}/score-history   -> getScoreHistory(id, params)
//   GET    /api/admin/users/{id}/score-breakdown -> getScoreBreakdown(id)
//   GET    /api/admin/users/{id}/achievements    -> getAchievements(id, params)
//   GET    /api/admin/users/{id}/devices         -> getDevices(id, params)
//   GET    /api/admin/users/{id}/consents        -> getConsents(id, params)
//
// Every endpoint is behind the "AdminOnly" policy, so apiClient automatically
// attaches the stored Bearer token to each call. Responses already arrive in
// the exact ApiResponse<T> / PagedResult<T> envelope this app's hooks
// (useUsers) and components expect.
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const userService = {
  /** GET /api/admin/users — AdminUserListRequest */
  getUsers(params = {}) {
    const {
      page = 1, pageSize = 20, search, isActive, emailConfirmed,
      subscriptionStatus, dateRange, lastLoginFrom, lastLoginTo, includeDeleted,
    } = params;
    const [createdFrom, createdTo] = dateRange ?? [];
    return apiClient.get(
      `/api/admin/users${buildQuery({
        page, pageSize,
        // AdminUserListRequest has separate Email/Username filters; the UI's
        // single free-text "search" box maps to both so either field matches.
        email: search, username: search,
        isActive, emailConfirmed, subscriptionStatus,
        createdFrom, createdTo, lastLoginFrom, lastLoginTo, includeDeleted,
      })}`,
    );
  },

  /** GET /api/admin/users/{userId} — AdminUserDetailDto */
  getUserById(id) {
    return apiClient.get(`/api/admin/users/${id}`);
  },

  /** PATCH /api/admin/users/{userId}/status — AdminUpdateUserStatusRequest */
  updateStatus(id, { isActive, reason }) {
    return apiClient.patch(`/api/admin/users/${id}/status`, { isActive, reason });
  },

  /** DELETE /api/admin/users/{userId} — soft delete */
  deleteUser(id) {
    return apiClient.delete(`/api/admin/users/${id}`);
  },

  /** PATCH /api/admin/users/{userId}/restore */
  restoreUser(id) {
    return apiClient.patch(`/api/admin/users/${id}/restore`);
  },

  /** GET /api/admin/users/{userId}/profile */
  getProfile(id) {
    return apiClient.get(`/api/admin/users/${id}/profile`);
  },

  /** GET /api/admin/users/{userId}/subscriptions — PagedRequest */
  getSubscriptions(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/subscriptions${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/workouts — PagedRequest */
  getWorkoutSessions(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/workouts${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/workout-plans — PagedRequest */
  getWorkoutPlans(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/workout-plans${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/meals — PagedRequest */
  getMeals(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/meals${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/nutrition-goals */
  getNutritionGoal(id) {
    return apiClient.get(`/api/admin/users/${id}/nutrition-goals`);
  },

  /** GET /api/admin/users/{userId}/water-logs — PagedRequest */
  getWaterLogs(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/water-logs${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/measurements — PagedRequest */
  getMeasurements(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/measurements${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/score */
  getScore(id) {
    return apiClient.get(`/api/admin/users/${id}/score`);
  },

  /** GET /api/admin/users/{userId}/score-history — PagedRequest */
  getScoreHistory(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/score-history${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/score-breakdown */
  getScoreBreakdown(id) {
    return apiClient.get(`/api/admin/users/${id}/score-breakdown`);
  },

  /** GET /api/admin/users/{userId}/achievements — PagedRequest */
  getAchievements(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/achievements${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/devices — PagedRequest */
  getDevices(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/devices${buildQuery({ page, pageSize })}`);
  },

  /** GET /api/admin/users/{userId}/consents — PagedRequest (read-only) */
  getConsents(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/users/${id}/consents${buildQuery({ page, pageSize })}`);
  },

  // Not part of AdminUserController — AdminSupportTicketController's list
  // endpoint accepts a `userId` filter (spec §5's Support Tickets tab), so
  // this is a thin convenience wrapper around GET /api/admin/support/tickets.
  getSupportTickets(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/support/tickets${buildQuery({ page, pageSize, userId: id })}`);
  },
};
