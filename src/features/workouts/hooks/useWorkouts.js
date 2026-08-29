import { useCallback, useEffect, useState } from "react";
import { workoutService } from "../services/workoutService";

// Mirrors AdminWorkoutListRequest (categoryId, muscleGroupId, difficulty,
// isFeatured, isPremium, isAiGenerated, isActive — all optional/undefined
// meaning "no filter").
const DEFAULT_FILTERS = {
  search: "",
  categoryId: undefined,
  difficulty: undefined,
  isFeatured: undefined,
  isPremium: undefined,
  isActive: undefined,
};

export function useWorkouts() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await workoutService.getWorkouts({ ...filters, page, pageSize });
      setRows(response.data.items);
      setTotal(response.data.totalCount);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const updateFilters = useCallback((patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setPage(1);
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    rows,
    total,
    loading,
    filters,
    page,
    pageSize,
    setPage,
    setPageSize,
    updateFilters,
    resetFilters,
    refetch: fetchWorkouts,
  };
}
