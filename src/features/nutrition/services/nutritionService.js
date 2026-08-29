// Mock implementations of AdminFoodController and AdminNutritionController
// (see MerfitApi repo: MerfitApi.Api/Controllers/Admin/AdminFoodController.cs,
// AdminNutritionController.cs). Method names mirror the real endpoints:
//
//   GET    /api/admin/foods            -> foodService.getFoods(params)
//   GET    /api/admin/foods/{id}        -> foodService.getFoodById(id)
//   POST   /api/admin/foods             -> foodService.createFood(payload)
//   PUT    /api/admin/foods/{id}         -> foodService.updateFood(id, payload)
//   DELETE /api/admin/foods/{id}         -> foodService.deleteFood(id)
//
//   GET    /api/admin/meals             -> mealService.getMeals(params)   (read-only)
//   GET    /api/admin/meals/{id}         -> mealService.getMealById(id)   (read-only)
import { foodsMockData, mealsMockData } from "../data/nutritionMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let foods = [...foodsMockData];
const meals = [...mealsMockData];

export const foodService = {
  /** GET /api/admin/foods — AdminFoodListRequest */
  getFoods(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(foods, {
      search: params.search,
      searchFields: ["name", "brand", "barcode"],
      filters: { brand: params.brand, barcode: params.barcode },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  /** GET /api/admin/foods/{id} */
  getFoodById(id) {
    const food = foods.find((f) => f.id === Number(id));
    return simulateLatency(apiSuccess(food ?? null), 150);
  },

  /** POST /api/admin/foods — AdminUpsertFoodRequest */
  createFood(payload) {
    const newFood = {
      id: Math.max(0, ...foods.map((f) => f.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    foods = [newFood, ...foods];
    return simulateLatency(apiSuccess(newFood), 250);
  },

  /** PUT /api/admin/foods/{id} — AdminUpsertFoodRequest */
  updateFood(id, payload) {
    foods = foods.map((f) =>
      f.id === Number(id) ? { ...f, ...payload, updatedAt: new Date().toISOString() } : f,
    );
    return simulateLatency(apiSuccess(foods.find((f) => f.id === Number(id))), 250);
  },

  /** DELETE /api/admin/foods/{id} */
  deleteFood(id) {
    foods = foods.filter((f) => f.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
};

export const mealService = {
  /** GET /api/admin/meals — AdminMealListRequest (read-only, cross-user) */
  getMeals(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(meals, {
      filters: { userId: params.userId },
      dateRange: params.dateRange,
      dateField: "date",
      page,
      pageSize,
    });
    return simulateLatency(
      apiPagedSuccess(
        result.items.map(({ items, ...listItem }) => {
          void items;
          return listItem;
        }),
        page,
        pageSize,
        result.total,
      ),
    );
  },

  /** GET /api/admin/meals/{id} */
  getMealById(id) {
    const meal = meals.find((m) => m.id === Number(id));
    return simulateLatency(apiSuccess(meal ?? null), 150);
  },
};
