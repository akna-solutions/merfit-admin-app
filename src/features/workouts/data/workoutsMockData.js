// Mock data shaped to match MBFitApi's real DTOs (see MBFitApi repo:
// MBFitApi.Business/Dtos/Workouts/AdminWorkoutDtos.cs, .../WorkoutCategories,
// .../MuscleGroups, .../Equipment, .../Exercises, and
// MBFitApi.Api/Controllers/Admin/AdminWorkoutController.cs). Categories,
// muscle groups, equipment and exercises are managed by their own
// controllers in the real API; here they're simple lookup tables used to
// populate the Workout form's selects, since this phase only ships the
// /admin/workouts screen itself.

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Turkish display names contain non-ASCII characters (ç, ğ, ı, ö, ş, ü) that
// a plain lowercase + strip-non-alphanumeric pass would just drop, leaving
// mangled slugs. Transliterate to ASCII first so slugs stay clean,
// URL-safe technical identifiers.
const TURKISH_ASCII_MAP = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
};
function slugify(text) {
  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => TURKISH_ASCII_MAP[ch])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// AdminWorkoutCategoryDto[]
export const workoutCategories = [
  { id: 1, name: "Kuvvet", slug: "strength" },
  { id: 2, name: "Kardiyo", slug: "cardio" },
  { id: 3, name: "HIIT", slug: "hiit" },
  { id: 4, name: "Yoga", slug: "yoga" },
  { id: 5, name: "Hareketlilik", slug: "mobility" },
  { id: 6, name: "Core", slug: "core" },
];

// AdminMuscleGroupDto[]
export const muscleGroups = [
  { id: 1, name: "Tüm Vücut", slug: "full-body" },
  { id: 2, name: "Üst Vücut", slug: "upper-body" },
  { id: 3, name: "Alt Vücut", slug: "lower-body" },
  { id: 4, name: "Core", slug: "core" },
  { id: 5, name: "Sırt", slug: "back" },
  { id: 6, name: "Kalça", slug: "glutes" },
];

// AdminEquipmentDto[]
export const equipmentList = [
  { id: 1, name: "Dambıl", slug: "dumbbell" },
  { id: 2, name: "Halter", slug: "barbell" },
  { id: 3, name: "Kettlebell", slug: "kettlebell" },
  { id: 4, name: "Direnç Bandı", slug: "resistance-band" },
  { id: 5, name: "Vücut Ağırlığı", slug: "bodyweight" },
  { id: 6, name: "Bench", slug: "bench" },
];

// AdminExerciseListItemDto[] — DifficultyLevel is serialized as a plain
// string by the API's own DTO (converted server-side), same as Workout's.
const EXERCISE_NAMES = [
  "Halterle Squat", "Şınav", "Dambılla Kürek Çekme", "Plank", "Hamle",
  "Ölü Kaldırma", "Burpee", "Dağcı Hareketi", "Biceps Curl", "Omuz Press",
  "Yıldız Sıçraması", "Russian Twist", "Kalça Köprüsü", "Barfiks", "Bench Press",
];
export const exerciseLibrary = EXERCISE_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  slug: slugify(name),
  difficulty: ["Beginner", "Intermediate", "Advanced"][i % 3],
  primaryMuscleGroupId: muscleGroups[i % muscleGroups.length].id,
  primaryMuscleGroupName: muscleGroups[i % muscleGroups.length].name,
  isActive: true,
}));

const TITLES = [
  "Tüm Vücut Yakımı", "Üst Vücut Gücü", "HIIT Kardiyo Patlaması", "Core Güçlendirme",
  "Bacak Günü Gücü", "Esneklik İçin Yoga Akışı", "Kalça Aktivasyonu", "Sırt ve Biceps",
  "Hızlı Yağ Yakımı", "Başlangıç Seviyesi Vücut Ağırlığı", "İleri Seviye Kettlebell", "Hareketlilik Sıfırlama",
  "İtiş-Çekiş-Bacak", "Kardiyo Dayanıklılığı", "Tüm Vücut Sıkılaştırma", "Karın Kası Parçalayıcı",
  "Hız ve Çeviklik", "Güç Yogası", "Fonksiyonel Güç", "Toparlanma Esnetmesi",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function buildExercisesFor(seed) {
  const count = 4 + (seed % 4);
  return Array.from({ length: count }, (_, i) => {
    const ex = exerciseLibrary[(seed + i) % exerciseLibrary.length];
    return {
      exerciseId: ex.id,
      exerciseName: ex.name,
      order: i + 1,
      sets: 3 + ((seed + i) % 2),
      reps: 8 + ((seed + i) % 4) * 2,
      restSeconds: 30 + ((seed + i) % 3) * 15,
      durationSeconds: null,
      notes: null,
      isOptional: false,
    };
  });
}

function buildEquipmentFor(seed) {
  const count = 1 + (seed % 3);
  return Array.from({ length: count }, (_, i) => {
    const eq = equipmentList[(seed + i) % equipmentList.length];
    return { equipmentId: eq.id, equipmentName: eq.name };
  });
}

// AdminWorkoutListItemDto[] (+ the extra fields AdminWorkoutDetailDto adds)
export const workoutsMockData = TITLES.map((title, i) => {
  const seed = i + 1;
  const slug = slugify(title);
  const category = workoutCategories[seed % workoutCategories.length];
  const muscleGroup = muscleGroups[seed % muscleGroups.length];
  const exercises = buildExercisesFor(seed);
  const equipment = buildEquipmentFor(seed);

  return {
    id: seed,
    title,
    slug,
    durationMin: 15 + (seed % 6) * 5,
    difficulty: DIFFICULTIES[seed % DIFFICULTIES.length],
    categoryId: category.id,
    categoryName: category.name,
    muscleGroupId: muscleGroup.id,
    muscleGroupName: muscleGroup.name,
    imageUrl: null,
    isFeatured: seed % 4 === 0,
    isPremium: seed % 3 === 0,
    isAiGenerated: seed % 5 === 0,
    isActive: seed % 7 !== 0,
    createdAt: daysAgo(90 + Math.floor(seeded(seed) * 200)),

    // AdminWorkoutDetailDto extras
    tagline: "MB Fit koçluk ekibi tarafından hazırlanmış, sonuç odaklı bir antrenman.",
    description:
      "Minimum sürede maksimum sonuç elde etmek için tasarlanmış, bileşik hareketleri ve kondisyon çalışmalarını bir araya getiren yapılandırılmış bir antrenman.",
    updatedAt: daysAgo(Math.floor(seeded(seed) * 45)),
    exerciseCount: exercises.length,
    equipmentCount: equipment.length,

    // Not part of any DTO returned by the list/detail endpoints — kept here
    // so the mock GET/PUT .../exercises and .../equipment endpoints have
    // something to read from and write to.
    exercises,
    equipment,
  };
});
