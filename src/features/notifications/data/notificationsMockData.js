// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Notifications/AdminNotificationDtos.cs). Each row
// here is one *recipient's* notification record — the API has no concept of
// a "campaign" row with a recipient count; broadcast/segment sends just
// fan out into many individual AdminNotificationListItemDto rows.

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function hoursAgo(n) {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}
function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const USER_EMAILS = [
  "emreyilmaz001@example.com", "aysekaya002@example.com", "mehmetdemir003@example.com",
  "zeynepcelik004@example.com", "canahin005@example.com", "elifaydin006@example.com",
];

const TITLES = [
  "Time for your workout!", "You're close to your goal", "Keep your streak alive",
  "Your weekly progress is in", "New leaderboard rankings", "Achievement unlocked!",
  "New reward available", "Your subscription renews soon", "App update available",
  "Don't miss out — Plus is 20% off",
];
const BODIES = [
  "It's been a while since your last session. Ready to get moving?",
  "You're just a few workouts away from hitting your monthly goal.",
  "Don't break your streak — log a workout today.",
  "See how you did this week and what's next.",
  "Check out this week's top performers.",
  "Congratulations, you just earned a new achievement!",
  "A new reward is waiting for you in the app.",
  "Your Merfit Plus subscription renews in 3 days.",
  "A new version of Merfit is available with bug fixes and improvements.",
  "Upgrade to Merfit Plus and save 20% this week only.",
];

// AdminNotificationListItemDto[] (+ AdminNotificationDetailDto.dataJson)
export const notificationsMockData = Array.from({ length: 40 }, (_, i) => {
  const seed = i + 1;
  const isRead = seeded(seed) > 0.4;
  return {
    id: seed,
    userId: 1 + (seed % 6),
    userEmail: USER_EMAILS[seed % USER_EMAILS.length],
    title: TITLES[seed % TITLES.length],
    body: BODIES[seed % BODIES.length],
    imageUrl: null,
    isRead,
    readAt: isRead ? hoursAgo(seed % 48) : null,
    expiresAt: seed % 4 === 0 ? daysAgo(-7) : null,
    createdAt: seed <= 6 ? hoursAgo(seed * 3) : daysAgo(seed % 20),
    dataJson: null,
  };
});
