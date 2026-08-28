// Typed-shape mock data for the Merfit dashboard.
// Kept isolated from components per spec §18 — components consume this
// only through the dashboardService / useDashboardData hook, never
// directly, so swapping in a real API later is a one-file change.

/** @typedef {{ id: string, title: string, value: string, trend: number, trendLabel: string, icon: string }} KpiMetric */
export const kpiMetrics = [
  {
    id: "total-users",
    title: "Total Users",
    value: "12,482",
    trend: 8.2,
    trendLabel: "vs last month",
    icon: "users",
  },
  {
    id: "active-users",
    title: "Active Users",
    value: "8,014",
    trend: 4.6,
    trendLabel: "vs last month",
    icon: "active",
  },
  {
    id: "plus-subscribers",
    title: "Plus Subscribers",
    value: "3,120",
    trend: 5.1,
    trendLabel: "vs last month",
    icon: "crown",
  },
  {
    id: "monthly-revenue",
    title: "Monthly Revenue",
    value: "₺185,420",
    trend: 6.8,
    trendLabel: "vs last month",
    icon: "revenue",
  },
  {
    id: "workouts-completed",
    title: "Workouts Completed",
    value: "24,905",
    trend: 12.4,
    trendLabel: "vs last month",
    icon: "workout",
  },
  {
    id: "new-users",
    title: "New Users",
    value: "1,342",
    trend: -2.3,
    trendLabel: "vs last month",
    icon: "new",
  },
];

/** @typedef {{ month: string, users: number }} UserGrowthPoint */
export const userGrowthSeries = [
  { month: "Jan", users: 4200 },
  { month: "Feb", users: 4850 },
  { month: "Mar", users: 5400 },
  { month: "Apr", users: 5980 },
  { month: "May", users: 6720 },
  { month: "Jun", users: 7510 },
  { month: "Jul", users: 8330 },
  { month: "Aug", users: 9260 },
  { month: "Sep", users: 10150 },
  { month: "Oct", users: 11020 },
  { month: "Nov", users: 11890 },
  { month: "Dec", users: 12482 },
];

/** @typedef {{ month: string, revenue: number }} RevenuePoint */
export const revenueSeries = [
  { month: "Jan", revenue: 92000 },
  { month: "Feb", revenue: 98500 },
  { month: "Mar", revenue: 104200 },
  { month: "Apr", revenue: 111800 },
  { month: "May", revenue: 121300 },
  { month: "Jun", revenue: 129700 },
  { month: "Jul", revenue: 138900 },
  { month: "Aug", revenue: 148200 },
  { month: "Sep", revenue: 159600 },
  { month: "Oct", revenue: 168300 },
  { month: "Nov", revenue: 176900 },
  { month: "Dec", revenue: 185420 },
];

/** @typedef {{ name: string, value: number }} SubscriptionSlice */
export const subscriptionDistribution = [
  { name: "Plus", value: 3120 },
  { name: "Free", value: 8014 },
  { name: "Trial", value: 1348 },
];

/** @typedef {{ day: string, workouts: number }} WorkoutActivityPoint */
export const workoutActivitySeries = [
  { day: "Mon", workouts: 1420 },
  { day: "Tue", workouts: 1610 },
  { day: "Wed", workouts: 1550 },
  { day: "Thu", workouts: 1730 },
  { day: "Fri", workouts: 1890 },
  { day: "Sat", workouts: 2240 },
  { day: "Sun", workouts: 2010 },
];

/** @typedef {{ id: string, user: string, activity: string, date: string, status: 'Completed' | 'Active' | 'Cancelled' }} RecentActivityRow */
export const recentActivity = [
  {
    id: "1",
    user: "Mert Yılmaz",
    activity: "Completed workout",
    date: "28 Aug 2026",
    status: "Completed",
  },
  {
    id: "2",
    user: "Ahmet Kaya",
    activity: "Started Plus subscription",
    date: "28 Aug 2026",
    status: "Active",
  },
  {
    id: "3",
    user: "Ayşe Demir",
    activity: "Completed workout",
    date: "27 Aug 2026",
    status: "Completed",
  },
  {
    id: "4",
    user: "Elif Şahin",
    activity: "Cancelled subscription",
    date: "27 Aug 2026",
    status: "Cancelled",
  },
  {
    id: "5",
    user: "Can Öztürk",
    activity: "Completed workout",
    date: "26 Aug 2026",
    status: "Completed",
  },
];

/** @typedef {{ id: string, label: string, value: string, progress?: number }} QuickStat */
export const quickStats = [
  { id: "active-subs", label: "Active Subscriptions", value: "1,204" },
  {
    id: "workout-completion",
    label: "Workout Completion",
    value: "87.4%",
    progress: 87.4,
  },
  { id: "retention", label: "7 Day Retention", value: "72%", progress: 72 },
  { id: "avg-duration", label: "Average Workout Duration", value: "46 min" },
];
