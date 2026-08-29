// Mock implementation of AdminContentController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminContentController.cs).
import { contentMockData } from "../data/contentMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let content = [...contentMockData];

function isCurrentlyLive(isActive, startAt, endAt) {
  if (!isActive) return false;
  const now = Date.now();
  if (startAt && new Date(startAt).getTime() > now) return false;
  if (endAt && new Date(endAt).getTime() < now) return false;
  return true;
}

export const contentService = {
  /** GET /api/admin/content — AdminContentListRequest */
  getContent(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(content, {
      search: params.search,
      searchFields: ["title", "key", "description"],
      filters: { type: params.type, isActive: params.isActive },
      dateRange: params.dateRange,
      dateField: "createdAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  getContentById(id) {
    return simulateLatency(apiSuccess(content.find((c) => c.id === Number(id)) ?? null), 150);
  },

  /** POST /api/admin/content — AdminUpsertContentRequest */
  createContent(payload) {
    const newItem = {
      id: Math.max(0, ...content.map((c) => c.id)) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    newItem.isCurrentlyLive = isCurrentlyLive(newItem.isActive, newItem.startAt, newItem.endAt);
    content = [newItem, ...content];
    return simulateLatency(apiSuccess(newItem), 250);
  },

  /** PUT /api/admin/content/{id} */
  updateContent(id, payload) {
    content = content.map((c) => {
      if (c.id !== Number(id)) return c;
      const updated = { ...c, ...payload, updatedAt: new Date().toISOString() };
      updated.isCurrentlyLive = isCurrentlyLive(updated.isActive, updated.startAt, updated.endAt);
      return updated;
    });
    return simulateLatency(apiSuccess(content.find((c) => c.id === Number(id))), 250);
  },

  /** DELETE /api/admin/content/{id} */
  deleteContent(id) {
    content = content.filter((c) => c.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** PATCH /api/admin/content/{id}/status */
  updateStatus(id, { isActive }) {
    content = content.map((c) => {
      if (c.id !== Number(id)) return c;
      const updated = { ...c, isActive };
      updated.isCurrentlyLive = isCurrentlyLive(updated.isActive, updated.startAt, updated.endAt);
      return updated;
    });
    return simulateLatency(apiSuccess(null), 200);
  },

  /** POST /api/admin/content/{id}/publish */
  publish(id) {
    content = content.map((c) => {
      if (c.id !== Number(id)) return c;
      const updated = { ...c, isActive: true, startAt: c.startAt ?? new Date().toISOString() };
      updated.isCurrentlyLive = isCurrentlyLive(updated.isActive, updated.startAt, updated.endAt);
      return updated;
    });
    return simulateLatency(apiSuccess(content.find((c) => c.id === Number(id))), 250);
  },
};
