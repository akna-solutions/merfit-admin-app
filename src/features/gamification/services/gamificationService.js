// Mock implementations of AdminScoreController, AdminAchievementController,
// AdminLeaderboardController, and AdminRewardController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/*.cs).
import {
  scoresMockData,
  achievementsMockData,
  achievementEarnersMockData,
  leaderboardPeriodsMockData,
  leaderboardEntriesMockData,
  rewardsMockData,
} from "../data/gamificationMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let scores = [...scoresMockData];
let achievements = [...achievementsMockData];
let leaderboardPeriods = [...leaderboardPeriodsMockData];
const leaderboardEntries = { ...leaderboardEntriesMockData };
let rewards = [...rewardsMockData];

export const scoreService = {
  /** GET /api/admin/scores */
  getScores(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    const result = queryRows(sorted, {
      search: params.search,
      searchFields: ["userEmail"],
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  /** POST /api/admin/users/{userId}/score/recalculate */
  recalculate(userId) {
    const record = scores.find((s) => s.userId === Number(userId));
    const previousScore = record?.score ?? 0;
    const newScore = Math.min(100, Math.max(0, Math.round(previousScore + (Math.random() * 10 - 5))));
    scores = scores.map((s) =>
      s.userId === Number(userId) ? { ...s, score: newScore, calculatedAt: new Date().toISOString() } : s,
    );
    return simulateLatency(
      apiSuccess({ userId: Number(userId), previousScore, newScore, calculatedAt: new Date().toISOString() }),
      300,
    );
  },
};

export const achievementService = {
  /** GET /api/admin/achievements */
  getAchievements(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(achievements, {
      search: params.search,
      searchFields: ["title", "code"],
      filters: { isActive: params.isActive },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getAchievementById(id) {
    return simulateLatency(apiSuccess(achievements.find((a) => a.id === Number(id)) ?? null), 150);
  },
  /** POST /api/admin/achievements — AdminUpsertAchievementRequest */
  createAchievement(payload) {
    const newAchievement = {
      id: Math.max(0, ...achievements.map((a) => a.id)) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    achievements = [newAchievement, ...achievements];
    return simulateLatency(apiSuccess(newAchievement), 250);
  },
  updateAchievement(id, payload) {
    achievements = achievements.map((a) =>
      a.id === Number(id) ? { ...a, ...payload, updatedAt: new Date().toISOString() } : a,
    );
    return simulateLatency(apiSuccess(achievements.find((a) => a.id === Number(id))), 250);
  },
  deleteAchievement(id) {
    achievements = achievements.filter((a) => a.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
  updateStatus(id, { isActive }) {
    achievements = achievements.map((a) => (a.id === Number(id) ? { ...a, isActive } : a));
    return simulateLatency(apiSuccess(null), 200);
  },
  /** GET /api/admin/achievements/{id}/users */
  getUsers(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = achievementEarnersMockData[Number(id)] ?? [];
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },
};

export const leaderboardService = {
  /** GET /api/admin/leaderboard-periods */
  getPeriods(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(leaderboardPeriods, {
      filters: { type: params.type, isActive: params.isActive },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getPeriodById(id) {
    return simulateLatency(apiSuccess(leaderboardPeriods.find((p) => p.id === Number(id)) ?? null), 150);
  },
  /** POST /api/admin/leaderboard-periods — AdminUpsertLeaderboardPeriodRequest */
  createPeriod(payload) {
    const newPeriod = {
      id: Math.max(0, ...leaderboardPeriods.map((p) => p.id)) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    leaderboardPeriods = [newPeriod, ...leaderboardPeriods];
    leaderboardEntries[newPeriod.id] = [];
    return simulateLatency(apiSuccess(newPeriod), 250);
  },
  updatePeriod(id, payload) {
    leaderboardPeriods = leaderboardPeriods.map((p) => (p.id === Number(id) ? { ...p, ...payload } : p));
    return simulateLatency(apiSuccess(leaderboardPeriods.find((p) => p.id === Number(id))), 250);
  },
  deletePeriod(id) {
    leaderboardPeriods = leaderboardPeriods.filter((p) => p.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
  /** GET /api/admin/leaderboards/{periodId}/entries */
  getEntries(periodId, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = leaderboardEntries[Number(periodId)] ?? [];
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },
  /** POST /api/admin/leaderboards/{periodId}/recalculate */
  recalculate(periodId) {
    const entries = (leaderboardEntries[Number(periodId)] ?? [])
      .map((e) => ({ ...e, points: Math.max(0, e.points + Math.round(Math.random() * 40 - 20)) }))
      .sort((a, b) => b.points - a.points)
      .map((e, i) => ({ ...e, rank: i + 1 }));
    leaderboardEntries[Number(periodId)] = entries;
    return simulateLatency(
      apiSuccess({ leaderboardPeriodId: Number(periodId), entryCount: entries.length, recalculatedAt: new Date().toISOString() }),
      400,
    );
  },
};

export const rewardService = {
  /** GET /api/admin/rewards */
  getRewards(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(rewards, {
      search: params.search,
      searchFields: ["title"],
      filters: { isActive: params.isActive, rewardType: params.rewardType },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getRewardById(id) {
    return simulateLatency(apiSuccess(rewards.find((r) => r.id === Number(id)) ?? null), 150);
  },
  createReward(payload) {
    const newReward = {
      id: Math.max(0, ...rewards.map((r) => r.id)) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    rewards = [newReward, ...rewards];
    return simulateLatency(apiSuccess(newReward), 250);
  },
  updateReward(id, payload) {
    rewards = rewards.map((r) =>
      r.id === Number(id) ? { ...r, ...payload, updatedAt: new Date().toISOString() } : r,
    );
    return simulateLatency(apiSuccess(rewards.find((r) => r.id === Number(id))), 250);
  },
  deleteReward(id) {
    rewards = rewards.filter((r) => r.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
  updateStatus(id, { isActive }) {
    rewards = rewards.map((r) => (r.id === Number(id) ? { ...r, isActive } : r));
    return simulateLatency(apiSuccess(null), 200);
  },
};
