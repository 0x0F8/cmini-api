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
    keyQuery,
    thumbsOnly,
  }: SearchStateValues & { keyQuery?: string; corpora?: string },
  constraints: SearchConstraints,
): SearchApiArgs {
  return {
    corpora,
    query: query || undefined,
    board: board === -1 ? undefined : board,
    minSfb: sfb[0] === constraints.sfb[0] ? undefined : sfb[0],
    maxSfb: sfb[1] === constraints.sfb[1] ? undefined : sfb[1],
    minSfs: sfs[0] === constraints.sfs[0] ? undefined : sfs[0],
    maxSfs: sfs[1] === constraints.sfs[1] ? undefined : sfs[1],
    sort,
    sortBy,
    keyQuery,
    hasThumb: thumbsOnly ? true : undefined,
  };
}
