// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminAnalyticsController.cs
//
// Fully read-only — seven snapshot endpoints, no query parameters at all.
// Every endpoint is behind the "AdminOnly" policy, so apiClient automatically
// attaches the stored Bearer token to each call. Responses already arrive in
// the ApiResponse<T> envelope this app's components expect.
import { apiClient } from "../../../utils/apiClient";

export const analyticsService = {
  /** GET /api/admin/analytics/users -> AdminAnalyticsUsersDto */
  getUsers: () => apiClient.get("/api/admin/analytics/users"),
  /** GET /api/admin/analytics/workouts -> AdminAnalyticsWorkoutsDto */
  getWorkouts: () => apiClient.get("/api/admin/analytics/workouts"),
  /** GET /api/admin/analytics/nutrition -> AdminAnalyticsNutritionDto */
  getNutrition: () => apiClient.get("/api/admin/analytics/nutrition"),
  /** GET /api/admin/analytics/subscriptions -> AdminAnalyticsSubscriptionsDto */
  getSubscriptions: () => apiClient.get("/api/admin/analytics/subscriptions"),
  /** GET /api/admin/analytics/revenue -> AdminAnalyticsRevenueDto */
  getRevenue: () => apiClient.get("/api/admin/analytics/revenue"),
  /** GET /api/admin/analytics/retention -> AdminAnalyticsRetentionDto */
  getRetention: () => apiClient.get("/api/admin/analytics/retention"),
  /** GET /api/admin/analytics/engagement -> AdminAnalyticsEngagementDto */
  getEngagement: () => apiClient.get("/api/admin/analytics/engagement"),
};
