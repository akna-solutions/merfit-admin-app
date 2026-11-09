// Antrenman Laboratuvarı etiketleri. Enum değerleri API ile aynıdır (İngilizce kod); yalnızca gösterim Türkçedir.
export { fitnessGoalLabel, difficultyLabel } from "../../workouts/data/enumLabels";

export const EXPERIENCE_LABELS = { Beginner: "Başlangıç", Intermediate: "Orta", Advanced: "İleri" };
export const LOCATION_LABELS = { Home: "Ev", Gym: "Spor salonu", Outdoor: "Açık alan" };
export const GENDER_LABELS = { Male: "Erkek", Female: "Kadın" };

export const DAY_CODES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_LABELS = {
  Mon: "Pazartesi", Tue: "Salı", Wed: "Çarşamba", Thu: "Perşembe", Fri: "Cuma", Sat: "Cumartesi", Sun: "Pazar",
};
export const DAY_SHORT_LABELS = { Mon: "Pzt", Tue: "Sal", Wed: "Çar", Thu: "Per", Fri: "Cum", Sat: "Cmt", Sun: "Paz" };

export const SIMULATION_STATUS_LABELS = { Pending: "Bekliyor", Processing: "İşleniyor", Completed: "Tamamlandı", Failed: "Program üretilemedi" };
export const SIMULATION_STATUS_COLORS = { pending: "gold", processing: "blue", completed: "green", failed: "red" };

export const RATING_LABELS = { VeryGood: "Çok iyi", Good: "İyi", NeedsImprovement: "Geliştirilmeli", Poor: "Kötü" };
export const RATING_COLORS = { verygood: "green", good: "cyan", needsimprovement: "orange", poor: "red" };
export const RATING_ORDER = ["VeryGood", "Good", "NeedsImprovement", "Poor"];

export const CHECK_STATUS_LABELS = { Passed: "Başarılı", Warning: "Uyarı", Failed: "Başarısız" };
export const CHECK_STATUS_COLORS = { passed: "green", warning: "gold", failed: "red" };

export const POOL_STAGE_LABELS = {
  Primary: "Birincil havuz (seviye + süre + ekipman)",
  AdjacentDifficulty: "Fallback-1: bitişik zorluk seviyeleri",
  EquipmentFreeAnyDifficulty: "Fallback-2: ekipmansız tüm antrenmanlar (zorluk/süre filtresi yok)",
};

export const EQUIPMENT_RESOLUTION_LABELS = {
  AllEquipment: "Ekipmanlı: katalogdaki tüm ekipmanlar",
  GymAllEquipment: "Spor salonu: katalogdaki tüm ekipmanlar",
  Selected: "Seçilen ekipmanlar",
  None: "Ekipman yok",
};

export const experienceLabel = (v) => EXPERIENCE_LABELS[v] ?? v ?? "—";
export const locationLabel = (v) => LOCATION_LABELS[v] ?? v ?? "—";
export const dayLabel = (v) => DAY_LABELS[v] ?? v;
/** Gün sayısını algoritma belirler; test tamamlanana kadar 0 gelir. */
export const dayCountLabel = (n) => (n > 0 ? `${n} gün` : "gün: algoritma");
export const ratingLabel = (v) => RATING_LABELS[v] ?? v;
export const statusLabel = (v) => SIMULATION_STATUS_LABELS[v] ?? v;

/** "8-12" / "30 sn" / "—" */
export function repsLabel(exercise) {
  if (exercise.durationSeconds) return `${exercise.durationSeconds} sn`;
  if (exercise.reps == null) return "—";
  if (exercise.repsMax == null || exercise.repsMax === exercise.reps) return `${exercise.reps}`;
  return `${exercise.reps}-${exercise.repsMax}`;
}
