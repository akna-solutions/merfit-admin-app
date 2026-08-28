import { useEffect, useMemo, useState, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";

const initialState = {
  kpiMetrics: [],
  userGrowth: [],
  revenue: [],
  subscriptions: [],
  workoutActivity: [],
  recentActivity: [],
  quickStats: [],
};

// Single abstraction dashboard components pull data through (spec §18).
// Swapping dashboardService's mock implementation for real API calls
// later requires no changes here or in any component using this hook.
export function useDashboardData(dateRange) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rangeKey = useMemo(
    () =>
      dateRange ? `${dateRange.from ?? ""}-${dateRange.to ?? ""}` : "default",
    [dateRange],
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        summary,
        userGrowth,
        revenue,
        subscriptions,
        workoutActivity,
        recent,
        stats,
      ] = await Promise.all([
        dashboardService.getSummary(dateRange),
        dashboardService.getUserGrowth(dateRange),
        dashboardService.getRevenue(dateRange),
        dashboardService.getSubscriptions(dateRange),
        dashboardService.getWorkoutActivity(dateRange),
        dashboardService.getRecentActivity(dateRange),
        dashboardService.getQuickStats(dateRange),
      ]);

      setData({
        kpiMetrics: summary.kpiMetrics,
        userGrowth: userGrowth.series,
        revenue: revenue.series,
        subscriptions: subscriptions.series,
        workoutActivity: workoutActivity.series,
        recentActivity: recent.rows,
        quickStats: stats.stats,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { ...data, loading, error, refetch: fetchAll };
}
