import {
  kpiMetrics,
  userGrowthSeries,
  revenueSeries,
  subscriptionDistribution,
  workoutActivitySeries,
  recentActivity,
  quickStats,
} from "../data/dashboardMockData";

// Simulates network latency so loading/skeleton states behave the same
// way they will once these are replaced by real HTTP calls.
const simulateLatency = (data, ms = 350) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// Mock implementation of the dashboard service (spec §19).
// Each method mirrors the shape a real endpoint would return, keyed by
// `dateRange` so callers can already pass `{ from, to }` today.
export const dashboardService = {
  /** @param {{ from?: string, to?: string }} [dateRange] */
  getSummary(dateRange) {
    return simulateLatency({ kpiMetrics, dateRange: dateRange ?? null });
  },
  getUserGrowth(dateRange) {
    return simulateLatency({
      series: userGrowthSeries,
      dateRange: dateRange ?? null,
    });
  },
  getRevenue(dateRange) {
    return simulateLatency({
      series: revenueSeries,
      dateRange: dateRange ?? null,
    });
  },
  getSubscriptions(dateRange) {
    return simulateLatency({
      series: subscriptionDistribution,
      dateRange: dateRange ?? null,
    });
  },
  getWorkoutActivity(dateRange) {
    return simulateLatency({
      series: workoutActivitySeries,
      dateRange: dateRange ?? null,
    });
  },
  getRecentActivity(dateRange) {
    return simulateLatency({
      rows: recentActivity,
      dateRange: dateRange ?? null,
    });
  },
  getQuickStats(dateRange) {
    return simulateLatency({ stats: quickStats, dateRange: dateRange ?? null });
  },
};
