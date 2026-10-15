import { WORKOUT_ATTRIBUTE_TYPE } from "../../../constants/apiEnums";
import { PRIMARY_WORKOUT_ATTRIBUTES } from "./enumLabels";

// Plan generation uses Hypertrophy, Strength and Cardio only, and counts a
// missing one as 0, so the API rejects a save that scores some of them but
// not all three. An all-empty save is allowed and clears the scores.
export function missingPrimaryAttributes(values) {
  const anyScored = WORKOUT_ATTRIBUTE_TYPE.some((t) => values[t] !== null);
  if (!anyScored) return [];
  return PRIMARY_WORKOUT_ATTRIBUTES.filter((t) => values[t] === null);
}
