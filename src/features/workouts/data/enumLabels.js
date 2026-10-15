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

// Users can only pick these three goals. The other FitnessGoal values stay in
// the enum for old records; the API treats them as BuildMuscle (Kas Geliştirme)
// and a data migration moves current goals over, so they show as "eski" here.
export const PRIMARY_FITNESS_GOALS = ["BuildMuscle", "GetStronger", "LoseWeight"];

export const FITNESS_GOAL_LABELS_TR = {
  LoseWeight: "Yağ Kaybı",
  BuildMuscle: "Kas Geliştirme",
  GetStronger: "Güçlenme",
  MaintainWeight: "Kiloyu Korumak (eski)",
  ImproveEndurance: "Dayanıklılık (eski)",
  ImproveFitness: "Genel Fitness (eski)",
};

export function isLegacyFitnessGoal(value) {
  return value != null && !PRIMARY_FITNESS_GOALS.includes(value);
}

export function fitnessGoalLabel(value) {
  return FITNESS_GOAL_LABELS_TR[value] ?? value;
}

// Plan generation scores goal fit from these three only (weights per goal:
// Kas Geliştirme 65/25/10, Güçlenme 25/65/10, Yağ Kaybı 45/25/30). The rest
// are secondary catalog info and do not affect generated plans.
export const PRIMARY_WORKOUT_ATTRIBUTES = ["Hypertrophy", "Strength", "Cardio"];

export const WORKOUT_ATTRIBUTE_LABELS_TR = {
  Hypertrophy: "Kas Gelişimi (Hipertrofi)",
  Strength: "Kuvvet",
  Cardio: "Kardiyo",
  Endurance: "Dayanıklılık",
  Mobility: "Mobilite",
  CoreStability: "Core Stabilitesi",
};

export function workoutAttributeLabel(value) {
  return WORKOUT_ATTRIBUTE_LABELS_TR[value] ?? value;
}
