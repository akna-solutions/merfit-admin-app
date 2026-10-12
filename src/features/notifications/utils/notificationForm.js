// Bildirim formlari icin saf yardimcilar (testli).

/** Pazar=0 ... Cumartesi=6 (System.DayOfWeek); Pazartesiden baslayarak gosterilir. */
export const WEEK_DAYS = [
  { value: 1, label: "Pzt" },
  { value: 2, label: "Sal" },
  { value: 3, label: "Çar" },
  { value: 4, label: "Per" },
  { value: 5, label: "Cum" },
  { value: 6, label: "Cmt" },
  { value: 0, label: "Paz" },
];

export function daysToMask(days = []) {
  return days.reduce((mask, day) => mask | (1 << day), 0);
}

export function maskToDays(mask = 127) {
  return WEEK_DAYS.map((d) => d.value).filter((day) => (mask & (1 << day)) !== 0);
}

export function describeMask(mask) {
  if (mask === 127) return "Her gün";
  if (mask === 62) return "Hafta içi";
  if (mask === 65) return "Hafta sonu";
  return WEEK_DAYS.filter((d) => (mask & (1 << d.value)) !== 0).map((d) => d.label).join(", ");
}

/** Formdaki ekran secimini API'nin bekledigi DataJson metnine cevirir. */
export function screenToDataJson(screen) {
  return screen ? JSON.stringify({ screen }) : null;
}

export function dataJsonToScreen(dataJson) {
  if (!dataJson) return undefined;
  try {
    return JSON.parse(dataJson)?.screen ?? undefined;
  } catch {
    return undefined;
  }
}

/** Metindeki {alan} adlari. */
export function findPlaceholders(text = "") {
  return Array.from(new Set(Array.from(String(text).matchAll(/\{([A-Za-z]+)\}/g), (m) => m[1])));
}

/** Ture gore izin verilmeyen alanlar (metadata.placeholdersByType). */
export function disallowedPlaceholders(texts, allowed = []) {
  const set = new Set(allowed);
  return Array.from(new Set(texts.flatMap((t) => findPlaceholders(t)).filter((p) => !set.has(p))));
}

/** "12, 15 18" gibi serbest girdiyi benzersiz pozitif tamsayi listesine cevirir. */
export function parseUserIds(values = []) {
  const list = Array.isArray(values) ? values : [values];
  return Array.from(
    new Set(
      list
        .flatMap((v) => String(v).split(/[\s,;]+/))
        .map((v) => Number(v))
        .filter((v) => Number.isInteger(v) && v > 0),
    ),
  );
}

export const SCREEN_LABELS = {
  dashboard: "Ana Sayfa",
  nutrition: "Beslenme",
  workouts: "Antrenmanlar",
  workoutPlan: "Antrenman Planı",
  progress: "İlerleme",
  leaderboard: "Sıralama",
  notifications: "Bildirimler",
  profile: "Profil",
  subscription: "Abonelik",
};

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

/** "Ekim 2026" (dayjs icin Turkce yerel ayar yuklu degil). */
export function monthLabel(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
