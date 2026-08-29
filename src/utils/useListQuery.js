import { useCallback, useEffect, useState } from "react";

// Generic "filters + pagination -> paged rows" hook shared by any tab whose
// data source is one of the mock services' getX(params) methods returning
// the ApiResponse<PagedResult<T>> envelope. Avoids re-writing the same
// fetch/filter/paginate boilerplate for Products, Subscriptions and
// Transactions (and any future simple list tab).
export function useListQuery(fetchFn, defaultFilters, defaultPageSize = 20) {
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFn({ ...filters, page, pageSize });
      setRows(response.data.items);
      setTotal(response.data.totalCount);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const updateFilters = useCallback((patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setPage(1);
    setFilters(defaultFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch: fetchRows,
  };
}
