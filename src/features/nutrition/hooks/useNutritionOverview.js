import { useEffect, useState } from "react";
import { foodService, mealService } from "../services/nutritionService";

// No single endpoint returns "nutrition overview" stats — AdminFoodController
// and AdminNutritionController only expose paged lists — so this hook
// aggregates client-side from the foods catalog and the most recent global
// meals, the way a real dashboard widget would combine two API calls.
export function useNutritionOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalFoods: 0, avgCalories: 0, avgProtein: 0 });
  const [recentMeals, setRecentMeals] = useState([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      foodService.getFoods({ page: 1, pageSize: 1000 }),
      mealService.getMeals({ page: 1, pageSize: 8 }),
    ]).then(([foodsRes, mealsRes]) => {
      if (!active) return;
      const allFoods = foodsRes.data.items;
      const totalFoods = foodsRes.data.totalCount;
      const avgCalories = allFoods.length
        ? Math.round(allFoods.reduce((sum, f) => sum + f.calories, 0) / allFoods.length)
        : 0;
      const avgProtein = allFoods.length
        ? Math.round(allFoods.reduce((sum, f) => sum + f.protein, 0) / allFoods.length)
        : 0;
      setStats({ totalFoods, avgCalories, avgProtein });
      setRecentMeals(mealsRes.data.items);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { loading, stats, recentMeals };
}
