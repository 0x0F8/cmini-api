import { SearchApiArgs, SearchFormState } from "./types";

export default function transformSearchFormToApiArgs({
  corpora = "monkeyracer",
  query,
  board,
  sfb,
  keyQuery,
}: SearchFormState & { keyQuery: string; corpora: string }): SearchApiArgs {
  return {
    corpora,
    query: query || undefined,
    board: board === -1 ? undefined : board,
    minSfb: sfb[0],
    maxSfb: sfb[1],
    keyQuery,
  };
}
