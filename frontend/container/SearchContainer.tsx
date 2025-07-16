"use client";

import SearchForm from "@frontend/feature/search/SearchForm";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { SearchApiArgs, SearchConstraints } from "../feature/search/types";
import KeySearchForm from "../feature/search/KeySearchForm";
import useKeySearchState from "@frontend/hooks/useKeySearchState";
import useAppState from "@frontend/hooks/useAppState";
import transformSearchFormToApiArgs from "../feature/search/transformSearchFormToApiArgs";
import useSearchState from "@frontend/hooks/useSearchState";
import ScrolledSearchResults from "../feature/search/ScrolledSearchResults";
import { SearchDefaultResult } from "@frontend/hooks/useSearchDefaults";
import useSetQueryParams from "@frontend/hooks/useSetQueryParams";
import BackToTop from "@/frontend/components/BackToTop";
import useGlobalStateSync from "../hooks/useGlobalStateSync";

type State = {
  query: SearchApiArgs | undefined;
  canSubmit: boolean;
  didSubmit: boolean;
};

export default function SearchContainer({
  searchDefaultResult,
}: {
  searchDefaultResult: SearchDefaultResult;
}) {
  useGlobalStateSync();
  const {
    valid: isKeySearchFormValid,
    dirty: isKeySearchFormDirty,
    empty: isKeySearchFormEmpty,
    output: keySearchOutput,
  } = useKeySearchState();
  const {
    constraints,
    valid: isSearchFormValid,
    dirty: isSearchFormDirty,
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
  const setQuery = useSetQueryParams(false);

  const { query, didSubmit, canSubmit } = state;

  useEffect(() => {
    setState((state) => ({
      ...state,
      canSubmit:
        isKeySearchFormValid &&
        isSearchFormValid &&
        (isSearchFormDirty || isKeySearchFormDirty) &&
        (!isKeySearchFormEmpty || !isSearchFormEmpty),
    }));
  }, [
    isKeySearchFormValid,
    isSearchFormValid,
    isKeySearchFormEmpty,
    isSearchFormEmpty,
    isKeySearchFormDirty,
    isSearchFormDirty,
  ]);

  useEffect(() => {
    setState((state) => ({ ...state, didSubmit: false }));
  }, [key, keySearchOutput, corpora]);

  useEffect(() => {
    onSubmit(true);
  }, [searchState.sort, searchState.sortBy]);

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
        constraints,
      ),
    }));

    setQuery({ ...searchState, corpora, keyQuery: keySearchOutput });
  };

  return (
    <Stack>
      <BackToTop />
      <Stack mb={8}>
        <SearchForm
          mb={4}
          constraints={constraints}
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
