// Mock implementation of AdminUserController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminUserController.cs). Method names and
// the shape of each argument/return value mirror the real endpoints one to
// one so swapping this file's body for real HTTP calls later requires no
// changes in useUsers.js or any component:
//
//   GET    /api/admin/users                     -> getUsers(params)
//   GET    /api/admin/users/{id}                 -> getUserById(id)
//   PATCH  /api/admin/users/{id}/status          -> updateStatus(id, { isActive, reason })
//   DELETE /api/admin/users/{id}                 -> deleteUser(id)          (soft-delete)
//   PATCH  /api/admin/users/{id}/restore         -> restoreUser(id)
//   GET    /api/admin/users/{id}/profile         -> getProfile(id)
//   GET    /api/admin/users/{id}/workouts        -> getWorkoutSessions(id, params)
//   GET    /api/admin/users/{id}/meals           -> getMeals(id, params)
//   GET    /api/admin/users/{id}/nutrition-goals -> getNutritionGoal(id)
//   GET    /api/admin/users/{id}/measurements    -> getMeasurements(id, params)
//   GET    /api/admin/users/{id}/score           -> getScore(id)
//   GET    /api/admin/users/{id}/score-history   -> getScoreHistory(id, params)
//   GET    /api/admin/users/{id}/score-breakdown -> getScoreBreakdown(id)
//   GET    /api/admin/users/{id}/achievements    -> getAchievements(id, params)
//   GET    /api/admin/users/{id}/devices         -> getDevices(id, params)
//
// Every method returns the ApiResponse<T> / PagedResult<T> envelope via
// apiSuccess/apiPagedSuccess so callers already unwrap `.data` the same way
// they will against the real API.
import {
  usersMockData,
  getUserWorkoutSessions,
  getUserMeals,
  getUserNutritionGoal,
  getUserMeasurements,
  getUserScoreBreakdown,
  getUserScoreHistory,
  getUserAchievementsList,
  getUserDevices,
  getUserSupportTickets,
  getUserSubscriptions,
} from "../data/usersMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let users = [...usersMockData];

function toDetailDto(user) {
  const {
    avatarColor, phoneNumber, heightCm, weightKg, targetWeightKg, gender, goal,
    experienceLevel, activityLevel, trainingLocation, trainingDaysPerWeek,
    unitSystem, devicePlatform, ...rest
  } = user;

  return {
    id: rest.id,
    email: rest.email,
    userName: rest.userName,
    phoneNumber,
    role: rest.role,
    isActive: rest.isActive,
    emailConfirmed: rest.emailConfirmed,
    phoneNumberConfirmed: true,
    isDeleted: rest.isDeleted,
    deletedAt: rest.isDeleted ? rest.createdAt : null,
    createdAt: rest.createdAt,
    lastLoginAt: rest.lastLoginAt,
    profile: {
      firstName: rest.firstName,
      lastName: rest.lastName,
      username: rest.userName,
      dateOfBirth: null,
      gender,
      heightCm,
      weightKg,
      targetWeightKg,
      profileImageUrl: null,
      goal,
      experienceLevel,
      activityLevel,
      trainingLocation,
      trainingDaysPerWeek,
      unitSystem,
    },
    currentSubscriptionStatus: rest.subscriptionStatus,
    currentSubscriptionProductName: rest.currentSubscriptionProductName,
    currentSubscriptionExpiresAt: rest.currentSubscriptionExpiresAt,
    latestMerfitScore: rest.latestMerfitScore,
    currentStreak: rest.currentStreak,
    longestStreak: rest.longestStreak,
    totalWorkoutSessions: rest.totalWorkoutSessions,
    totalAchievements: rest.totalAchievements,
    // Non-API convenience fields the detail drawer still uses for display.
    avatarColor,
    devicePlatform,
  };
}

export const userService = {
  /** GET /api/admin/users — AdminUserListRequest */
  getUsers(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    // subscriptionStatus="none" means "users with no subscription at all",
    // i.e. the field is null — queryRows' generic exact-match filter treats
    // null/undefined as "no filter", so that one case is special-cased here.
    const base = params.subscriptionStatus === "none"
      ? users.filter((u) => !u.subscriptionStatus)
      : users;

    const result = queryRows(base, {
      search: params.search,
      searchFields: ["email", "userName", "firstName", "lastName"],
      filters: {
        isActive: params.isActive,
        subscriptionStatus:
          params.subscriptionStatus === "none" ? undefined : params.subscriptionStatus,
      },
      dateRange: params.dateRange,
      dateField: "createdAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  /** GET /api/admin/users/{userId} */
  getUserById(id) {
    const user = users.find((u) => u.id === Number(id));
    if (!user) return simulateLatency(apiSuccess(null), 150);
    return simulateLatency(apiSuccess(toDetailDto(user)), 200);
  },

  /** PATCH /api/admin/users/{userId}/status — AdminUpdateUserStatusRequest */
  updateStatus(id, { isActive, reason }) {
    users = users.map((u) => (u.id === Number(id) ? { ...u, isActive } : u));
    void reason; // audit-logged server-side once real; no-op for the mock
    return simulateLatency(apiSuccess(null), 200);
  },

  /** DELETE /api/admin/users/{userId} — soft delete */
  deleteUser(id) {
    users = users.map((u) => (u.id === Number(id) ? { ...u, isDeleted: true, isActive: false } : u));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** PATCH /api/admin/users/{userId}/restore */
  restoreUser(id) {
    users = users.map((u) => (u.id === Number(id) ? { ...u, isDeleted: false } : u));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** GET /api/admin/users/{userId}/workouts */
  getWorkoutSessions(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = getUserWorkoutSessions(id);
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  /** GET /api/admin/users/{userId}/meals */
  getMeals(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = getUserMeals(id);
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  /** GET /api/admin/users/{userId}/nutrition-goals */
  getNutritionGoal(id) {
    return simulateLatency(apiSuccess(getUserNutritionGoal(id)), 150);
  },

  /** GET /api/admin/users/{userId}/measurements */
  getMeasurements(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = getUserMeasurements(id);
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  /** GET /api/admin/users/{userId}/score-breakdown */
  getScoreBreakdown(id) {
    const user = users.find((u) => u.id === Number(id));
    return simulateLatency(apiSuccess(getUserScoreBreakdown(user ?? {})), 150);
  },

  /** GET /api/admin/users/{userId}/score-history */
  getScoreHistory(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = getUserScoreHistory(id);
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  /** GET /api/admin/users/{userId}/achievements */
  getAchievements(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = getUserAchievementsList(id);
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  /** GET /api/admin/users/{userId}/devices */
  getDevices(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const user = users.find((u) => u.id === Number(id));
    const items = getUserDevices(id, user?.devicePlatform);
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  /** GET /api/admin/users/{userId}/subscriptions */
  getSubscriptions(id, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const items = getUserSubscriptions(id);
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  // Not part of AdminUserController — modeled after the expected
  // AdminSupportTicketController `userId` filter (spec §5's Support Tickets
  // tab). Swap for ticketService.getTickets({ userId }) once that lands.
  getSupportTickets(id) {
    return simulateLatency(apiSuccess(getUserSupportTickets(id)), 150);
  },
};
