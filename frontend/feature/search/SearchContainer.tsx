"use client";

import LayoutTable from "@frontend/components/LayoutTable";
import SearchForm from "@frontend/feature/search/SearchForm";
import useSearch from "@frontend/hooks/useSearch";
import { Stack } from "@mui/material";
import { SearchApiResult } from "app/api/search/route";
import { useCallback, useEffect, useState } from "react";
import { SearchApiArgs, SearchConstraints, SearchFormState } from "./types";
import KeySearchForm from "./KeySearchForm";
import useKeySearchState from "@frontend/hooks/useKeySearchState";
import useAppState from "@frontend/hooks/useAppState";
import transformSearchFormToApiArgs from "./transformSearchFormToApiArgs";

type State = {
  query: SearchApiArgs | undefined;
  results: SearchApiResult["data"] | undefined;
};

export default function SearchContainer({
  searchFormDefaultState,
  searchDefaultResult,
  searchFormConstraints,
}: {
  searchFormDefaultState: SearchFormState;
  searchFormConstraints: SearchConstraints;
  searchDefaultResult: SearchApiResult["data"] | undefined;
}) {
  const { valid, query: keyQuery } = useKeySearchState();
  const { corpora } = useAppState();
  const [state, setState] = useState<State>({
    query: undefined,
    results: searchDefaultResult,
  });
  const { query, results } = state;
  const { search, isLoading, error } = useSearch(query);

  const onSubmit = useCallback(
    (args: SearchFormState) =>
      setState((state) => ({
        ...state,
        query: transformSearchFormToApiArgs({ ...args, corpora, keyQuery }),
      })),
    [corpora, keyQuery],
  );

  useEffect(() => {
    if (!!search && !error) {
      setState((state) => ({ ...state, results: search.data }));
    }
  }, [search, error]);

  return (
    <Stack>
      <SearchForm
        onSubmit={onSubmit}
        defaultState={searchFormDefaultState}
        constraints={searchFormConstraints}
        keySearchForm={<KeySearchForm />}
        isValid={valid}
      />
      {results && <LayoutTable data={results} />}
    </Stack>
  );
}
