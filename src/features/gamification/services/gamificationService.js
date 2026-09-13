// Real MBFitApi calls (see MBFitApi repo, running at http://localhost:5000):
// MBFitApi.Api/Controllers/Admin/AdminScoreController.cs,
// AdminAchievementController.cs, AdminLeaderboardController.cs, and
// AdminRewardController.cs.
import { apiClient, buildQuery } from "../../../utils/apiClient";

// Display-only label maps — the underlying values below stay in English
// because they are matched against the API (query params, filters, DTOs).
export const LEADERBOARD_PERIOD_TYPE_LABELS = {
  Weekly: "Haftalık",
  Monthly: "Aylık",
  AllTime: "Tüm Zamanlar",
};

export const REWARD_TYPE_LABELS = {
  subscription: "Abonelik",
  physical: "Fiziksel Ürün",
  points: "Bonus Puan",
  service: "Hizmet",
};

export const scoreService = {
  /** GET /api/admin/scores — AdminScoreListRequest */
  getScores(params = {}) {
    const { page = 1, pageSize = 20, search } = params;
    return apiClient.get(`/api/admin/scores${buildQuery({ page, pageSize, search })}`);
  },
  /** GET /api/admin/scores/{userId} */
  getScoreByUserId(userId) {
    return apiClient.get(`/api/admin/scores/${userId}`);
  },
  /** POST /api/admin/users/{userId}/score/recalculate */
  recalculate(userId) {
    return apiClient.post(`/api/admin/users/${userId}/score/recalculate`);
  },
};

export const achievementService = {
  /** GET /api/admin/achievements — AdminAchievementListRequest */
  getAchievements(params = {}) {
    const { page = 1, pageSize = 20, search, isActive } = params;
    return apiClient.get(`/api/admin/achievements${buildQuery({ page, pageSize, search, isActive })}`);
  },
  /** GET /api/admin/achievements/{id} */
  getAchievementById(id) {
    return apiClient.get(`/api/admin/achievements/${id}`);
  },
  /** POST /api/admin/achievements — AdminUpsertAchievementRequest */
  createAchievement(payload) {
    return apiClient.post(`/api/admin/achievements`, payload);
  },
  /** PUT /api/admin/achievements/{id} — AdminUpsertAchievementRequest */
  updateAchievement(id, payload) {
    return apiClient.put(`/api/admin/achievements/${id}`, payload);
  },
  /** DELETE /api/admin/achievements/{id} */
  deleteAchievement(id) {
    return apiClient.delete(`/api/admin/achievements/${id}`);
  },
  /** PATCH /api/admin/achievements/{id}/status — AdminUpdateAchievementStatusRequest */
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/achievements/${id}/status`, { isActive });
  },
  /** GET /api/admin/achievements/{id}/users — PagedRequest */
  getUsers(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/achievements/${id}/users${buildQuery({ page, pageSize })}`);
  },
};

export const leaderboardService = {
  /** GET /api/admin/leaderboard-periods — AdminLeaderboardPeriodListRequest */
  getPeriods(params = {}) {
    const { page = 1, pageSize = 20, type, isActive } = params;
    return apiClient.get(`/api/admin/leaderboard-periods${buildQuery({ page, pageSize, type, isActive })}`);
  },
  /** GET /api/admin/leaderboard-periods/{id} */
  getPeriodById(id) {
    return apiClient.get(`/api/admin/leaderboard-periods/${id}`);
  },
  /** POST /api/admin/leaderboard-periods — AdminUpsertLeaderboardPeriodRequest */
  createPeriod(payload) {
    return apiClient.post(`/api/admin/leaderboard-periods`, payload);
  },
  /** PUT /api/admin/leaderboard-periods/{id} — AdminUpsertLeaderboardPeriodRequest */
  updatePeriod(id, payload) {
    return apiClient.put(`/api/admin/leaderboard-periods/${id}`, payload);
  },
  /** DELETE /api/admin/leaderboard-periods/{id} */
  deletePeriod(id) {
    return apiClient.delete(`/api/admin/leaderboard-periods/${id}`);
  },
  /** GET /api/admin/leaderboards/{periodId}/entries — PagedRequest */
  getEntries(periodId, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/api/admin/leaderboards/${periodId}/entries${buildQuery({ page, pageSize })}`);
  },
  /** POST /api/admin/leaderboards/{periodId}/recalculate */
  recalculate(periodId) {
    return apiClient.post(`/api/admin/leaderboards/${periodId}/recalculate`);
  },
};

export const rewardService = {
  /** GET /api/admin/rewards — AdminRewardListRequest */
  getRewards(params = {}) {
    const { page = 1, pageSize = 20, search, isActive, rewardType } = params;
    return apiClient.get(`/api/admin/rewards${buildQuery({ page, pageSize, search, isActive, rewardType })}`);
  },
  /** GET /api/admin/rewards/{id} */
  getRewardById(id) {
    return apiClient.get(`/api/admin/rewards/${id}`);
  },
  /** POST /api/admin/rewards — AdminUpsertRewardRequest */
  createReward(payload) {
    return apiClient.post(`/api/admin/rewards`, payload);
  },
  /** PUT /api/admin/rewards/{id} — AdminUpsertRewardRequest */
  updateReward(id, payload) {
    return apiClient.put(`/api/admin/rewards/${id}`, payload);
  },
  /** DELETE /api/admin/rewards/{id} */
  deleteReward(id) {
    return apiClient.delete(`/api/admin/rewards/${id}`);
  },
  /** PATCH /api/admin/rewards/{id}/status — AdminUpdateRewardStatusRequest */
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/rewards/${id}/status`, { isActive });
  },
  /** GET /api/admin/leaderboard-rewards — AdminLeaderboardRewardListRequest */
  getLeaderboardRewards(params = {}) {
    const { page = 1, pageSize = 20, leaderboardPeriodId } = params;
    return apiClient.get(`/api/admin/leaderboard-rewards${buildQuery({ page, pageSize, leaderboardPeriodId })}`);
  },
  /** POST /api/admin/leaderboard-rewards — AdminUpsertLeaderboardRewardRequest */
  createLeaderboardReward(payload) {
    return apiClient.post(`/api/admin/leaderboard-rewards`, payload);
  },
  /** PUT /api/admin/leaderboard-rewards/{id} — AdminUpsertLeaderboardRewardRequest */
  updateLeaderboardReward(id, payload) {
    return apiClient.put(`/api/admin/leaderboard-rewards/${id}`, payload);
  },
  /** DELETE /api/admin/leaderboard-rewards/{id} */
  deleteLeaderboardReward(id) {
    return apiClient.delete(`/api/admin/leaderboard-rewards/${id}`);
  },
};
