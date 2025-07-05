import { KeySearchHandConstraint, KeySearchStateValues } from "./types";

export default function calculateKeySearchFormEmptiness(
  state: KeySearchStateValues,
) {
  for (const currentHand of [
    KeySearchHandConstraint.Either,
    KeySearchHandConstraint.Left,
    KeySearchHandConstraint.Right,
  ]) {
    const handRef = state[currentHand];
    for (const groupRef of handRef) {
      if (groupRef.values.length > 0) {
        return false;
      }
    }
  }
  return true;
}
