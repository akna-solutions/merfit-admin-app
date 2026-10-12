import {
  daysToMask, maskToDays, describeMask, screenToDataJson, dataJsonToScreen, disallowedPlaceholders, parseUserIds, monthLabel,
} from "../utils/notificationForm";

describe("notificationForm helpers", () => {
  it("converts selected weekdays to the API bit mask (Sunday = bit 0) and back", () => {
    expect(daysToMask([0, 1, 2, 3, 4, 5, 6])).toBe(127);
    expect(daysToMask([1, 2, 3, 4, 5])).toBe(62);
    expect(maskToDays(65).sort()).toEqual([0, 6]);
    expect(describeMask(62)).toBe("Hafta içi");
    expect(describeMask(2 | 8)).toBe("Pzt, Çar");
  });

  it("builds and reads navigation data", () => {
    expect(screenToDataJson("nutrition")).toBe('{"screen":"nutrition"}');
    expect(screenToDataJson(undefined)).toBeNull();
    expect(dataJsonToScreen('{"screen":"leaderboard"}')).toBe("leaderboard");
    expect(dataJsonToScreen("not json")).toBeUndefined();
  });

  it("finds placeholders that are not allowed for the type", () => {
    expect(disallowedPlaceholders(["Merhaba {firstName}", "{mealName} ve {rank}"], ["firstName", "mealName"])).toEqual(["rank"]);
    expect(disallowedPlaceholders(["Sabit metin"], [])).toEqual([]);
  });

  it("parses pasted user id lists into unique positive integers", () => {
    expect(parseUserIds(["12, 15", "15", "abc", "-3", "18;20"])).toEqual([12, 15, 18, 20]);
  });

  it("formats Turkish month labels", () => {
    expect(monthLabel("2026-10-16T00:00:00Z")).toBe("Ekim 2026");
  });
});
