// Mock implementation of AdminAnalyticsController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminAnalyticsController.cs). Fully
// read-only — seven snapshot endpoints, no query parameters at all.
import {
  usersAnalyticsMock,
  workoutsAnalyticsMock,
  nutritionAnalyticsMock,
  subscriptionsAnalyticsMock,
  revenueAnalyticsMock,
  retentionAnalyticsMock,
  engagementAnalyticsMock,
} from "../data/analyticsMockData";
import { simulateLatency, apiSuccess } from "../../../utils/queryMockData";

export const analyticsService = {
  /** GET /api/admin/analytics/users */
  getUsers: () => simulateLatency(apiSuccess(usersAnalyticsMock), 300),
  /** GET /api/admin/analytics/workouts */
  getWorkouts: () => simulateLatency(apiSuccess(workoutsAnalyticsMock), 300),
  /** GET /api/admin/analytics/nutrition */
  getNutrition: () => simulateLatency(apiSuccess(nutritionAnalyticsMock), 300),
  /** GET /api/admin/analytics/subscriptions */
  getSubscriptions: () => simulateLatency(apiSuccess(subscriptionsAnalyticsMock), 300),
  /** GET /api/admin/analytics/revenue */
  getRevenue: () => simulateLatency(apiSuccess(revenueAnalyticsMock), 300),
  /** GET /api/admin/analytics/retention */
  getRetention: () => simulateLatency(apiSuccess(retentionAnalyticsMock), 300),
  /** GET /api/admin/analytics/engagement */
  getEngagement: () => simulateLatency(apiSuccess(engagementAnalyticsMock), 300),
};
