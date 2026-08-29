// Mock data shaped to match MerfitApi's real DTO (see MerfitApi repo:
// MerfitApi.Business/Dtos/Content/AdminContentDtos.cs). Type is a free-text
// string server-side; these are the API doc's recommended values.

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

export const CONTENT_TYPES = ["Banner", "Announcement", "Campaign", "FeatureCard", "Promotional"];

function isCurrentlyLive(isActive, startAt, endAt) {
  if (!isActive) return false;
  const now = Date.now();
  if (startAt && new Date(startAt).getTime() > now) return false;
  if (endAt && new Date(endAt).getTime() < now) return false;
  return true;
}

const RAW = [
  { key: "summer-sale-2026", type: "Campaign", title: "Summer Sale", description: "20% off Merfit Plus this summer.", startAt: daysAgo(5), endAt: daysFromNow(10), isActive: true },
  { key: "new-ai-workouts", type: "Announcement", title: "AI Workouts Are Here", description: "Try the new AI-generated workout plans.", startAt: daysAgo(10), endAt: null, isActive: true },
  { key: "home-banner-main", type: "Banner", title: "Reach Your Goals Faster", description: "Upgrade to Plus for personalized plans.", startAt: null, endAt: null, isActive: true },
  { key: "referral-campaign", type: "Campaign", title: "Refer a Friend", description: "Give a month, get a month.", startAt: daysAgo(30), endAt: daysAgo(2), isActive: false },
  { key: "leaderboard-feature", type: "FeatureCard", title: "Compete on the Leaderboard", description: "See how you rank against other users.", startAt: null, endAt: null, isActive: true },
  { key: "black-friday-2025", type: "Promotional", title: "Black Friday Deal", description: "50% off yearly plans.", startAt: daysAgo(120), endAt: daysAgo(100), isActive: false },
  { key: "app-update-v2", type: "Announcement", title: "Version 2.4 Released", description: "Bug fixes and performance improvements.", startAt: daysAgo(3), endAt: daysFromNow(20), isActive: true },
  { key: "nutrition-tracking-promo", type: "FeatureCard", title: "Track Your Nutrition", description: "Log meals and hit your macros.", startAt: null, endAt: null, isActive: true },
];

// AdminContentDto[]
export const contentMockData = RAW.map((item, i) => ({
  id: i + 1,
  ...item,
  imageUrl: null,
  linkUrl: null,
  isCurrentlyLive: isCurrentlyLive(item.isActive, item.startAt, item.endAt),
  createdAt: daysAgo(150 - i * 10),
  updatedAt: daysAgo(5 + i),
}));
