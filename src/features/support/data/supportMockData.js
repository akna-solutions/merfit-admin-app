// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Support/AdminSupportTicketDtos.cs).

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

const USER_EMAILS = [
  "emreyilmaz001@example.com", "aysekaya002@example.com", "mehmetdemir003@example.com",
  "zeynepcelik004@example.com", "canahin005@example.com", "elifaydin006@example.com",
];
const SUBJECTS = [
  "Ödeme yansımadı", "Uygulama açılışta çöküyor", "Antrenman videosu oynamıyor",
  "Aboneliğimi iptal edemiyorum", "Hesabımı silmek istiyorum", "Bildirimler gelmiyor",
  "Barkod tarama çalışmıyor", "Şifremi sıfırlayamıyorum", "Apple Watch senkronizasyonu",
  "Yanlış kalori hesaplaması",
];
const STATUSES = ["Open", "InProgress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

// AdminSupportTicketListItemDto[] (+ AdminSupportTicketDetailDto.message)
export const ticketsMockData = SUBJECTS.concat(SUBJECTS.slice(0, 8)).map((subject, i) => {
  const seed = i + 1;
  const status = STATUSES[seed % STATUSES.length];
  const messageCount = 1 + (seed % 5);
  return {
    id: seed,
    userId: 1 + (seed % 6),
    userEmail: USER_EMAILS[seed % USER_EMAILS.length],
    subject,
    status,
    priority: PRIORITIES[seed % PRIORITIES.length],
    messageCount,
    createdAt: daysAgo(1 + (seed % 25)),
    closedAt: status === "Closed" ? daysAgo(seed % 5) : null,
    message: "Merhaba, yukarıdaki konuyla ilgili yardım almak istiyorum. Sorun birkaç gündür devam ediyor.",
  };
});

// AdminSupportTicketMessageDto[] keyed by ticketId
export function buildTicketMessages(ticket) {
  const messages = [
    {
      id: ticket.id * 100,
      ticketId: ticket.id,
      senderUserId: ticket.userId,
      senderEmail: ticket.userEmail,
      isFromAdmin: false,
      message: ticket.message,
      createdAt: ticket.createdAt,
    },
  ];
  const extraCount = ticket.messageCount - 1;
  for (let i = 0; i < extraCount; i += 1) {
    const isFromAdmin = i % 2 === 0;
    messages.push({
      id: ticket.id * 100 + i + 1,
      ticketId: ticket.id,
      senderUserId: isFromAdmin ? 0 : ticket.userId,
      senderEmail: isFromAdmin ? "admin@merfit.com" : ticket.userEmail,
      isFromAdmin,
      message: isFromAdmin
        ? "Merhaba, konuyu inceliyoruz, en kısa sürede dönüş yapacağız."
        : "Teşekkürler, cevabınızı bekliyorum.",
      createdAt: hoursAgo((extraCount - i) * 6),
    });
  }
  return messages;
}
