import { Toggle } from "@/types";
import { SearchApiArgs, SearchConstraints, SearchStateValues } from "./types";

export default function transformSearchFormToApiArgs(
  {
    corpora = "monkeyracer",
    sort,
    sortBy,
    query,
    board,
    sfb,
    sfs,
    fsb,
    redirect,
    randomize,
    pinkyOff,
    alternate,
    roll,
    rollRatio,
    keyQuery,
    thumbsOnly,
  }: SearchStateValues & { keyQuery?: string; corpora?: string },
  constraints: SearchConstraints,
): SearchApiArgs {
  return {
    corpora,
    query: query || undefined,
    board: board === -1 ? undefined : board,
    minSfb: sfb[0] === constraints.sfb.min ? undefined : sfb[0],
    maxSfb: sfb[1] === constraints.sfb.max ? undefined : sfb[1],
    minSfs: sfs[0] === constraints.sfs.min ? undefined : sfs[0],
    maxSfs: sfs[1] === constraints.sfs.max ? undefined : sfs[1],
    minFsb: fsb[0] === constraints.fsb.min ? undefined : fsb[0],
    maxFsb: fsb[1] === constraints.fsb.max ? undefined : fsb[1],
    minRedirect:
      redirect[0] === constraints.redirect.min ? undefined : redirect[0],
    maxRedirect:
      redirect[1] === constraints.redirect.max ? undefined : redirect[1],
    minPinkyOff:
      pinkyOff[0] === constraints.pinkyOff.min ? undefined : pinkyOff[0],
    maxPinkyOff:
      pinkyOff[1] === constraints.pinkyOff.max ? undefined : pinkyOff[1],
    minAlternate:
      alternate[0] === constraints.alternate.min ? undefined : alternate[0],
    maxAlternate:
      alternate[1] === constraints.alternate.max ? undefined : alternate[1],
    minRoll: roll[0] === constraints.roll.min ? undefined : roll[0],
    maxRoll: roll[1] === constraints.roll.max ? undefined : roll[1],
    minRollRatio:
      rollRatio[0] === constraints.rollRatio.min ? undefined : rollRatio[0],
    maxRollRatio:
      rollRatio[1] === constraints.rollRatio.max ? undefined : rollRatio[1],
    sort,
    sortBy,
    keyQuery,
    hasThumb: thumbsOnly === Toggle.None ? undefined : Boolean(thumbsOnly),
    randomize: randomize || undefined,
  };
}
