import dayjs from "dayjs";
import { buildReorder, httpUrlRule, toFormValues, toPayload } from "../utils/campaignForm";
import { campaignService } from "../services/campaignService";
import { apiClient } from "../../../utils/apiClient";

jest.mock("../../../utils/apiClient", () => ({
  apiClient: {
    get: jest.fn(() => Promise.resolve({ data: { items: [], totalCount: 0 } })),
    put: jest.fn(() => Promise.resolve({ isSuccess: true })),
  },
  buildQuery: (params) =>
    "?" + Object.entries(params).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}=${v}`).join("&"),
}));

describe("campaign form", () => {
  it("trims values and turns blanks into null", () => {
    const payload = toPayload({
      title: "  Yaz  ",
      summary: "  ",
      body: "Detay",
      imageUrl: "",
      linkUrl: undefined,
      category: " Üyelik ",
      sortOrder: "3",
      isActive: true,
    });
    expect(payload).toEqual({
      title: "Yaz",
      summary: null,
      body: "Detay",
      imageUrl: null,
      linkUrl: null,
      category: "Üyelik",
      sortOrder: 3,
      isActive: true,
      startAt: null,
      endAt: null,
    });
  });

  it("sends the whole last day of the publishing range", () => {
    const start = dayjs("2026-11-01T15:00:00");
    const end = dayjs("2026-11-10T08:00:00");
    const payload = toPayload({ title: "Yaz", isActive: true, dateRange: [start, end] });
    expect(payload.startAt).toBe(start.startOf("day").toISOString());
    expect(payload.endAt).toBe(end.endOf("day").toISOString());
  });

  it("maps an API item back to form values", () => {
    const values = toFormValues({ title: "A", summary: null, sortOrder: 5, isActive: false, startAt: "2026-11-01T00:00:00Z", endAt: null });
    expect(values.title).toBe("A");
    expect(values.summary).toBeUndefined();
    expect(values.sortOrder).toBe(5);
    expect(values.dateRange[0].isValid()).toBe(true);
    expect(values.dateRange[1]).toBeNull();
    expect(toFormValues(null)).toEqual({ isActive: true, sortOrder: 0 });
  });

  it("accepts only http(s) urls", async () => {
    const rule = httpUrlRule("hata");
    await expect(rule.validator(null, "")).resolves.toBeUndefined();
    await expect(rule.validator(null, "https://cdn.example.com/a.jpg")).resolves.toBeUndefined();
    await expect(rule.validator(null, "data:text/html,x")).rejects.toThrow("hata");
    await expect(rule.validator(null, "/a.jpg")).rejects.toThrow("hata");
  });
});

describe("campaign reorder", () => {
  const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it("swaps neighbours and renumbers the list", () => {
    expect(buildReorder(rows, 2, -1)).toEqual([
      { id: 1, sortOrder: 0 },
      { id: 3, sortOrder: 10 },
      { id: 2, sortOrder: 20 },
    ]);
  });

  it("refuses moves past the edges", () => {
    expect(buildReorder(rows, 0, -1)).toBeNull();
    expect(buildReorder(rows, 2, 1)).toBeNull();
  });

  it("calls the admin endpoints", async () => {
    await campaignService.getCampaigns({ status: "Live" });
    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/campaigns?page=1&pageSize=50&status=Live");
    await campaignService.reorder([{ id: 1, sortOrder: 0 }]);
    expect(apiClient.put).toHaveBeenCalledWith("/api/admin/campaigns/order", { items: [{ id: 1, sortOrder: 0 }] });
  });
});
