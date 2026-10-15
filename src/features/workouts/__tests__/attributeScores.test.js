import { missingPrimaryAttributes } from "../data/attributeScoreRules";
import { fitnessGoalLabel, isLegacyFitnessGoal, PRIMARY_FITNESS_GOALS } from "../data/enumLabels";

const empty = {
  Hypertrophy: null, Strength: null, Cardio: null, Endurance: null, Mobility: null, CoreStability: null,
};

describe("attribute score rules", () => {
  it("allows clearing every score", () => {
    expect(missingPrimaryAttributes(empty)).toEqual([]);
  });

  it("requires all three main scores once any score is entered", () => {
    expect(missingPrimaryAttributes({ ...empty, Hypertrophy: 90, Mobility: 40 })).toEqual(["Strength", "Cardio"]);
    expect(missingPrimaryAttributes({ ...empty, Endurance: 50 })).toEqual(["Hypertrophy", "Strength", "Cardio"]);
  });

  it("accepts the three main scores without secondary ones", () => {
    expect(missingPrimaryAttributes({ ...empty, Hypertrophy: 80, Strength: 60, Cardio: 0 })).toEqual([]);
  });
});

describe("goal labels", () => {
  it("offers only the three goals", () => {
    expect(PRIMARY_FITNESS_GOALS.map(fitnessGoalLabel)).toEqual(["Kas Geliştirme", "Güçlenme", "Yağ Kaybı"]);
  });

  it("marks legacy goals", () => {
    expect(isLegacyFitnessGoal("MaintainWeight")).toBe(true);
    expect(isLegacyFitnessGoal("LoseWeight")).toBe(false);
    expect(fitnessGoalLabel("ImproveEndurance")).toMatch(/eski/);
  });
});
