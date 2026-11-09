// Form değerleri <-> AdminWorkoutLabProfileInput. Kurallar mobil onboarding ile aynıdır:
// - Spor salonunda ekipman seçilmez (API ve işlemci katalogdaki tüm ekipmanları kullanır).
// - "Hiç ekipmanım yok" diğer ekipmanları temizler.
// - Belirli günler seçilirse haftalık gün sayısı bu günlerden türetilir (en az 2 gün).
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
  equipmentIds: [],
  noEquipment: false,
  trainingDaysPerWeek: 3,
  useSpecificDays: false,
  trainingDays: [],
  workoutDurationMin: 45,
  isPlus: false,
};

/** Ekipman seçimi: "Hiç ekipmanım yok" işaretlenince seçimler temizlenir; ekipman seçilince işaret kalkar. */
export function applyEquipmentChange(values, { equipmentIds, noEquipment }) {
  if (noEquipment === true) return { ...values, noEquipment: true, equipmentIds: [] };
  if (noEquipment === false) return { ...values, noEquipment: false };
  if (equipmentIds) return { ...values, equipmentIds, noEquipment: equipmentIds.length > 0 ? false : values.noEquipment };
  return values;
}

export function sortDays(days) {
  return [...new Set(days)].filter((d) => DAY_CODES.includes(d)).sort((a, b) => DAY_CODES.indexOf(a) - DAY_CODES.indexOf(b));
}

/** İstemci tarafı doğrulama (API aynı kuralları ayrıca uygular). Hata mesajlarını alan adına göre döner. */
export function validateForm(values) {
  const errors = {};
  if (values.useSpecificDays && sortDays(values.trainingDays).length < 2) {
    errors.trainingDays = "En az 2 gün seçin.";
  }
  if (values.trainingLocation !== "Gym" && !values.noEquipment && values.equipmentIds.length === 0) {
    errors.equipmentIds = "Ekipman seçin veya \"Hiç ekipmanım yok\" seçeneğini işaretleyin.";
  }
  return errors;
}

const orNull = (v) => (v === undefined || v === "" ? null : v);

export function toRequest(values) {
  const days = values.useSpecificDays ? sortDays(values.trainingDays) : [];
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
      equipmentIds: isGym || values.noEquipment ? [] : values.equipmentIds,
      noEquipment: !isGym && values.noEquipment,
      trainingDaysPerWeek: days.length > 0 ? days.length : orNull(values.trainingDaysPerWeek),
      trainingDays: days,
      workoutDurationMin: orNull(values.workoutDurationMin),
      isPlus: Boolean(values.isPlus),
    },
  };
}

/** Kayıtlı bir testin profilini forma geri yükler ("Bu profili düzenle"). */
export function fromProfile(profile = {}, name = "") {
  const days = sortDays(profile.trainingDays ?? []);
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
    equipmentIds: profile.equipmentIds ?? [],
    noEquipment: Boolean(profile.noEquipment),
    trainingDaysPerWeek: profile.trainingDaysPerWeek ?? undefined,
    useSpecificDays: days.length > 0,
    trainingDays: days,
    workoutDurationMin: profile.workoutDurationMin ?? undefined,
    isPlus: Boolean(profile.isPlus),
  };
}
