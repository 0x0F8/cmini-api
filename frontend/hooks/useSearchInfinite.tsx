import { SearchApiArgs } from "@frontend/feature/search/types";
import { stringifyQuery } from "@util/url";
import { SearchApiResult } from "app/api/search/route";
import useSWRInfinite from "swr/infinite";
import { PaginatedApiArgs } from "types";

const fetcher = (args) => fetch(args).then((res) => res.json());

export default function useSearchInfinite(
  args: SearchApiArgs | undefined,
  meta: PaginatedApiArgs,
) {
  let path: string | null = null;
  if (typeof args !== "undefined") {
    const query = stringifyQuery(args);
    path = `/api/search?${query}&limit=${meta.limit}`;
  }

  const result = useSWRInfinite<SearchApiResult>(
    (index) => (path ? `${path}&page=${index + 1}` : null),
    fetcher,
  );
  return result;
}
