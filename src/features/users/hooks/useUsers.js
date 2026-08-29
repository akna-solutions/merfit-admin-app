import { useCallback, useEffect, useState } from "react";
import { userService } from "../services/userService";

// Filter shape mirrors AdminUserListRequest (MerfitApi.Business.Dtos.Admin.
// Users.AdminUserListRequest): isActive (bool|undefined), subscriptionStatus
// ("active"|"expired"|"cancelled"|undefined), dateRange -> createdFrom/To.
const DEFAULT_FILTERS = {
  search: "",
  isActive: undefined,
  subscriptionStatus: undefined,
  dateRange: null,
};

export function useUsers() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers({ ...filters, page, pageSize });
      setRows(response.data.items);
      setTotal(response.data.totalCount);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    refetch: fetchUsers,
  };
}
