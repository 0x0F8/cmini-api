"use client";

import LayoutTable from "@frontend/components/LayoutTable";
import SearchForm from "@frontend/feature/search/SearchForm";
import { Button, Stack, Typography } from "@mui/material";
import { SearchApiResult } from "app/api/search/route";
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
    empty: isSearchFormEmpty,
    ...searchState
  } = useSearchState();
  const { corpora } = useAppState();
  const [state, setState] = useState<State>({
    query: searchDefaultResult.defaultArgs,
    didSubmit: false,
  });

  const { query, didSubmit } = state;
  const canSubmitForm =
    !didSubmit &&
    isKeySearchFormValid &&
    isSearchFormValid &&
    (!isKeySearchFormEmpty || !isSearchFormEmpty);

  const onSubmit = () => {
    if (!canSubmitForm) {
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
    setState((state) => ({ ...state, didSubmit: false }));
  }, [searchState.board, searchState.query, searchState.sfb, keySearchOutput]);

  return (
    <Stack>
      <SearchForm
        constraints={searchFormConstraints}
        keySearchForm={<KeySearchForm />}
      />
      <Button
        onClick={() => onSubmit()}
        variant="contained"
        disabled={!canSubmitForm}
      >
        Submit
      </Button>
      <ScrolledSearchResults args={query} />
    </Stack>
  );
}
