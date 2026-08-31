// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminWorkoutController.cs (+ the lookup
// controllers for category/muscle-group/equipment/exercise selects). Method
// names mirror the real endpoints one to one:
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
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const workoutService = {
  /** GET /api/admin/workouts — AdminWorkoutListRequest */
  getWorkouts(params = {}) {
    const {
      page = 1, pageSize = 20, search, categoryId, muscleGroupId,
      difficulty, isFeatured, isPremium, isAiGenerated, isActive,
    } = params;
    return apiClient.get(
      `/api/admin/workouts${buildQuery({
        page, pageSize, search, categoryId, muscleGroupId,
        difficulty, isFeatured, isPremium, isAiGenerated, isActive,
      })}`,
    );
  },

  /** GET /api/admin/workouts/{id} — AdminWorkoutDetailDto */
  getWorkoutById(id) {
    return apiClient.get(`/api/admin/workouts/${id}`);
  },

  /** POST /api/admin/workouts — AdminUpsertWorkoutRequest */
  createWorkout(payload) {
    return apiClient.post(`/api/admin/workouts`, payload);
  },

  /** PUT /api/admin/workouts/{id} — AdminUpsertWorkoutRequest */
  updateWorkout(id, payload) {
    return apiClient.put(`/api/admin/workouts/${id}`, payload);
  },

  /** DELETE /api/admin/workouts/{id} */
  deleteWorkout(id) {
    return apiClient.delete(`/api/admin/workouts/${id}`);
  },

  /** PATCH /api/admin/workouts/{id}/status — AdminUpdateWorkoutStatusRequest */
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/workouts/${id}/status`, { isActive });
  },

  /** PATCH /api/admin/workouts/{id}/featured — AdminUpdateWorkoutFeaturedRequest */
  updateFeatured(id, { isFeatured }) {
    return apiClient.patch(`/api/admin/workouts/${id}/featured`, { isFeatured });
  },

  /** PATCH /api/admin/workouts/{id}/premium — AdminUpdateWorkoutPremiumRequest */
  updatePremium(id, { isPremium }) {
    return apiClient.patch(`/api/admin/workouts/${id}/premium`, { isPremium });
  },

  /** GET /api/admin/workouts/{id}/exercises — AdminWorkoutExerciseItemDto[] */
  getExercises(id) {
    return apiClient.get(`/api/admin/workouts/${id}/exercises`);
  },

  /** PUT /api/admin/workouts/{id}/exercises — AdminSetWorkoutExercisesRequest (replace-all) */
  setExercises(id, { exercises }) {
    return apiClient.put(`/api/admin/workouts/${id}/exercises`, { exercises });
  },

  /** GET /api/admin/workouts/{id}/equipment — AdminWorkoutEquipmentItemDto[] */
  getEquipment(id) {
    return apiClient.get(`/api/admin/workouts/${id}/equipment`);
  },

  /** PUT /api/admin/workouts/{id}/equipment — AdminSetWorkoutEquipmentRequest (replace-all) */
  setEquipment(id, { equipmentIds }) {
    return apiClient.put(`/api/admin/workouts/${id}/equipment`, { equipmentIds });
  },

  // Lookup lists for the form's selects — not AdminWorkoutController itself,
  // but AdminWorkoutCategoryController / AdminMuscleGroupController /
  // AdminEquipmentController / AdminExerciseController. Real endpoints are
  // paginated, so a high pageSize is used to approximate an "all" lookup.
  getCategoryOptions() {
    return apiClient.get(`/api/admin/workout-categories${buildQuery({ page: 1, pageSize: 200 })}`);
  },
  getMuscleGroupOptions() {
    return apiClient.get(`/api/admin/muscle-groups${buildQuery({ page: 1, pageSize: 200 })}`);
  },
  getEquipmentOptions() {
    return apiClient.get(`/api/admin/equipment${buildQuery({ page: 1, pageSize: 200 })}`);
  },
  getExerciseOptions() {
    return apiClient.get(`/api/admin/exercises${buildQuery({ page: 1, pageSize: 200 })}`);
  },
};

// MerfitApi.Api/Controllers/Admin/AdminWorkoutCategoryController.cs
export const workoutCategoryService = {
  getCategories(params = {}) {
    const { page = 1, pageSize = 20, search, isActive } = params;
    return apiClient.get(`/api/admin/workout-categories${buildQuery({ page, pageSize, search, isActive })}`);
  },
  getCategoryById(id) {
    return apiClient.get(`/api/admin/workout-categories/${id}`);
  },
  createCategory(payload) {
    return apiClient.post(`/api/admin/workout-categories`, payload);
  },
  updateCategory(id, payload) {
    return apiClient.put(`/api/admin/workout-categories/${id}`, payload);
  },
  deleteCategory(id) {
    return apiClient.delete(`/api/admin/workout-categories/${id}`);
  },
};

// MerfitApi.Api/Controllers/Admin/AdminMuscleGroupController.cs
export const muscleGroupService = {
  getMuscleGroups(params = {}) {
    const { page = 1, pageSize = 20, search } = params;
    return apiClient.get(`/api/admin/muscle-groups${buildQuery({ page, pageSize, search })}`);
  },
  getMuscleGroupById(id) {
    return apiClient.get(`/api/admin/muscle-groups/${id}`);
  },
  createMuscleGroup(payload) {
    return apiClient.post(`/api/admin/muscle-groups`, payload);
  },
  updateMuscleGroup(id, payload) {
    return apiClient.put(`/api/admin/muscle-groups/${id}`, payload);
  },
  deleteMuscleGroup(id) {
    return apiClient.delete(`/api/admin/muscle-groups/${id}`);
  },
};

// MerfitApi.Api/Controllers/Admin/AdminEquipmentController.cs
export const equipmentService = {
  getEquipmentList(params = {}) {
    const { page = 1, pageSize = 20, search } = params;
    return apiClient.get(`/api/admin/equipment${buildQuery({ page, pageSize, search })}`);
  },
  getEquipmentById(id) {
    return apiClient.get(`/api/admin/equipment/${id}`);
  },
  createEquipment(payload) {
    return apiClient.post(`/api/admin/equipment`, payload);
  },
  updateEquipment(id, payload) {
    return apiClient.put(`/api/admin/equipment/${id}`, payload);
  },
  deleteEquipment(id) {
    return apiClient.delete(`/api/admin/equipment/${id}`);
  },
};

// MerfitApi.Api/Controllers/Admin/AdminExerciseController.cs
export const exerciseService = {
  getExercises(params = {}) {
    const { page = 1, pageSize = 20, search, difficulty, muscleGroupId, isActive } = params;
    return apiClient.get(
      `/api/admin/exercises${buildQuery({ page, pageSize, search, difficulty, muscleGroupId, isActive })}`,
    );
  },
  getExerciseById(id) {
    return apiClient.get(`/api/admin/exercises/${id}`);
  },
  createExercise(payload) {
    return apiClient.post(`/api/admin/exercises`, payload);
  },
  updateExercise(id, payload) {
    return apiClient.put(`/api/admin/exercises/${id}`, payload);
  },
  deleteExercise(id) {
    return apiClient.delete(`/api/admin/exercises/${id}`);
  },
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/exercises/${id}/status`, { isActive });
  },
};

// MerfitApi.Api/Controllers/Admin/AdminWorkoutPlanController.cs
export const workoutPlanService = {
  getPlans(params = {}) {
    const { page = 1, pageSize = 20, userId, isActive, isAiGenerated, goal } = params;
    return apiClient.get(
      `/api/admin/workout-plans${buildQuery({ page, pageSize, userId, isActive, isAiGenerated, goal })}`,
    );
  },
  getPlanById(id) {
    return apiClient.get(`/api/admin/workout-plans/${id}`);
  },
  updateStatus(id, { isActive }) {
    return apiClient.patch(`/api/admin/workout-plans/${id}/status`, { isActive });
  },
  getDays(id) {
    return apiClient.get(`/api/admin/workout-plans/${id}/days`);
  },
  setDays(id, { days }) {
    return apiClient.put(`/api/admin/workout-plans/${id}/days`, { days });
  },
};
