// İki testin sonuç anlık görüntülerinden (MerfitCustomerApi'nin yazdığı ResultJson) karşılaştırma satırları.
// Yalnızca kayıtta bulunan değerler kullanılır; yeni bir puan hesaplanmaz.
import { DAY_CODES, DAY_SHORT_LABELS, CHECK_STATUS_LABELS } from "./labLabels";

export function dayDistribution(result) {
  const set = new Set((result?.days ?? []).map((d) => d.dayOfWeek));
  return DAY_CODES.map((code) => ({ code, label: DAY_SHORT_LABELS[code], active: set.has(code) }));
}

export function muscleGroupMap(result) {
  const map = new Map();
  (result?.metrics?.muscleGroups ?? []).forEach((m) => map.set(m.name, m));
  return map;
}

/** Kas grubu dağılımı: iki tarafın birleşik listesi (set sayısına göre). */
export function muscleGroupRows(left, right) {
  const l = muscleGroupMap(left);
  const r = muscleGroupMap(right);
  const names = [...new Set([...l.keys(), ...r.keys()])];
  return names
    .map((name) => ({
      name,
      left: l.get(name) ?? null,
      right: r.get(name) ?? null,
    }))
    .sort((a, b) => (b.left?.sets ?? 0) + (b.right?.sets ?? 0) - ((a.left?.sets ?? 0) + (a.right?.sets ?? 0)));
}

const repsSummary = (result) =>
  (result?.metrics?.repsRanges ?? []).map((r) => `${r.label} (${r.exerciseCount})`).join(", ") || "—";

const setsPerExercise = (result) => {
  const total = result?.metrics?.totalExercises ?? 0;
  return total ? Math.round(((result?.metrics?.totalSets ?? 0) / total) * 10) / 10 : 0;
};

/** Sayısal metrik satırları; changed = iki taraf farklı. */
export function metricRows(left, right) {
  const rows = [
    { key: "days", label: "Antrenman günü", l: left?.days?.length ?? 0, r: right?.days?.length ?? 0 },
    { key: "exercises", label: "Toplam egzersiz", l: left?.metrics?.totalExercises ?? 0, r: right?.metrics?.totalExercises ?? 0 },
    { key: "unique", label: "Farklı egzersiz", l: left?.metrics?.uniqueExercises ?? 0, r: right?.metrics?.uniqueExercises ?? 0 },
    { key: "sets", label: "Toplam set", l: left?.metrics?.totalSets ?? 0, r: right?.metrics?.totalSets ?? 0 },
    { key: "setsPerExercise", label: "Egzersiz başına set", l: setsPerExercise(left), r: setsPerExercise(right) },
    { key: "reps", label: "Tekrar aralıkları", l: repsSummary(left), r: repsSummary(right) },
    { key: "rest", label: "Dinlenme (sn)", l: left?.restSecondsRule ?? "—", r: right?.restSecondsRule ?? "—" },
    { key: "cardio", label: "Kardiyo günü", l: left?.cardioDays ?? 0, r: right?.cardioDays ?? 0 },
    { key: "avgDuration", label: "Ortalama süre (dk)", l: left?.metrics?.averageDurationMin ?? 0, r: right?.metrics?.averageDurationMin ?? 0 },
    { key: "equipment", label: "Kullanılan ekipman", l: left?.metrics?.usedEquipmentCount ?? 0, r: right?.metrics?.usedEquipmentCount ?? 0 },
    { key: "pool", label: "Aday havuzu", l: left?.poolStage ?? "—", r: right?.poolStage ?? "—" },
  ];
  return rows.map((row) => ({ ...row, changed: String(row.l) !== String(row.r) }));
}

/** Kalite kontrolleri koda göre eşleştirilir. */
export function checkRows(leftChecks = [], rightChecks = []) {
  const l = new Map((leftChecks ?? []).map((c) => [c.code, c]));
  const r = new Map((rightChecks ?? []).map((c) => [c.code, c]));
  const codes = [...new Set([...l.keys(), ...r.keys()])];
  return codes.map((code) => {
    const left = l.get(code) ?? null;
    const right = r.get(code) ?? null;
    return {
      code,
      title: left?.title ?? right?.title ?? code,
      left,
      right,
      changed: (left?.status ?? null) !== (right?.status ?? null),
    };
  });
}

/** Gün gün antrenman eşleşmesi: aynı gündeki ana antrenman/kardiyo farklı mı. */
export function dayRows(left, right) {
  const l = new Map((left?.days ?? []).map((d) => [d.dayOfWeek, d]));
  const r = new Map((right?.days ?? []).map((d) => [d.dayOfWeek, d]));
  return DAY_CODES.filter((c) => l.has(c) || r.has(c)).map((code) => {
    const a = l.get(code) ?? null;
    const b = r.get(code) ?? null;
    return {
      code,
      left: a,
      right: b,
      changed: a?.workout?.id !== b?.workout?.id || (a?.cardio?.id ?? null) !== (b?.cardio?.id ?? null),
    };
  });
}

export function checkStatusSummary(checks = []) {
  const counts = { Passed: 0, Warning: 0, Failed: 0 };
  (checks ?? []).forEach((c) => {
    counts[c.status] = (counts[c.status] ?? 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, label: CHECK_STATUS_LABELS[status], count }));
}

/** Profil farkları (aynı profil + farklı algoritma karşılaştırmasında boş döner). */
export function profileDiff(leftProfile = {}, rightProfile = {}) {
  const keys = [...new Set([...Object.keys(leftProfile ?? {}), ...Object.keys(rightProfile ?? {})])];
  return keys.filter((k) => JSON.stringify(leftProfile?.[k] ?? null) !== JSON.stringify(rightProfile?.[k] ?? null));
}
