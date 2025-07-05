import { SearchApiArgs, SearchStateValues } from "./types";

export default function transformSearchFormToApiArgs({
  corpora = "monkeyracer",
  query,
  board,
  sfb,
  keyQuery,
}: SearchStateValues & { keyQuery?: string; corpora?: string }): SearchApiArgs {
  return {
    corpora,
    query: query || undefined,
    board: board === -1 ? undefined : board,
    minSfb: sfb[0],
    maxSfb: sfb[1],
    keyQuery,
  };
}
