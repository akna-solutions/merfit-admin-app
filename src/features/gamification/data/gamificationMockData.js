// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Scores, .../Achievements, .../Leaderboards,
// .../Rewards, and the matching Admin*Controller.cs files).

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const USER_EMAILS = [
  "emreyilmaz001@example.com", "aysekaya002@example.com", "mehmetdemir003@example.com",
  "zeynepcelik004@example.com", "canahin005@example.com", "elifaydin006@example.com",
  "burakarslan007@example.com", "selindogan008@example.com",
];

// AdminScoreListItemDto[]
export const scoresMockData = USER_EMAILS.map((email, i) => {
  const seed = i + 1;
  return {
    userId: seed,
    userEmail: email,
    score: Math.round(40 + seeded(seed) * 58),
    period: "current", // display translation handled in ScoreTab.jsx
    calculatedAt: daysAgo(seed % 5),
  };
});

// AdminAchievementDto[]
export const achievementsMockData = [
  { id: 1, code: "FIRST_WORKOUT", title: "İlk Antrenman", description: "İlk antrenmanını tamamla.", icon: "🏁", points: 10, conditionType: "workout_count", conditionValue: "1", isActive: true },
  { id: 2, code: "STREAK_7", title: "7 Günlük Seri", description: "7 gün üst üste antrenman yap.", icon: "🔥", points: 25, conditionType: "streak_days", conditionValue: "7", isActive: true },
  { id: 3, code: "WORKOUTS_50", title: "50 Antrenman", description: "50 antrenman tamamla.", icon: "💪", points: 50, conditionType: "workout_count", conditionValue: "50", isActive: true },
  { id: 4, code: "NUTRITION_PRO", title: "Beslenme Uzmanı", description: "30 gün boyunca öğün kaydet.", icon: "🥗", points: 30, conditionType: "meal_log_days", conditionValue: "30", isActive: true },
  { id: 5, code: "EARLY_BIRD", title: "Erken Kalkan", description: "Saat 08:00'den önce 10 antrenman tamamla.", icon: "🌅", points: 15, conditionType: "early_workout_count", conditionValue: "10", isActive: false },
  { id: 6, code: "SCORE_90", title: "90+ Skor", description: "Merfit Skorunu 90'a ulaştır.", icon: "🏆", points: 40, conditionType: "score_threshold", conditionValue: "90", isActive: true },
].map((a, i) => ({
  ...a,
  createdAt: daysAgo(200 - i * 10),
  updatedAt: daysAgo(10 + i),
}));

// AdminAchievementUserListItemDto[] keyed by achievementId
export const achievementEarnersMockData = {
  1: USER_EMAILS.slice(0, 6).map((email, i) => ({ userId: i + 1, userEmail: email, earnedAt: daysAgo(100 - i * 5) })),
  2: USER_EMAILS.slice(0, 4).map((email, i) => ({ userId: i + 1, userEmail: email, earnedAt: daysAgo(80 - i * 5) })),
  3: USER_EMAILS.slice(0, 2).map((email, i) => ({ userId: i + 1, userEmail: email, earnedAt: daysAgo(30 - i * 5) })),
  4: USER_EMAILS.slice(0, 3).map((email, i) => ({ userId: i + 1, userEmail: email, earnedAt: daysAgo(40 - i * 5) })),
  5: [],
  6: USER_EMAILS.slice(0, 1).map((email, i) => ({ userId: i + 1, userEmail: email, earnedAt: daysAgo(5) })),
};

// AdminLeaderboardPeriodDto[]
export const leaderboardPeriodsMockData = [
  { id: 1, type: "Weekly", startDate: daysAgo(7), endDate: daysFromNow(0), isActive: true, createdAt: daysAgo(7) },
  { id: 2, type: "Monthly", startDate: daysAgo(30), endDate: daysFromNow(0), isActive: true, createdAt: daysAgo(30) },
  { id: 3, type: "AllTime", startDate: daysAgo(400), endDate: daysFromNow(3650), isActive: true, createdAt: daysAgo(400) },
  { id: 4, type: "Weekly", startDate: daysAgo(14), endDate: daysAgo(7), isActive: false, createdAt: daysAgo(14) },
];

// AdminLeaderboardEntryDto[] keyed by periodId
function buildEntries(periodId) {
  return USER_EMAILS.map((email, i) => {
    const seed = periodId * 10 + i;
    return {
      userId: i + 1,
      userEmail: email,
      points: Math.round(200 + seeded(seed) * 800),
      workoutCount: Math.round(5 + seeded(seed * 2) * 25),
    };
  })
    .sort((a, b) => b.points - a.points)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}
export const leaderboardEntriesMockData = {
  1: buildEntries(1),
  2: buildEntries(2),
  3: buildEntries(3),
  4: buildEntries(4),
};

// AdminRewardDto[]
export const rewardsMockData = [
  { id: 1, title: "1 Ay Ücretsiz Plus", description: "Bir ay ücretsiz Merfit Plus.", imageUrl: null, rewardType: "subscription", value: "plus_monthly:1", isActive: true },
  { id: 2, title: "Merfit Tişört", description: "Resmi Merfit marka tişört.", imageUrl: null, rewardType: "physical", value: null, isActive: true },
  { id: 3, title: "500 Bonus Puan", description: "Skoruna eklenen bonus puanlar.", imageUrl: null, rewardType: "points", value: "500", isActive: true },
  { id: 4, title: "Kişisel Koçluk Seansı", description: "Bir Merfit koçuyla 30 dakikalık seans.", imageUrl: null, rewardType: "service", value: null, isActive: false },
].map((r, i) => ({ ...r, createdAt: daysAgo(150 - i * 10), updatedAt: daysAgo(20 + i) }));
