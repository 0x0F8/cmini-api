import { CminiBoardType } from "@backend/cmini/types";
import { SearchConstraints, SearchStateValues } from "./types";
import { Toggle } from "@/types";

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
      state.sfb[0] === constraints.sfb.min &&
      state.sfb[1] === constraints.sfb.max
    );
  const isSfsEmpty =
    state.sfs.length === 0 ||
    !!(
      constraints &&
      state.sfs[0] === constraints.sfs.min &&
      state.sfs[1] === constraints.sfs.max
    );
  const isFsbEmpty =
    state.fsb.length === 0 ||
    !!(
      constraints &&
      state.fsb[0] === constraints.fsb.min &&
      state.fsb[1] === constraints.fsb.max
    );
  const isRedirectEmpty =
    state.redirect.length === 0 ||
    !!(
      constraints &&
      state.redirect[0] === constraints.redirect.min &&
      state.redirect[1] === constraints.redirect.max
    );
  const isPinkyOffEmpty =
    state.pinkyOff.length === 0 ||
    !!(
      constraints &&
      state.pinkyOff[0] === constraints.pinkyOff.min &&
      state.pinkyOff[1] === constraints.pinkyOff.max
    );
  const isAlternateEmpty =
    state.alternate.length === 0 ||
    !!(
      constraints &&
      state.alternate[0] === constraints.alternate.min &&
      state.alternate[1] === constraints.alternate.max
    );
  const isRollEmpty =
    state.roll.length === 0 ||
    !!(
      constraints &&
      state.roll[0] === constraints.roll.min &&
      state.roll[1] === constraints.roll.max
    );
  const isRollRatioEmpty =
    state.rollRatio.length === 0 ||
    !!(
      constraints &&
      state.rollRatio[0] === constraints.rollRatio.min &&
      state.rollRatio[1] === constraints.rollRatio.max
    );
  const isThumbsOnlyEmpty = state.thumbsOnly === Toggle.None;
  return (
    isQueryEmpty &&
    isBoardEmpty &&
    isSfbEmpty &&
    isSfsEmpty &&
    isFsbEmpty &&
    isRedirectEmpty &&
    isPinkyOffEmpty &&
    isRollEmpty &&
    isAlternateEmpty &&
    isRollRatioEmpty &&
    isThumbsOnlyEmpty
  );
}
