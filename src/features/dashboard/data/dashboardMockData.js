// Typed-shape mock data for the MB Fit dashboard.
// Kept isolated from components per spec §18 — components consume this
// only through the dashboardService / useDashboardData hook, never
// directly, so swapping in a real API later is a one-file change.

/** @typedef {{ id: string, title: string, value: string, trend: number, trendLabel: string, icon: string }} KpiMetric */
export const kpiMetrics = [
  {
    id: "total-users",
    title: "Toplam Kullanıcı",
    value: "12,482",
    trend: 8.2,
    trendLabel: "geçen aya göre",
    icon: "users",
  },
  {
    id: "active-users",
    title: "Aktif Kullanıcı",
    value: "8,014",
    trend: 4.6,
    trendLabel: "geçen aya göre",
    icon: "active",
  },
  {
    id: "plus-subscribers",
    title: "Plus Abonesi",
    value: "3,120",
    trend: 5.1,
    trendLabel: "geçen aya göre",
    icon: "crown",
  },
  {
    id: "monthly-revenue",
    title: "Aylık Gelir",
    value: "₺185,420",
    trend: 6.8,
    trendLabel: "geçen aya göre",
    icon: "revenue",
  },
  {
    id: "workouts-completed",
    title: "Tamamlanan Antrenman",
    value: "24,905",
    trend: 12.4,
    trendLabel: "geçen aya göre",
    icon: "workout",
  },
  {
    id: "new-users",
    title: "Yeni Kullanıcı",
    value: "1,342",
    trend: -2.3,
    trendLabel: "geçen aya göre",
    icon: "new",
  },
];

/** @typedef {{ month: string, users: number }} UserGrowthPoint */
export const userGrowthSeries = [
  { month: "Oca", users: 4200 },
  { month: "Şub", users: 4850 },
  { month: "Mar", users: 5400 },
  { month: "Nis", users: 5980 },
  { month: "May", users: 6720 },
  { month: "Haz", users: 7510 },
  { month: "Tem", users: 8330 },
  { month: "Ağu", users: 9260 },
  { month: "Eyl", users: 10150 },
  { month: "Eki", users: 11020 },
  { month: "Kas", users: 11890 },
  { month: "Ara", users: 12482 },
];

/** @typedef {{ month: string, revenue: number }} RevenuePoint */
export const revenueSeries = [
  { month: "Oca", revenue: 92000 },
  { month: "Şub", revenue: 98500 },
  { month: "Mar", revenue: 104200 },
  { month: "Nis", revenue: 111800 },
  { month: "May", revenue: 121300 },
  { month: "Haz", revenue: 129700 },
  { month: "Tem", revenue: 138900 },
  { month: "Ağu", revenue: 148200 },
  { month: "Eyl", revenue: 159600 },
  { month: "Eki", revenue: 168300 },
  { month: "Kas", revenue: 176900 },
  { month: "Ara", revenue: 185420 },
];

/** @typedef {{ name: string, value: number }} SubscriptionSlice */
export const subscriptionDistribution = [
  { name: "Plus", value: 3120 },
  { name: "Ücretsiz", value: 8014 },
  { name: "Deneme", value: 1348 },
];

/** @typedef {{ day: string, workouts: number }} WorkoutActivityPoint */
export const workoutActivitySeries = [
  { day: "Pzt", workouts: 1420 },
  { day: "Sal", workouts: 1610 },
  { day: "Çar", workouts: 1550 },
  { day: "Per", workouts: 1730 },
  { day: "Cum", workouts: 1890 },
  { day: "Cmt", workouts: 2240 },
  { day: "Paz", workouts: 2010 },
];

/** @typedef {{ id: string, user: string, activity: string, date: string, status: 'Tamamlandı' | 'Aktif' | 'İptal Edildi' }} RecentActivityRow */
export const recentActivity = [
  {
    id: "1",
    user: "Mert Yılmaz",
    activity: "Antrenmanı tamamladı",
    date: "28 Ağu 2026",
    status: "Tamamlandı",
  },
  {
    id: "2",
    user: "Ahmet Kaya",
    activity: "Plus aboneliği başlattı",
    date: "28 Ağu 2026",
    status: "Aktif",
  },
  {
    id: "3",
    user: "Ayşe Demir",
    activity: "Antrenmanı tamamladı",
    date: "27 Ağu 2026",
    status: "Tamamlandı",
  },
  {
    id: "4",
    user: "Elif Şahin",
    activity: "Aboneliği iptal etti",
    date: "27 Ağu 2026",
    status: "İptal Edildi",
  },
  {
    id: "5",
    user: "Can Öztürk",
    activity: "Antrenmanı tamamladı",
    date: "26 Ağu 2026",
    status: "Tamamlandı",
  },
];

/** @typedef {{ id: string, label: string, value: string, progress?: number }} QuickStat */
export const quickStats = [
  { id: "active-subs", label: "Aktif Abonelikler", value: "1,204" },
  {
    id: "workout-completion",
    label: "Antrenman Tamamlama Oranı",
    value: "87.4%",
    progress: 87.4,
  },
  { id: "retention", label: "7 Günlük Elde Tutma", value: "72%", progress: 72 },
  { id: "avg-duration", label: "Ortalama Antrenman Süresi", value: "46 dk" },
];
