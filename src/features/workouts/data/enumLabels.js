// Display-only Turkish labels for enum codes shared with
// src/constants/apiEnums.js. The English codes themselves are the values
// actually stored/sent/compared throughout the app (see DIFFICULTY_LEVEL,
// FITNESS_GOAL) — only the label shown to the admin is localized here.

export const DIFFICULTY_LABELS_TR = {
  Beginner: "Başlangıç",
  Intermediate: "Orta",
  Advanced: "İleri",
};

export function difficultyLabel(value) {
  return DIFFICULTY_LABELS_TR[value] ?? value;
}

export const FITNESS_GOAL_LABELS_TR = {
  LoseWeight: "Kilo Vermek",
  BuildMuscle: "Kas Kazanmak",
  MaintainWeight: "Kiloyu Korumak",
  ImproveEndurance: "Dayanıklılığı Artırmak",
  GetStronger: "Güçlenmek",
  ImproveFitness: "Fitness Seviyesini Artırmak",
};

export function fitnessGoalLabel(value) {
  return FITNESS_GOAL_LABELS_TR[value] ?? value;
}
