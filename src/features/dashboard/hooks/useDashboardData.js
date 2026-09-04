import { useEffect, useMemo, useState, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";
import { analyticsService } from "../../analytics/services/analyticsService";

const initialState = {
  kpiMetrics: [],
  userGrowth: [],
  revenue: [],
  subscriptions: [],
  workoutActivity: [],
  recentActivity: [],
  quickStats: [],
};

function formatMoney(amount) {
  return `₺${Number(amount ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
}

function formatDay(dateOnly) {
  // AdminDashboardTimeSeriesPointDto.Date is a DateOnly ("YYYY-MM-DD").
  const d = new Date(dateOnly);
  return Number.isNaN(d.getTime()) ? String(dateOnly) : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Single abstraction dashboard components pull data through (spec §18).
// Talks to the real MerfitApi admin endpoints (see dashboardService.js) and
// reshapes their DTOs into the flat { month, users }/{ day, workouts }/etc.
// shapes the existing chart components (UserGrowthChart, RevenueChart, ...)
// already expect, so no chart/component changes are needed.
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
        summaryRes,
        userGrowthRes,
        revenueRes,
        subscriptionsRes,
        activityRes,
        workoutsAnalyticsRes,
        retentionAnalyticsRes,
      ] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getUserGrowth(dateRange),
        dashboardService.getRevenue(dateRange),
        dashboardService.getSubscriptions(),
        dashboardService.getActivity(dateRange),
        // Two "Quick Stats" figures (workout completion rate, 7-day
        // retention) aren't on AdminDashboardController — they live on
        // AdminAnalyticsController, which the Dashboard already borrows from.
        analyticsService.getWorkouts(),
        analyticsService.getRetention(),
      ]);

      const summary = summaryRes.data;
      const subscriptions = subscriptionsRes.data;
      const workoutsAnalytics = workoutsAnalyticsRes.data;
      const retentionAnalytics = retentionAnalyticsRes.data;

      const kpiMetrics = [
        { id: "total-users", title: "Toplam Kullanıcı", value: summary.totalUsers.toLocaleString(), trend: 0, trendLabel: "", icon: "users" },
        { id: "active-users", title: "Aktif Kullanıcı", value: summary.activeUsers.toLocaleString(), trend: 0, trendLabel: "", icon: "active" },
        { id: "plus-subscribers", title: "Plus Abonesi", value: summary.plusSubscribers.toLocaleString(), trend: 0, trendLabel: "", icon: "crown" },
        { id: "monthly-revenue", title: "Aylık Gelir", value: formatMoney(summary.revenueThisMonth), trend: 0, trendLabel: "", icon: "revenue" },
        { id: "workouts-completed", title: "Tamamlanan Antrenman", value: summary.workoutsCompleted.toLocaleString(), trend: 0, trendLabel: "", icon: "workout" },
        { id: "new-users", title: "Yeni Kullanıcı", value: summary.newUsersThisMonth.toLocaleString(), trend: 0, trendLabel: "bu ay", icon: "new" },
      ];

      const userGrowth = (userGrowthRes.data.points ?? []).map((p) => ({
        month: formatDay(p.date),
        users: p.count,
      }));

      const revenue = (revenueRes.data.points ?? []).map((p) => ({
        month: formatDay(p.date),
        revenue: p.amount,
      }));

      const subscriptionDistribution = (subscriptions.byProduct ?? []).map((p) => ({
        name: p.productName,
        value: p.activeCount,
      }));

      const workoutActivity = (activityRes.data.workoutsCompleted ?? []).map((p) => ({
        day: formatDay(p.date),
        workouts: p.count,
      }));

      // No backend endpoint returns a per-user "recent activity" feed
      // (AdminDashboardController only exposes aggregate metrics), so this
      // stays empty rather than showing fabricated rows.
      const recentActivity = [];

      const quickStats = [
        { id: "active-subs", label: "Aktif Abonelikler", value: subscriptions.activeCount?.toLocaleString() ?? "0" },
        {
          id: "workout-completion",
          label: "Antrenman Tamamlama Oranı",
          value: `${workoutsAnalytics.workoutCompletionRatePercent.toFixed(1)}%`,
          progress: workoutsAnalytics.workoutCompletionRatePercent,
        },
        {
          id: "retention",
          label: "7 Günlük Elde Tutma",
          value: `${retentionAnalytics.retention7DayPercent.toFixed(1)}%`,
          progress: retentionAnalytics.retention7DayPercent,
        },
        { id: "open-tickets", label: "Açık Destek Talepleri", value: summary.openSupportTickets?.toLocaleString() ?? "0" },
      ];

      setData({
        kpiMetrics,
        userGrowth,
        revenue,
        subscriptions: subscriptionDistribution,
        workoutActivity,
        recentActivity,
        quickStats,
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
