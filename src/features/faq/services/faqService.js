// Mock implementation of AdminFaqController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminFaqController.cs).
//
//   GET/POST/PUT/DELETE /api/admin/faq/categories[...]  -> faqCategoryService.*
//   GET/POST/PUT/DELETE /api/admin/faqs[...]            -> faqService.*
//   PATCH /api/admin/faqs/{id}/status                    -> faqService.updateStatus
//   PUT   /api/admin/faqs/order                           -> faqService.reorder
import { faqCategoriesMockData, faqsMockData } from "../data/faqMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let categories = [...faqCategoriesMockData];
let faqs = [...faqsMockData];

function withFaqCount(category) {
  return { ...category, faqCount: faqs.filter((f) => f.categoryId === category.id).length };
}

export const faqCategoryService = {
  /** GET /api/admin/faq/categories */
  getCategories(params = {}) {
    const { page = 1, pageSize = 50 } = params;
    const withCounts = categories.map(withFaqCount).sort((a, b) => a.sortOrder - b.sortOrder);
    const result = queryRows(withCounts, {
      search: params.search,
      searchFields: ["name"],
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getCategoryById(id) {
    const found = categories.find((c) => c.id === Number(id));
    return simulateLatency(apiSuccess(found ? withFaqCount(found) : null), 150);
  },
  /** POST /api/admin/faq/categories — AdminUpsertFaqCategoryRequest */
  createCategory(payload) {
    const newCategory = {
      id: Math.max(0, ...categories.map((c) => c.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    categories = [...categories, newCategory];
    return simulateLatency(apiSuccess(withFaqCount(newCategory)), 250);
  },
  updateCategory(id, payload) {
    categories = categories.map((c) =>
      c.id === Number(id) ? { ...c, ...payload, updatedAt: new Date().toISOString() } : c,
    );
    return simulateLatency(apiSuccess(withFaqCount(categories.find((c) => c.id === Number(id)))), 250);
  },
  deleteCategory(id) {
    categories = categories.filter((c) => c.id !== Number(id));
    faqs = faqs.filter((f) => f.categoryId !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
};

export const faqService = {
  /** GET /api/admin/faqs — AdminFaqListRequest */
  getFaqs(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const sorted = [...faqs].sort((a, b) => a.sortOrder - b.sortOrder);
    const result = queryRows(sorted, {
      search: params.search,
      searchFields: ["question", "answer"],
      filters: { categoryId: params.categoryId, isActive: params.isActive },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  getFaqById(id) {
    return simulateLatency(apiSuccess(faqs.find((f) => f.id === Number(id)) ?? null), 150);
  },
  /** POST /api/admin/faqs — AdminUpsertFaqRequest */
  createFaq(payload) {
    const category = categories.find((c) => c.id === payload.categoryId);
    const newFaq = {
      id: Math.max(0, ...faqs.map((f) => f.id)) + 1,
      isActive: true,
      sortOrder: faqs.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
      categoryName: category?.name ?? "",
    };
    faqs = [...faqs, newFaq];
    return simulateLatency(apiSuccess(newFaq), 250);
  },
  updateFaq(id, payload) {
    const category = categories.find((c) => c.id === payload.categoryId);
    faqs = faqs.map((f) =>
      f.id === Number(id)
        ? { ...f, ...payload, categoryName: category?.name ?? f.categoryName, updatedAt: new Date().toISOString() }
        : f,
    );
    return simulateLatency(apiSuccess(faqs.find((f) => f.id === Number(id))), 250);
  },
  deleteFaq(id) {
    faqs = faqs.filter((f) => f.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
  /** PATCH /api/admin/faqs/{id}/status */
  updateStatus(id, { isActive }) {
    faqs = faqs.map((f) => (f.id === Number(id) ? { ...f, isActive } : f));
    return simulateLatency(apiSuccess(null), 200);
  },
  /** PUT /api/admin/faqs/order — AdminReorderFaqsRequest (replace-all sort orders) */
  reorder(items) {
    const orderMap = new Map(items.map((i) => [i.id, i.sortOrder]));
    faqs = faqs.map((f) => (orderMap.has(f.id) ? { ...f, sortOrder: orderMap.get(f.id) } : f));
    return simulateLatency(apiSuccess(null), 250);
  },
};
