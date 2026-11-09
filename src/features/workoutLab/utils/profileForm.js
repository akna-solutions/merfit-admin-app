// Form değerleri <-> AdminWorkoutLabProfileInput. Kurallar mobil onboarding ile aynıdır:
// - Ekipman tek tek seçilmez: "Ekipmanlı" katalogdaki tüm ekipmanları, "Ekipmansız" yalnızca vücut ağırlığını ifade eder.
// - Spor salonu her zaman ekipmanlıdır.
// - Haftalık gün sayısı seçilmez; algoritma deneyim ve hedefe göre belirler. Kullanıcı yalnızca müsait günleri
//   seçer: hiç gün işaretlenmezse tüm hafta müsait kabul edilir, işaretlenirse en az 2 gün olmalıdır.
// Boş bırakılan alanlarda algoritmanın varsayılanları kullanılır.
import { DAY_CODES } from "./labLabels";

export const INITIAL_FORM = {
  name: "",
  age: null,
  gender: undefined,
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  goal: "BuildMuscle",
  experienceLevel: "Beginner",
  trainingLocation: "Home",
  hasEquipment: true,
  availableDays: [],
  workoutDurationMin: 45,
  isPlus: false,
};

export function sortDays(days) {
  return [...new Set(days)].filter((d) => DAY_CODES.includes(d)).sort((a, b) => DAY_CODES.indexOf(a) - DAY_CODES.indexOf(b));
}

/** İstemci tarafı doğrulama (API aynı kuralları ayrıca uygular). Hata mesajlarını alan adına göre döner. */
export function validateForm(values) {
  const errors = {};
  if (sortDays(values.availableDays ?? []).length === 1) {
    errors.availableDays = "En az 2 gün seçin ya da tüm hafta için hiçbirini işaretlemeyin.";
  }
  return errors;
}

const orNull = (v) => (v === undefined || v === "" ? null : v);

export function toRequest(values) {
  const isGym = values.trainingLocation === "Gym";
  return {
    name: values.name?.trim() || null,
    profile: {
      age: orNull(values.age),
      gender: orNull(values.gender),
      heightCm: orNull(values.heightCm),
      weightKg: orNull(values.weightKg),
      targetWeightKg: orNull(values.targetWeightKg),
      goal: orNull(values.goal),
      experienceLevel: orNull(values.experienceLevel),
      trainingLocation: values.trainingLocation,
      hasEquipment: isGym || Boolean(values.hasEquipment),
      trainingDays: sortDays(values.availableDays ?? []),
      workoutDurationMin: orNull(values.workoutDurationMin),
      isPlus: Boolean(values.isPlus),
    },
  };
}

/** Eski kayıtlarda hasEquipment yoktur; ekipman listesinden türetilir. */
function profileHasEquipment(profile) {
  if (profile.trainingLocation === "Gym") return true;
  if (typeof profile.hasEquipment === "boolean") return profile.hasEquipment;
  return !profile.noEquipment && (profile.equipmentIds?.length ?? 0) > 0;
}

/** Kayıtlı bir testin profilini forma geri yükler ("Bu profili düzenle"). */
export function fromProfile(profile = {}, name = "") {
  return {
    ...INITIAL_FORM,
    name: name ?? "",
    age: profile.age ?? null,
    gender: profile.gender ?? undefined,
    heightCm: profile.heightCm ?? null,
    weightKg: profile.weightKg ?? null,
    targetWeightKg: profile.targetWeightKg ?? null,
    goal: profile.goal ?? undefined,
    experienceLevel: profile.experienceLevel ?? undefined,
    trainingLocation: profile.trainingLocation ?? "Home",
    hasEquipment: profileHasEquipment(profile),
    availableDays: sortDays(profile.trainingDays ?? []),
    workoutDurationMin: profile.workoutDurationMin ?? undefined,
    isPlus: Boolean(profile.isPlus),
  };
}
