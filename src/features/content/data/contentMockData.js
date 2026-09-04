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
  { key: "summer-sale-2026", type: "Campaign", title: "Yaz İndirimi", description: "Bu yaz Merfit Plus'ta %20 indirim.", startAt: daysAgo(5), endAt: daysFromNow(10), isActive: true },
  { key: "new-ai-workouts", type: "Announcement", title: "Yapay Zekâ Antrenmanları Yayında", description: "Yeni yapay zekâ destekli antrenman planlarını deneyin.", startAt: daysAgo(10), endAt: null, isActive: true },
  { key: "home-banner-main", type: "Banner", title: "Hedeflerinize Daha Hızlı Ulaşın", description: "Kişiselleştirilmiş planlar için Plus'a yükseltin.", startAt: null, endAt: null, isActive: true },
  { key: "referral-campaign", type: "Campaign", title: "Bir Arkadaşını Davet Et", description: "Bir ay ver, bir ay kazan.", startAt: daysAgo(30), endAt: daysAgo(2), isActive: false },
  { key: "leaderboard-feature", type: "FeatureCard", title: "Lider Tablosunda Yarış", description: "Diğer kullanıcılara göre sıralamanızı görün.", startAt: null, endAt: null, isActive: true },
  { key: "black-friday-2025", type: "Promotional", title: "Black Friday Fırsatı", description: "Yıllık planlarda %50 indirim.", startAt: daysAgo(120), endAt: daysAgo(100), isActive: false },
  { key: "app-update-v2", type: "Announcement", title: "Sürüm 2.4 Yayınlandı", description: "Hata düzeltmeleri ve performans iyileştirmeleri.", startAt: daysAgo(3), endAt: daysFromNow(20), isActive: true },
  { key: "nutrition-tracking-promo", type: "FeatureCard", title: "Beslenmenizi Takip Edin", description: "Öğünlerinizi kaydedin ve makro hedeflerinize ulaşın.", startAt: null, endAt: null, isActive: true },
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
