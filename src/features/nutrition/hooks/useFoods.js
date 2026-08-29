import { useCallback, useEffect, useState } from "react";
import { foodService } from "../services/nutritionService";

const DEFAULT_FILTERS = { search: "", brand: undefined, barcode: undefined };

export function useFoods() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const response = await foodService.getFoods({ ...filters, page, pageSize });
      setRows(response.data.items);
      setTotal(response.data.totalCount);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const updateFilters = useCallback((patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setPage(1);
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch: fetchFoods,
  };
}
