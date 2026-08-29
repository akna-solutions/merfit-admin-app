// Mock implementation of AdminWorkoutController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminWorkoutController.cs). Method names
// mirror the real endpoints one to one:
//
//   GET    /api/admin/workouts                 -> getWorkouts(params)
//   GET    /api/admin/workouts/{id}             -> getWorkoutById(id)
//   POST   /api/admin/workouts                  -> createWorkout(payload)
//   PUT    /api/admin/workouts/{id}              -> updateWorkout(id, payload)
//   DELETE /api/admin/workouts/{id}              -> deleteWorkout(id)
//   PATCH  /api/admin/workouts/{id}/status       -> updateStatus(id, { isActive })
//   PATCH  /api/admin/workouts/{id}/featured     -> updateFeatured(id, { isFeatured })
//   PATCH  /api/admin/workouts/{id}/premium      -> updatePremium(id, { isPremium })
//   GET    /api/admin/workouts/{id}/exercises    -> getExercises(id)
//   PUT    /api/admin/workouts/{id}/exercises    -> setExercises(id, { exercises })  (replace-all)
//   GET    /api/admin/workouts/{id}/equipment    -> getEquipment(id)
//   PUT    /api/admin/workouts/{id}/equipment    -> setEquipment(id, { equipmentIds }) (replace-all)
import {
  workoutsMockData,
  workoutCategories,
  muscleGroups,
  equipmentList,
  exerciseLibrary,
} from "../data/workoutsMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let workouts = [...workoutsMockData];

function toListItemDto(w) {
  const {
    tagline, description, updatedAt, exerciseCount, equipmentCount, exercises, equipment,
    ...listItem
  } = w;
  void tagline; void description; void updatedAt; void exerciseCount; void equipmentCount;
  void exercises; void equipment;
  return listItem;
}

export const workoutService = {
  /** GET /api/admin/workouts — AdminWorkoutListRequest */
  getWorkouts(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(workouts, {
      search: params.search,
      searchFields: ["title", "slug"],
      filters: {
        categoryId: params.categoryId,
        muscleGroupId: params.muscleGroupId,
        difficulty: params.difficulty,
        isFeatured: params.isFeatured,
        isPremium: params.isPremium,
        isAiGenerated: params.isAiGenerated,
        isActive: params.isActive,
      },
      page,
      pageSize,
    });
    return simulateLatency(
      apiPagedSuccess(result.items.map(toListItemDto), page, pageSize, result.total),
    );
  },

  /** GET /api/admin/workouts/{id} — AdminWorkoutDetailDto */
  getWorkoutById(id) {
    const workout = workouts.find((w) => w.id === Number(id));
    if (!workout) return simulateLatency(apiSuccess(null), 150);
    const { exercises, equipment, ...detail } = workout;
    void exercises; void equipment;
    return simulateLatency(apiSuccess(detail), 200);
  },

  /** POST /api/admin/workouts — AdminUpsertWorkoutRequest */
  createWorkout(payload) {
    const category = workoutCategories.find((c) => c.id === payload.categoryId);
    const muscleGroup = muscleGroups.find((m) => m.id === payload.muscleGroupId);
    const newWorkout = {
      id: Math.max(0, ...workouts.map((w) => w.id)) + 1,
      isFeatured: false,
      isPremium: false,
      isAiGenerated: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: [],
      equipment: [],
      exerciseCount: 0,
      equipmentCount: 0,
      ...payload,
      categoryName: category?.name ?? "",
      muscleGroupName: muscleGroup?.name ?? null,
    };
    workouts = [newWorkout, ...workouts];
    const { exercises, equipment, ...detail } = newWorkout;
    void exercises; void equipment;
    return simulateLatency(apiSuccess(detail), 250);
  },

  /** PUT /api/admin/workouts/{id} — AdminUpsertWorkoutRequest */
  updateWorkout(id, payload) {
    const category = workoutCategories.find((c) => c.id === payload.categoryId);
    const muscleGroup = muscleGroups.find((m) => m.id === payload.muscleGroupId);
    workouts = workouts.map((w) =>
      w.id === Number(id)
        ? {
            ...w,
            ...payload,
            categoryName: category?.name ?? w.categoryName,
            muscleGroupName: payload.muscleGroupId ? muscleGroup?.name ?? null : null,
            updatedAt: new Date().toISOString(),
          }
        : w,
    );
    const updated = workouts.find((w) => w.id === Number(id));
    const { exercises, equipment, ...detail } = updated;
    void exercises; void equipment;
    return simulateLatency(apiSuccess(detail), 250);
  },

  /** DELETE /api/admin/workouts/{id} */
  deleteWorkout(id) {
    workouts = workouts.filter((w) => w.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** PATCH /api/admin/workouts/{id}/status */
  updateStatus(id, { isActive }) {
    workouts = workouts.map((w) => (w.id === Number(id) ? { ...w, isActive } : w));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** PATCH /api/admin/workouts/{id}/featured */
  updateFeatured(id, { isFeatured }) {
    workouts = workouts.map((w) => (w.id === Number(id) ? { ...w, isFeatured } : w));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** PATCH /api/admin/workouts/{id}/premium */
  updatePremium(id, { isPremium }) {
    workouts = workouts.map((w) => (w.id === Number(id) ? { ...w, isPremium } : w));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** GET /api/admin/workouts/{id}/exercises — AdminWorkoutExerciseItemDto[] */
  getExercises(id) {
    const workout = workouts.find((w) => w.id === Number(id));
    return simulateLatency(apiSuccess(workout?.exercises ?? []), 150);
  },

  /** PUT /api/admin/workouts/{id}/exercises — replace-all */
  setExercises(id, { exercises }) {
    workouts = workouts.map((w) =>
      w.id === Number(id) ? { ...w, exercises, exerciseCount: exercises.length } : w,
    );
    return simulateLatency(apiSuccess(exercises), 250);
  },

  /** GET /api/admin/workouts/{id}/equipment — AdminWorkoutEquipmentItemDto[] */
  getEquipment(id) {
    const workout = workouts.find((w) => w.id === Number(id));
    return simulateLatency(apiSuccess(workout?.equipment ?? []), 150);
  },

  /** PUT /api/admin/workouts/{id}/equipment — replace-all */
  setEquipment(id, { equipmentIds }) {
    const equipment = equipmentIds
      .map((eid) => equipmentList.find((e) => e.id === eid))
      .filter(Boolean)
      .map((e) => ({ equipmentId: e.id, equipmentName: e.name }));
    workouts = workouts.map((w) =>
      w.id === Number(id) ? { ...w, equipment, equipmentCount: equipment.length } : w,
    );
    return simulateLatency(apiSuccess(equipment), 250);
  },

  // Lookup lists for the form's selects — not AdminWorkoutController itself,
  // but AdminWorkoutCategoryController / AdminMuscleGroupController /
  // AdminEquipmentController / AdminExerciseController (unpaginated "all"
  // convenience calls; real API would need `pageSize` high enough or a
  // dedicated lookup endpoint).
  getCategoryOptions() {
    return simulateLatency(apiSuccess(workoutCategories), 100);
  },
  getMuscleGroupOptions() {
    return simulateLatency(apiSuccess(muscleGroups), 100);
  },
  getEquipmentOptions() {
    return simulateLatency(apiSuccess(equipmentList), 100);
  },
  getExerciseOptions() {
    return simulateLatency(apiSuccess(exerciseLibrary), 100);
  },
};
