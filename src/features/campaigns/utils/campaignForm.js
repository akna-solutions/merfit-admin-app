import dayjs from "dayjs";

// Kod değerleri API ile birebir eşleşir (AdminCampaignService.Status*) — yalnızca etiketler Türkçe.
export const CAMPAIGN_STATUS_LABELS = {
  Live: "Yayında",
  Scheduled: "Planlandı",
  Ended: "Sona erdi",
  Passive: "Pasif",
};

export const CAMPAIGN_STATUS_COLORS = {
  live: "green",
  scheduled: "blue",
  ended: "default",
  passive: "red",
};

export const TITLE_MAX = 200;
export const SUMMARY_MAX = 300;
export const BODY_MAX = 8000;

const HTTP_URL = /^https?:\/\/\S+$/i;

/** antd Form kuralı: boş değer serbest, doluysa http(s) adresi olmalı (sunucu da aynı kuralı uygular). */
export const httpUrlRule = (message) => ({
  validator: (_, value) =>
    !value || HTTP_URL.test(String(value).trim()) ? Promise.resolve() : Promise.reject(new Error(message)),
});

/** API kaydını form alanlarına çevirir. */
export function toFormValues(item) {
  if (!item) return { isActive: true, sortOrder: 0 };
  return {
    title: item.title,
    summary: item.summary ?? undefined,
    body: item.body ?? undefined,
    imageUrl: item.imageUrl ?? undefined,
    linkUrl: item.linkUrl ?? undefined,
    category: item.category ?? undefined,
    sortOrder: item.sortOrder ?? 0,
    isActive: item.isActive,
    dateRange: item.startAt || item.endAt
      ? [item.startAt ? dayjs(item.startAt) : null, item.endAt ? dayjs(item.endAt) : null]
      : undefined,
  };
}

const blankToNull = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
};

/** Form değerlerini AdminUpsertCampaignRequest gövdesine çevirir. */
export function toPayload({ dateRange, ...values }) {
  return {
    title: String(values.title ?? "").trim(),
    summary: blankToNull(values.summary),
    body: blankToNull(values.body),
    imageUrl: blankToNull(values.imageUrl),
    linkUrl: blankToNull(values.linkUrl),
    category: blankToNull(values.category),
    sortOrder: Number.isFinite(Number(values.sortOrder)) ? Number(values.sortOrder) : 0,
    isActive: Boolean(values.isActive),
    // Başlangıç günün başı, bitiş günün sonu: seçilen son gün de yayında kalır.
    startAt: dateRange?.[0] ? dateRange[0].startOf("day").toISOString() : null,
    endAt: dateRange?.[1] ? dateRange[1].endOf("day").toISOString() : null,
  };
}

/**
 * Listede bir kampanyayı yukarı/aşağı taşır ve tüm listeyi 10'ar aralıklarla yeniden numaralar.
 * Dönen dizi PUT /order gövdesidir; taşıma mümkün değilse null.
 */
export function buildReorder(rows, index, direction) {
  const target = index + direction;
  if (index < 0 || index >= rows.length || target < 0 || target >= rows.length) return null;
  const next = rows.slice();
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((row, i) => ({ id: row.id, sortOrder: i * 10 }));
}
