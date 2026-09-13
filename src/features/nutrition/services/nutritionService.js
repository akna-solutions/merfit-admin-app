// Real MBFitApi calls (see MBFitApi repo, running at http://localhost:5000):
// MBFitApi.Api/Controllers/Admin/AdminFoodController.cs and
// AdminNutritionController.cs. Method names mirror the real endpoints:
//
//   GET    /api/admin/foods            -> foodService.getFoods(params)
//   GET    /api/admin/foods/{id}        -> foodService.getFoodById(id)
//   POST   /api/admin/foods             -> foodService.createFood(payload)
//   PUT    /api/admin/foods/{id}         -> foodService.updateFood(id, payload)
//   DELETE /api/admin/foods/{id}         -> foodService.deleteFood(id)
//
//   GET    /api/admin/meals             -> mealService.getMeals(params)   (read-only)
//   GET    /api/admin/meals/{id}         -> mealService.getMealById(id)   (read-only)
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const foodService = {
  /** GET /api/admin/foods — AdminFoodListRequest */
  getFoods(params = {}) {
    const { page = 1, pageSize = 20, search, brand, barcode } = params;
    return apiClient.get(`/api/admin/foods${buildQuery({ page, pageSize, search, brand, barcode })}`);
  },

  /** GET /api/admin/foods/{id} */
  getFoodById(id) {
    return apiClient.get(`/api/admin/foods/${id}`);
  },

  /** POST /api/admin/foods — AdminUpsertFoodRequest */
  createFood(payload) {
    return apiClient.post(`/api/admin/foods`, payload);
  },

  /** PUT /api/admin/foods/{id} — AdminUpsertFoodRequest */
  updateFood(id, payload) {
    return apiClient.put(`/api/admin/foods/${id}`, payload);
  },

  /** DELETE /api/admin/foods/{id} */
  deleteFood(id) {
    return apiClient.delete(`/api/admin/foods/${id}`);
  },
};

export const mealService = {
  /** GET /api/admin/meals — AdminMealListRequest (read-only, cross-user) */
  getMeals(params = {}) {
    const { page = 1, pageSize = 20, userId, dateRange } = params;
    const [from, to] = dateRange ?? [];
    return apiClient.get(`/api/admin/meals${buildQuery({ page, pageSize, userId, from, to })}`);
  },

  /** GET /api/admin/meals/{id} */
  getMealById(id) {
    return apiClient.get(`/api/admin/meals/${id}`);
  },
};
