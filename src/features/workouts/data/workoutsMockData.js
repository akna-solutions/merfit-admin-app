// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Workouts/AdminWorkoutDtos.cs, .../WorkoutCategories,
// .../MuscleGroups, .../Equipment, .../Exercises, and
// MerfitApi.Api/Controllers/Admin/AdminWorkoutController.cs). Categories,
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

// AdminWorkoutCategoryDto[]
export const workoutCategories = [
  { id: 1, name: "Strength", slug: "strength" },
  { id: 2, name: "Cardio", slug: "cardio" },
  { id: 3, name: "HIIT", slug: "hiit" },
  { id: 4, name: "Yoga", slug: "yoga" },
  { id: 5, name: "Mobility", slug: "mobility" },
  { id: 6, name: "Core", slug: "core" },
];

// AdminMuscleGroupDto[]
export const muscleGroups = [
  { id: 1, name: "Full Body", slug: "full-body" },
  { id: 2, name: "Upper Body", slug: "upper-body" },
  { id: 3, name: "Lower Body", slug: "lower-body" },
  { id: 4, name: "Core", slug: "core" },
  { id: 5, name: "Back", slug: "back" },
  { id: 6, name: "Glutes", slug: "glutes" },
];

// AdminEquipmentDto[]
export const equipmentList = [
  { id: 1, name: "Dumbbell", slug: "dumbbell" },
  { id: 2, name: "Barbell", slug: "barbell" },
  { id: 3, name: "Kettlebell", slug: "kettlebell" },
  { id: 4, name: "Resistance Band", slug: "resistance-band" },
  { id: 5, name: "Bodyweight", slug: "bodyweight" },
  { id: 6, name: "Bench", slug: "bench" },
];

// AdminExerciseListItemDto[] — DifficultyLevel is serialized as a plain
// string by the API's own DTO (converted server-side), same as Workout's.
const EXERCISE_NAMES = [
  "Barbell Squat", "Push Up", "Dumbbell Row", "Plank", "Lunges",
  "Deadlift", "Burpees", "Mountain Climbers", "Bicep Curl", "Shoulder Press",
  "Jumping Jacks", "Russian Twist", "Glute Bridge", "Pull Up", "Bench Press",
];
export const exerciseLibrary = EXERCISE_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  difficulty: ["Beginner", "Intermediate", "Advanced"][i % 3],
  primaryMuscleGroupId: muscleGroups[i % muscleGroups.length].id,
  primaryMuscleGroupName: muscleGroups[i % muscleGroups.length].name,
  isActive: true,
}));

const TITLES = [
  "Full Body Burn", "Upper Body Strength", "HIIT Cardio Blast", "Core Crusher",
  "Leg Day Power", "Yoga Flow Flexibility", "Glute Activation", "Back & Biceps",
  "Fat Burn Express", "Beginner Bodyweight", "Advanced Kettlebell", "Mobility Reset",
  "Push Pull Legs", "Cardio Endurance", "Total Body Tone", "Ab Shredder",
  "Speed & Agility", "Power Yoga", "Functional Strength", "Recovery Stretch",
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
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
    tagline: "A results-driven session built by the Merfit coaching team.",
    description:
      "A structured session combining compound movements and conditioning work designed to maximize results in minimal time.",
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
