// Mock data shaped to match MBFitApi's real DTOs (see MBFitApi repo:
// MBFitApi.Business/Dtos/Analytics/AdminAnalyticsDtos.cs). IMPORTANT: every
// AdminAnalyticsController endpoint returns a single current-snapshot object
// with NO date-range or granularity query parameters — there is no
// day/week/month time-series endpoint to draw a trend line from. That's why
// this page is a snapshot KPI dashboard per category rather than the
// line/bar/area charts the original spec sketched; "Top Workouts" is the one
// place real list data exists, so that's the one chart drawn from a real
// array field (AdminAnalyticsWorkoutsDto.TopWorkouts).

export const usersAnalyticsMock = {
  totalUsers: 8420,
  activeUsers: 5310,
  newUsersLast7Days: 214,
  newUsersLast30Days: 890,
  dau: 1620,
  wau: 3980,
  mau: 5310,
};

export const workoutsAnalyticsMock = {
  totalSessionsLast30Days: 41230,
  completedSessionsLast30Days: 34760,
  workoutCompletionRatePercent: 84.3,
  averageWorkoutsPerActiveUser: 9.2,
  topWorkouts: [
    { id: 1, name: "Tüm Vücut Yakımı", count: 3120 },
    { id: 2, name: "HIIT Kardiyo Patlaması", count: 2870 },
    { id: 3, name: "Üst Vücut Gücü", count: 2410 },
    { id: 4, name: "Karın Kırıcı", count: 1980 },
    { id: 5, name: "Yoga Akışı ve Esneklik", count: 1640 },
  ],
};

export const nutritionAnalyticsMock = {
  totalMealsLast30Days: 62800,
  averageMealsPerUserLast30Days: 11.8,
  averageCaloriesPerMeal: 512,
  usersWithNutritionGoal: 3960,
};

export const subscriptionsAnalyticsMock = {
  totalSubscriptions: 2680,
  activeSubscriptions: 2130,
  plusConversionRatePercent: 25.3,
  churnRatePercent: 6.8,
};

export const revenueAnalyticsMock = {
  totalRevenue: 412500.75,
  revenueLast7Days: 8930.5,
  revenueLast30Days: 36870.25,
  averageRevenuePerPayingUser: 193.66,
};

export const retentionAnalyticsMock = {
  retention7DayPercent: 62.4,
  retention30DayPercent: 38.1,
};

export const engagementAnalyticsMock = {
  dau: 1620,
  wau: 3980,
  mau: 5310,
  stickinessPercent: 30.5,
  averageSessionsPerActiveUserLast30Days: 7.8,
};
