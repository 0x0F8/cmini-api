import { AutocompleteApiArgs } from "@frontend/feature/search/types";
import { stringifyQuery } from "@util/url";
import { AutoCompleteApiResult } from "app/api/search/autocomplete/route";
import useSWR from "swr";

const fetcher = (args) => fetch(args).then((res) => res.json());

export default function useLayoutAutocompleteApi(
  args: AutocompleteApiArgs | undefined,
) {
  let path: string | null = null;
  if (typeof args !== "undefined" && args.query.length > 0) {
    const query = stringifyQuery(args);
    path = `/api/search/autocomplete?${query}`;
  }

  const { data, error, isLoading } = useSWR<AutoCompleteApiResult>(
    path,
    fetcher,
  );
  return { search: data, error, isLoading };
}
