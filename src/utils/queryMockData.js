// Small shared helper so every feature's mock service (spec §25) can
// filter / sort / paginate its in-memory array the same way, without
// re-implementing this logic 14 times. Mirrors the shape a real paginated
// REST endpoint would return, so swapping in real API calls later only
// means replacing the body of the service method, not the return shape.

export function simulateLatency(data, ms = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// Wraps mock data in MBFitApi's exact response envelope
// (MBFitApi.Business.Common.Responses.ApiResponse<T>) so every mock service
// call already returns what the real endpoint will: { isSuccess, data,
// errorMessage, errors, traceId }. Hooks/components read `.data`, which
// means swapping a mock service method for a real axios/fetch call later
// requires no change above the service layer.
export function apiSuccess(data) {
  return {
    isSuccess: true,
    data,
    errorMessage: null,
    errors: [],
    traceId: `mock-${Math.random().toString(36).slice(2, 10)}`,
  };
}

// Wraps a paged array in MBFitApi's PagedResult<T> shape
// (MBFitApi.Business.Common.Pagination.PagedResult<T>), nested inside the
// ApiResponse envelope exactly as AdminXxxController list endpoints return it.
export function apiPagedSuccess(items, page, pageSize, totalCount) {
  const totalPages = pageSize <= 0 ? 0 : Math.ceil(totalCount / pageSize);
  return apiSuccess({
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  });
}

/**
 * @param {Array<object>} rows full in-memory dataset
 * @param {object} params
 * @param {string} [params.search] plain-text search
 * @param {string[]} [params.searchFields] which fields `search` matches against
 * @param {object} [params.filters] exact-match filters, e.g. { status: "Active" }
 * @param {[string,string]} [params.dateRange] ISO strings, inclusive
 * @param {string} [params.dateField] field name compared against dateRange
 * @param {number} [params.page] 1-based
 * @param {number} [params.pageSize]
 */
export function queryRows(rows, params = {}) {
  const {
    search,
    searchFields = [],
    filters = {},
    dateRange,
    dateField,
    page = 1,
    pageSize = 20,
  } = params;

  let result = [...rows];

  if (search && searchFields.length) {
    const needle = search.trim().toLowerCase();
    if (needle) {
      result = result.filter((row) =>
        searchFields.some((field) =>
          String(row[field] ?? "").toLowerCase().includes(needle),
        ),
      );
    }
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") {
      return;
    }
    result = result.filter((row) => row[key] === value);
  });

  if (dateRange && dateRange[0] && dateRange[1] && dateField) {
    const start = new Date(dateRange[0]).getTime();
    const end = new Date(dateRange[1]).getTime();
    result = result.filter((row) => {
      const t = new Date(row[dateField]).getTime();
      return t >= start && t <= end;
    });
  }

  const total = result.length;
  const start = (page - 1) * pageSize;
  const items = result.slice(start, start + pageSize);

  return { items, total, page, pageSize };
}
