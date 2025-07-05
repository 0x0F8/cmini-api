"use client";

import React, { ReactNode, useCallback } from "react";
import { createContext, useState } from "react";
import { CminiBoardType } from "@backend/cmini/types";
import Cookies from "@frontend/Cookies";
import { produce, WritableDraft } from "immer";
import calculateSearchFormEmptiness from "@frontend/feature/search/calculateSearchFormEmptiness";
import { SearchState, SearchStateValues } from "@frontend/feature/search/types";

type SetSearchState = {
  setBoard: (value: CminiBoardType) => void;
  setSfb: (value: number[]) => void;
  setQuery: (value: string) => void;
};

const defaultState: SearchState = {
  query: "",
  board: undefined,
  sfb: [],
  valid: true,
  empty: true,
};
const defaultSetState: SetSearchState = {
  setBoard: () => {},
  setSfb: () => {},
  setQuery: () => {},
};

export const SearchContext = createContext<SearchState & SetSearchState>({
  ...defaultState,
  ...defaultSetState,
});

const calculateFormValidity = (state: SearchStateValues) => {
  return true;
};

const SearchStateProvider = ({
  injectedState = {},
  children,
}: {
  injectedState?: Partial<SearchState>;
  children: ReactNode;
}) => {
  const [searchState, setSearchState] = useState({
    ...defaultState,
    ...injectedState,
  });
  const setSearchStateImmutable = (
    callback: (draft: WritableDraft<SearchState>) => void,
  ) => setSearchState(produce(callback));

  const setQuery = useCallback((value: string) => {
    setSearchStateImmutable((draft) => {
      draft.query = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
    });
  }, []);

  const setBoard = useCallback((value: CminiBoardType) => {
    setSearchStateImmutable((draft) => {
      draft.board = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      Cookies.set("search-board", value);
    });
  }, []);

  const setSfb = useCallback((value: number[]) => {
    setSearchStateImmutable((draft) => {
      draft.sfb = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      Cookies.set("search-sfb", value.join(","));
    });
  }, []);

  return (
    <SearchContext.Provider
      value={{
        ...searchState,
        setQuery,
        setBoard,
        setSfb,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default React.memo(SearchStateProvider);
