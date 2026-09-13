// Mock data shaped to match MBFitApi's real DTOs exactly (see MBFitApi repo:
// MBFitApi.Business/Dtos/Users/AdminUserDtos.cs, MBFitApi.Api/Controllers/Admin/
// AdminUserController.cs). Field names/casing mirror what `GET /api/admin/users`
// and `GET /api/admin/users/{id}` will return once this is wired to the real API
// (System.Text.Json's default camelCase policy). Kept isolated from
// components/services per the feature-folder convention.

import {
  GENDER,
  FITNESS_GOAL,
  EXPERIENCE_LEVEL,
  ACTIVITY_LEVEL,
  TRAINING_LOCATION,
  UNIT_SYSTEM,
  PLATFORM,
} from "../../../constants/apiEnums";

const FIRST_NAMES = [
  "Emre", "Ayşe", "Mehmet", "Zeynep", "Can", "Elif", "Burak", "Selin",
  "Kerem", "Deniz", "Aylin", "Onur", "Ece", "Baran", "Ceren", "Kaan",
  "Melis", "Serkan", "Nihan", "Tolga", "Sara", "Emir", "Yasemin", "Berk",
  "Gizem", "Alper", "Naz", "Cem", "İrem", "Ozan",
];
const LAST_NAMES = [
  "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Aydın", "Arslan", "Doğan",
  "Kılıç", "Aslan", "Çetin", "Yıldız", "Öztürk", "Polat", "Korkmaz", "Koç",
  "Kurt", "Özdemir", "Şen", "Erdoğan",
];
// AdminUserListItemDto.SubscriptionStatus: "active" | "expired" | "cancelled" | null
const SUBSCRIPTION_STATUSES = ["active", "expired", "cancelled", null];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c")
    .replace(/ö/g, "o").replace(/ü/g, "u").replace(/ğ/g, "g")
    .replace(/[^a-z0-9]/g, "");
}
function pad(n) {
  return String(n).padStart(3, "0");
}
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// AdminUserListItemDto[] — exact field set the list endpoint returns.
export const usersMockData = Array.from({ length: 42 }, (_, i) => {
  const seed = i + 1;
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
  const userName = `${slugify(firstName)}${slugify(lastName)}${pad(seed)}`;
  const isDeleted = seed % 15 === 0;
  const isActive = !isDeleted && seededRandom(seed) > 0.15;
  const createdDaysAgo = 30 + Math.floor(seededRandom(seed * 3) * 600);
  const lastLoginDaysAgo = Math.floor(seededRandom(seed * 4) * 30);
  const subscriptionStatus = SUBSCRIPTION_STATUSES[seed % SUBSCRIPTION_STATUSES.length];

  return {
    id: seed,
    email: `${userName}@example.com`,
    userName,
    firstName,
    lastName,
    role: "User",
    isActive,
    emailConfirmed: seededRandom(seed * 6) > 0.1,
    isDeleted,
    subscriptionStatus,
    createdAt: daysAgo(createdDaysAgo),
    lastLoginAt: isActive ? daysAgo(lastLoginDaysAgo) : null,

    // Extra fields not part of the list DTO — kept here so the mock service
    // can assemble AdminUserDetailDto / AdminUserProfileDto without a
    // separate data file per sub-resource.
    avatarColor: ["#2F6FED", "#22C55E", "#F5A623", "#EF4444", "#7C3AED"][seed % 5],
    phoneNumber: `+90 5${30 + (seed % 60)}${pad(seed * 7).padStart(3, "0")}${pad(seed * 11).padStart(4, "0")}`.slice(0, 17),
    heightCm: 155 + Math.floor(seededRandom(seed * 9) * 40),
    weightKg: 55 + Math.floor(seededRandom(seed * 8) * 45),
    targetWeightKg: 55 + Math.floor(seededRandom(seed * 12) * 40),
    gender: GENDER[seed % GENDER.length],
    goal: FITNESS_GOAL[seed % FITNESS_GOAL.length],
    experienceLevel: EXPERIENCE_LEVEL[seed % EXPERIENCE_LEVEL.length],
    activityLevel: ACTIVITY_LEVEL[seed % ACTIVITY_LEVEL.length],
    trainingLocation: TRAINING_LOCATION[seed % TRAINING_LOCATION.length],
    trainingDaysPerWeek: 2 + (seed % 5),
    unitSystem: UNIT_SYSTEM[seed % UNIT_SYSTEM.length],
    currentSubscriptionProductName: subscriptionStatus ? "MB Fit Plus — Aylık" : null,
    currentSubscriptionExpiresAt: subscriptionStatus ? daysAgo(-30 + (seed % 20)) : null,
    latestMBFitScore: 40 + Math.floor(seededRandom(seed * 5) * 60),
    currentStreak: Math.floor(seededRandom(seed * 13) * 30),
    longestStreak: 10 + Math.floor(seededRandom(seed * 14) * 60),
    totalWorkoutSessions: Math.floor(seededRandom(seed * 6) * 220),
    totalAchievements: 2 + (seed % 6),
    devicePlatform: PLATFORM[seed % PLATFORM.length],
  };
});

// AdminUserWorkoutSessionListItemDto[]
export function getUserWorkoutSessions(userId) {
  const seed = Number(userId) || 1;
  const titles = ["Tüm Vücut Yakımı", "Üst Vücut Güçlendirme", "HIIT Kardiyo", "Karın Bölgesi Antrenmanı", "Bacak Günü", "Yoga Akışı"];
  return Array.from({ length: 6 }, (_, i) => ({
    id: seed * 100 + i,
    workoutId: 100 + ((seed + i) % 20),
    workoutTitle: titles[(seed + i) % titles.length],
    startedAt: daysAgo(i * 4 + 1),
    completedAt: i === 5 ? null : daysAgo(i * 4 + 1),
    durationSeconds: (20 + ((seed + i * 5) % 40)) * 60,
    caloriesBurned: 150 + ((seed + i * 37) % 350),
  }));
}

// AdminUserMealListItemDto[]
export function getUserMeals(userId) {
  const seed = Number(userId) || 1;
  return Array.from({ length: 5 }, (_, i) => ({
    id: seed * 100 + i,
    date: daysAgo(i),
    notes: null,
    itemCount: 2 + ((seed + i) % 3),
    totalCalories: 1600 + ((seed + i * 53) % 900),
  }));
}

// AdminUserNutritionGoalDto | null
export function getUserNutritionGoal(userId) {
  const seed = Number(userId) || 1;
  if (seed % 8 === 0) return null;
  return {
    dailyCalories: 1800 + (seed % 6) * 100,
    proteinTarget: 120 + (seed % 4) * 10,
    carbsTarget: 200 + (seed % 4) * 15,
    fatTarget: 60 + (seed % 4) * 5,
    waterTargetMl: 2500,
  };
}

// AdminUserMeasurementListItemDto[]
export function getUserMeasurements(userId) {
  const seed = Number(userId) || 1;
  return Array.from({ length: 4 }, (_, i) => ({
    id: seed * 10 + i,
    recordedAt: daysAgo(i * 14),
    weightKg: 70 + ((seed + i) % 20),
    bodyFatPercentage: 15 + ((seed + i) % 10),
    bmi: 22 + ((seed + i) % 5),
    chestCm: 95 + (seed % 10),
    waistCm: 80 + (seed % 10),
    hipCm: 95 + (seed % 8),
    armCm: 32 + (seed % 5),
    thighCm: 55 + (seed % 6),
  }));
}

// AdminUserScoreBreakdownItemDto[]
export function getUserScoreBreakdown(user) {
  const score = user.latestMBFitScore ?? 0;
  return [
    { category: "Antrenman", points: Math.round(score * 0.4) },
    { category: "Beslenme", points: Math.round(score * 0.35) },
    { category: "Süreklilik", points: Math.round(score * 0.25) },
  ];
}

// AdminUserScoreHistoryListItemDto[]
export function getUserScoreHistory(userId) {
  const seed = Number(userId) || 1;
  return Array.from({ length: 6 }, (_, i) => ({
    id: seed * 10 + i,
    score: 40 + ((seed + i * 9) % 55),
    recordedAt: daysAgo((5 - i) * 14),
  }));
}

// AdminUserAchievementListItemDto[]
export function getUserAchievementsList(userId) {
  const seed = Number(userId) || 1;
  const pool = [
    { achievementId: 1, code: "FIRST_WORKOUT", title: "İlk Antrenman", points: 10, icon: "🏁" },
    { achievementId: 2, code: "STREAK_7", title: "7 Günlük Seri", points: 25, icon: "🔥" },
    { achievementId: 3, code: "WORKOUTS_50", title: "50 Antrenman", points: 50, icon: "💪" },
    { achievementId: 4, code: "NUTRITION_PRO", title: "Beslenme Uzmanı", points: 30, icon: "🥗" },
    { achievementId: 5, code: "EARLY_BIRD", title: "Erkenci Kuş", points: 15, icon: "🌅" },
    { achievementId: 6, code: "SCORE_90", title: "90+ Skor", points: 40, icon: "🏆" },
  ];
  return pool.slice(0, 2 + (seed % 4)).map((a, i) => ({
    ...a,
    earnedAt: daysAgo(120 - i * 20),
  }));
}

// AdminUserDeviceListItemDto[]
export function getUserDevices(userId, platformLabel) {
  const seed = Number(userId) || 1;
  const names =
    platformLabel === "IOS"
      ? ["iPhone 15 Pro", "Apple Watch S9"]
      : platformLabel === "Android"
        ? ["Samsung Galaxy S24"]
        : ["Chrome on macOS"];
  return names.map((name, i) => ({
    id: seed * 10 + i,
    deviceToken: `tok_${seed}_${i}_${Math.random().toString(36).slice(2, 10)}`,
    platform: platformLabel,
    deviceName: name,
    appVersion: "2.4.1",
    osVersion: platformLabel === "IOS" ? "iOS 18.1" : platformLabel === "Android" ? "Android 15" : "—",
    isActive: true,
    lastSeenAt: daysAgo(i),
  }));
}

// AdminUserSubscriptionListItemDto[]
export function getUserSubscriptions(userId) {
  const seed = Number(userId) || 1;
  if (seed % 6 === 0) return [];
  return [
    {
      id: seed * 10,
      subscriptionProductId: 1,
      productName: "MB Fit Plus — Aylık",
      provider: seed % 2 === 0 ? "AppStore" : "GooglePlay",
      status: seed % 4 === 0 ? "cancelled" : seed % 3 === 0 ? "expired" : "active",
      startedAt: daysAgo(60),
      expiresAt: daysAgo(-30),
      autoRenew: seed % 4 !== 0,
      cancelledAt: seed % 4 === 0 ? daysAgo(5) : null,
    },
  ];
}

// Support tickets aren't a per-user sub-resource on AdminUserController in the
// API; AdminSupportTicketController is expected to support a userId filter
// instead. Modeled the same way here so the User Detail tab can later call
// ticketService.getTickets({ userId }).
export function getUserSupportTickets(userId) {
  const seed = Number(userId) || 1;
  if (seed % 3 === 0) return [];
  return [
    {
      id: 1000 + seed,
      subject: "Ödeme yansımadı",
      status: seed % 2 === 0 ? "Resolved" : "Open",
      createdAt: daysAgo(15),
    },
  ];
}
