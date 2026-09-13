// Mock data shaped to match MBFitApi's real DTOs (see MBFitApi repo:
// MBFitApi.Business/Dtos/Ai/AdminAiDtos.cs).

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function minutesAgo(n) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
}

const USER_EMAILS = [
  "emreyilmaz001@example.com", "aysekaya002@example.com", "mehmetdemir003@example.com",
  "zeynepcelik004@example.com", "canahin005@example.com", "elifaydin006@example.com",
];
const TYPES = ["Workout", "Nutrition", "Insight"];
const STATUSES = ["Pending", "Processing", "Completed", "Failed"];
const MODELS = ["gpt-4o-mini", "gpt-4o", "claude-sonnet-4-6"];

// AdminAiRequestListItemDto[] (+ AdminAiRequestDetailDto extras)
export const aiRequestsMockData = Array.from({ length: 40 }, (_, i) => {
  const seed = i + 1;
  const status = STATUSES[seed % STATUSES.length];
  const createdAt = seed <= 6 ? minutesAgo(seed * 20) : daysAgo(seed % 20);
  const startedAt = status === "Pending" ? null : createdAt;
  const durationMinutes = 1 + (seed % 4);
  const completedAt =
    status === "Completed" || status === "Failed"
      ? new Date(new Date(startedAt).getTime() + durationMinutes * 60000).toISOString()
      : null;

  return {
    id: seed,
    userId: 1 + (seed % 6),
    userEmail: USER_EMAILS[seed % USER_EMAILS.length],
    type: TYPES[seed % TYPES.length],
    status,
    model: MODELS[seed % MODELS.length],
    startedAt,
    completedAt,
    createdAt,

    // AdminAiRequestDetailDto extras
    prompt: "Orta seviyeli bir kullanıcı için güce odaklanan, 4 haftalık aşamalı bir antrenman planı oluştur.",
    hasResult: status === "Completed",
  };
});

// Display-only wording for the summary sentence embedded in resultJson below
// (the sibling "type" field keeps the real English DTO value untouched).
const TYPE_LABELS_TR = { Workout: "antrenman", Nutrition: "beslenme", Insight: "içgörü" };

// AdminAiResultListItemDto[] (+ AdminAiResultDetailDto.resultJson) — one per completed request
export const aiResultsMockData = aiRequestsMockData
  .filter((r) => r.hasResult)
  .map((r, i) => ({
    id: i + 1,
    requestId: r.id,
    userId: r.userId,
    userEmail: r.userEmail,
    createdAt: r.completedAt,
    resultJson: JSON.stringify(
      {
        type: r.type,
        summary: `#${r.userId} numaralı kullanıcı için ${TYPE_LABELS_TR[r.type] ?? r.type.toLowerCase()} planı oluşturuldu`,
        weeks: 4,
      },
      null,
      2,
    ),
  }));

function buildDistribution(items, key) {
  const counts = {};
  items.forEach((item) => {
    counts[item[key]] = (counts[item[key]] ?? 0) + 1;
  });
  return Object.entries(counts).map(([k, count]) => ({ key: k, count }));
}

// AdminAiStatisticsDto
export function buildAiStatistics() {
  const completed = aiRequestsMockData.filter((r) => r.status === "Completed");
  const failed = aiRequestsMockData.filter((r) => r.status === "Failed");
  const pending = aiRequestsMockData.filter((r) => r.status === "Pending" || r.status === "Processing");
  const durations = completed
    .filter((r) => r.startedAt && r.completedAt)
    .map((r) => (new Date(r.completedAt) - new Date(r.startedAt)) / 1000);
  const averageDurationSeconds = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;

  return {
    totalRequests: aiRequestsMockData.length,
    successfulRequests: completed.length,
    failedRequests: failed.length,
    pendingRequests: pending.length,
    averageDurationSeconds,
    modelDistribution: buildDistribution(aiRequestsMockData, "model"),
    requestTypeDistribution: buildDistribution(aiRequestsMockData, "type"),
  };
}
