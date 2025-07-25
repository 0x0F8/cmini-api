import { SearchApiArgs } from "@frontend/feature/search/types";
import { stringifyQuery } from "@util/url";
import { SearchApiResult } from "app/api/search/route";
import useSWR from "swr";
import fetcher from "../api/fetcher";

export default function useSearchApi(args: SearchApiArgs | undefined) {
  let path: string | null = null;
  if (typeof args !== "undefined") {
    const query = stringifyQuery(args);
    path = `/api/search?${query}`;
  }

  const { data, error, isLoading } = useSWR<SearchApiResult>(path, fetcher);
  return { search: data, error, isLoading };
}
