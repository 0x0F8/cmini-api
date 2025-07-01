import { SearchApiArgs, SearchFormState } from "./types";

export default function transformSearchFormToApiArgs({ query, board, sfb }: SearchFormState): SearchApiArgs {
    return {
        corpora: 'monkeyracer',
        query: query || undefined,
        board: board === -1 ? undefined : board,
        minSfb: sfb[0],
        maxSfb: sfb[1],
    }
}