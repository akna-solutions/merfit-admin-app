import { checkRows, dayDistribution, dayRows, metricRows, muscleGroupRows, profileDiff } from "../utils/comparison";

const result = (overrides = {}) => ({
  days: [
    { dayOfWeek: "Mon", workout: { id: 1 }, cardio: null },
    { dayOfWeek: "Thu", workout: { id: 2 }, cardio: { id: 9 } },
  ],
  cardioDays: 1,
  restSecondsRule: 90,
  poolStage: "Primary",
  metrics: {
    totalExercises: 10, uniqueExercises: 9, totalSets: 30, averageDurationMin: 45, usedEquipmentCount: 2,
    muscleGroups: [{ name: "Göğüs", exerciseCount: 4, sets: 12, dayCount: 1 }],
    repsRanges: [{ label: "8-12", exerciseCount: 10 }],
  },
  ...overrides,
});

describe("comparison", () => {
  it("gün dağılımını 7 güne yayar", () => {
    const d = dayDistribution(result());
    expect(d).toHaveLength(7);
    expect(d.filter((x) => x.active).map((x) => x.code)).toEqual(["Mon", "Thu"]);
  });

  it("farklı metrikleri işaretler", () => {
    const rows = metricRows(result(), result({ cardioDays: 3, poolStage: "AdjacentDifficulty" }));
    const changed = rows.filter((r) => r.changed).map((r) => r.key);
    expect(changed).toEqual(["cardio", "pool"]);
    expect(rows.find((r) => r.key === "setsPerExercise").l).toBe(3);
  });

  it("aynı gündeki antrenman değişikliğini bulur", () => {
    const right = result({ days: [{ dayOfWeek: "Mon", workout: { id: 1 } }, { dayOfWeek: "Fri", workout: { id: 3 } }] });
    const rows = dayRows(result(), right);
    expect(rows.map((r) => [r.code, r.changed])).toEqual([["Mon", false], ["Thu", true], ["Fri", true]]);
  });

  it("kas gruplarını birleştirir", () => {
    const right = result({ metrics: { ...result().metrics, muscleGroups: [{ name: "Sırt", exerciseCount: 2, sets: 6, dayCount: 1 }] } });
    const rows = muscleGroupRows(result(), right);
    expect(rows.map((r) => r.name)).toEqual(["Göğüs", "Sırt"]);
    expect(rows[0].right).toBeNull();
  });

  it("kontrolleri koda göre eşler", () => {
    const rows = checkRows(
      [{ code: "A", title: "A", status: "Passed" }, { code: "B", title: "B", status: "Warning" }],
      [{ code: "A", title: "A", status: "Failed" }, { code: "B", title: "B", status: "Warning" }],
    );
    expect(rows.map((r) => r.changed)).toEqual([true, false]);
  });

  it("profil farklarını listeler", () => {
    expect(profileDiff({ goal: "BuildMuscle", trainingDays: [] }, { goal: "BuildMuscle", trainingDays: [] })).toEqual([]);
    expect(profileDiff({ goal: "BuildMuscle", isPlus: false }, { goal: "LoseWeight", isPlus: false })).toEqual(["goal"]);
  });
});
