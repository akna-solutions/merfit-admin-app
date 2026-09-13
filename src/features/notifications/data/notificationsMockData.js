// Mock data shaped to match MBFitApi's real DTOs (see MBFitApi repo:
// MBFitApi.Business/Dtos/Notifications/AdminNotificationDtos.cs). Each row
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
  "Antrenman zamanı!", "Hedefine çok yaklaştın", "Serini bozma",
  "Haftalık ilerlemen hazır", "Yeni liderlik tablosu sıralaması", "Başarı kazanıldı!",
  "Yeni ödül mevcut", "Aboneliğin yakında yenileniyor", "Uygulama güncellemesi mevcut",
  "Kaçırma — Plus'ta %20 indirim",
];
const BODIES = [
  "Son seansından bu yana biraz zaman geçti. Harekete geçmeye hazır mısın?",
  "Aylık hedefine ulaşmana sadece birkaç antrenman kaldı.",
  "Serini bozma — bugün bir antrenman kaydet.",
  "Bu hafta nasıl gittiğine ve sıradakine göz at.",
  "Bu haftanın en iyi performans gösterenlerine göz at.",
  "Tebrikler, yeni bir başarı kazandın!",
  "Uygulamada seni bekleyen yeni bir ödül var.",
  "MB Fit Plus aboneliğin 3 gün içinde yenileniyor.",
  "Hata düzeltmeleri ve iyileştirmelerle birlikte MB Fit'in yeni bir sürümü mevcut.",
  "MB Fit Plus'a yükselt ve bu hafta sadece %20 tasarruf et.",
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
