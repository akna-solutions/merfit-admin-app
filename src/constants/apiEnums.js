// Mirrors MBFitApi.Domain.Entities.Enums (see MBFitApi repo, Domain/Enums/*.cs).
// IMPORTANT: MBFitApi.Api/Program.cs does not register a JsonStringEnumConverter,
// so ASP.NET Core's default System.Text.Json behavior applies: enums serialize as
// their underlying INTEGER value, not their name. The arrays below are ordered to
// match each C# enum's declaration order exactly, so `label[apiValue]` round-trips
// correctly once these screens talk to the real API. Mock data in this app stores
// the human-readable label directly; services convert at the boundary.

export const GENDER = ["Male", "Female", "Other"];

export const FITNESS_GOAL = [
  "LoseWeight",
  "BuildMuscle",
  "MaintainWeight",
  "ImproveEndurance",
  "GetStronger",
  "ImproveFitness",
];

export const EXPERIENCE_LEVEL = ["Beginner", "Intermediate", "Advanced"];

export const ACTIVITY_LEVEL = [
  "Sedentary",
  "LightlyActive",
  "ModeratelyActive",
  "VeryActive",
  "ExtraActive",
];

export const TRAINING_LOCATION = ["Home", "Gym", "Outdoor"];

export const UNIT_SYSTEM = ["Metric", "Imperial"];

export const THEME = ["Light", "Dark", "System"];

export const PLATFORM = ["IOS", "Android", "Web"];

export const USER_ROLE = ["User", "Admin", "SuperAdmin"];

// DifficultyLevel *is* returned as a plain string by the API's list/detail DTOs
// (AdminWorkoutListItemDto.Difficulty, AdminExerciseListItemDto.Difficulty are
// typed `string`, converted server-side) — included here only for the request
// side, where AdminWorkoutListRequest.Difficulty is the raw enum (int) again.
export const DIFFICULTY_LEVEL = ["Beginner", "Intermediate", "Advanced"];

export function enumLabel(map, value) {
  if (value === null || value === undefined) return undefined;
  return map[value];
}

export function enumIndex(map, label) {
  return map.indexOf(label);
}
