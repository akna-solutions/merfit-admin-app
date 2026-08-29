// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Foods/AdminFoodDtos.cs and
// MerfitApi.Business/Dtos/Nutrition/AdminMealDtos.cs). AdminNutritionController
// only exposes a read-only, cross-user meal list/detail — there is no
// dedicated "nutrition overview stats" endpoint, so the Overview tab's
// metrics are computed client-side from the foods catalog + meal list,
// same as a real dashboard widget would aggregate them.

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const FOOD_NAMES = [
  "Chicken Breast", "Brown Rice", "Greek Yogurt", "Banana", "Almonds",
  "Salmon Fillet", "Broccoli", "Oatmeal", "Egg", "Avocado",
  "Sweet Potato", "Whey Protein", "Cottage Cheese", "Spinach", "Quinoa",
  "Peanut Butter", "Tuna", "Olive Oil", "Blueberries", "Lentils",
];
const BRANDS = [null, "Sütaş", "Pınar", "Eker", null, "Namet", null];
const UNITS = ["g", "ml", "piece"];

// AdminFoodListItemDto[] (+ AdminFoodDetailDto extras)
export const foodsMockData = FOOD_NAMES.map((name, i) => {
  const seed = i + 1;
  return {
    id: seed,
    name,
    barcode: seed % 3 === 0 ? `869${1000000000 + seed * 137}` : null,
    brand: BRANDS[seed % BRANDS.length],
    servingSize: [100, 150, 200, 1][seed % 4],
    servingUnit: UNITS[seed % UNITS.length],
    calories: Math.round(40 + seeded(seed) * 260),
    protein: Math.round(2 + seeded(seed * 2) * 28),
    carbs: Math.round(seeded(seed * 3) * 40),
    fat: Math.round(seeded(seed * 4) * 20),
    imageUrl: null,
    createdAt: daysAgo(30 + Math.floor(seeded(seed * 5) * 300)),

    // AdminFoodDetailDto extras
    fiber: Math.round(seeded(seed * 6) * 8),
    sugar: Math.round(seeded(seed * 7) * 15),
    sodium: Math.round(seeded(seed * 8) * 400),
    updatedAt: daysAgo(Math.floor(seeded(seed * 9) * 30)),
  };
});

const MEAL_USER_EMAILS = [
  "emreyilmaz001@example.com", "aysekaya002@example.com", "mehmetdemir003@example.com",
  "zeynepcelik004@example.com", "canahin005@example.com",
];

const MEAL_ITEM_POOL = foodsMockData.slice(0, 8);

function buildMealItems(seed) {
  const count = 2 + (seed % 3);
  return Array.from({ length: count }, (_, i) => {
    const food = MEAL_ITEM_POOL[(seed + i) % MEAL_ITEM_POOL.length];
    const quantity = 1 + ((seed + i) % 3);
    return {
      id: seed * 10 + i,
      foodId: food.id,
      foodName: food.name,
      quantity,
      servingSize: food.servingSize,
      calories: food.calories * quantity,
      protein: food.protein * quantity,
      carbs: food.carbs * quantity,
      fat: food.fat * quantity,
      fiber: food.fiber * quantity,
    };
  });
}

// AdminMealListItemDto[] (+ AdminMealDetailDto.items) — cross-user, read-only.
export const mealsMockData = Array.from({ length: 24 }, (_, i) => {
  const seed = i + 1;
  const items = buildMealItems(seed);
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  return {
    id: seed,
    userId: 1 + (seed % 5),
    userEmail: MEAL_USER_EMAILS[seed % MEAL_USER_EMAILS.length],
    date: daysAgo(seed % 20),
    notes: null,
    itemCount: items.length,
    totalCalories,
    items,
  };
});
