import { CminiBoardType } from "@backend/cmini/types";
import { SearchConstraints, SearchStateValues } from "./types";

export default function calculateSearchFormEmptiness(
  state: SearchStateValues,
  constraints?: SearchConstraints,
) {
  const isQueryEmpty = state.query.length === 0;
  const isBoardEmpty =
    state.board === CminiBoardType.None || state.board === undefined;
  const isSfbEmpty =
    state.sfb.length === 0 ||
    !!(
      constraints &&
      state.sfb[0] === constraints.sfb[0] &&
      state.sfb[1] === constraints.sfb[1]
    );
  return isQueryEmpty && isBoardEmpty && isSfbEmpty;
}
