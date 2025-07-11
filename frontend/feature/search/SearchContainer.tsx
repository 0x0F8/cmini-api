"use client";

import SearchForm from "@frontend/feature/search/SearchForm";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { SearchApiArgs, SearchConstraints } from "./types";
import KeySearchForm from "./KeySearchForm";
import useKeySearchState from "@frontend/hooks/useKeySearchState";
import useAppState from "@frontend/hooks/useAppState";
import transformSearchFormToApiArgs from "./transformSearchFormToApiArgs";
import useSearchState from "@frontend/hooks/useSearchState";
import ScrolledSearchResults from "./ScrolledSearchResults";
import { SearchDefaultResult } from "@frontend/hooks/useSearchDefaults";

type State = {
  query: SearchApiArgs | undefined;
  canSubmit: boolean;
  didSubmit: boolean;
};

export default function SearchContainer({
  searchFormConstraints,
  searchDefaultResult,
}: {
  searchFormConstraints: SearchConstraints;
  searchDefaultResult: SearchDefaultResult;
}) {
  const {
    valid: isKeySearchFormValid,
    empty: isKeySearchFormEmpty,
    output: keySearchOutput,
  } = useKeySearchState();
  const {
    valid: isSearchFormValid,
    key,
    empty: isSearchFormEmpty,
    ...searchState
  } = useSearchState();
  const { corpora } = useAppState();
  const [state, setState] = useState<State>({
    query: searchDefaultResult.defaultArgs,
    canSubmit: false,
    didSubmit: false,
  });

  const { query, didSubmit, canSubmit } = state;

  const onSubmit = (ignoreDidSubmit = false) => {
    if (!canSubmit || (!ignoreDidSubmit && didSubmit)) {
      return;
    }
    setState((state) => ({
      ...state,
      didSubmit: true,
      query: transformSearchFormToApiArgs(
        {
          ...searchState,
          corpora,
          keyQuery: keySearchOutput,
        },
        searchFormConstraints,
      ),
    }));
  };

  useEffect(() => {
    setState((state) => ({
      ...state,
      canSubmit:
        isKeySearchFormValid &&
        isSearchFormValid &&
        (!isKeySearchFormEmpty || !isSearchFormEmpty),
    }));
  }, [
    isKeySearchFormValid,
    isSearchFormValid,
    isKeySearchFormEmpty,
    isSearchFormEmpty,
  ]);

  useEffect(() => {
    onSubmit(true);
  }, [searchState.sort, searchState.sortBy]);

  useEffect(() => {
    setState((state) => ({ ...state, didSubmit: false }));
  }, [key, keySearchOutput]);

  return (
    <Stack>
      <Stack mb={8}>
        <SearchForm
          mb={4}
          constraints={searchFormConstraints}
          keySearchForm={<KeySearchForm />}
        />
        <Button
          onClick={() => onSubmit()}
          variant="contained"
          disabled={!canSubmit || didSubmit}
        >
          Submit
        </Button>
      </Stack>
      <ScrolledSearchResults args={query} />
    </Stack>
  );
}
