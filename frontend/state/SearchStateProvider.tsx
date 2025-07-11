"use client";

import React, { ReactNode, useCallback } from "react";
import { createContext, useState } from "react";
import { CminiBoardType } from "@backend/cmini/types";
import Cookies from "@frontend/Cookies";
import { produce, WritableDraft } from "immer";
import calculateSearchFormEmptiness from "@frontend/feature/search/calculateSearchFormEmptiness";
import {
  SearchSortField,
  SearchState,
  SearchStateValues,
} from "@frontend/feature/search/types";
import { SortOrder } from "types";

type SetSearchState = {
  setBoard: (value: CminiBoardType) => void;
  setSfb: (value: number[]) => void;
  setSfs: (value: number[]) => void;
  setQuery: (value: string) => void;
  setThumbsOnly: (value: boolean) => void;
  setSort: (
    sort: SortOrder | undefined,
    sortBy: SearchSortField | undefined,
  ) => void;
};

const defaultState: SearchState = {
  sort: SortOrder.Ascending,
  sortBy: SearchSortField.Sfb,
  query: "",
  board: undefined,
  sfb: [],
  sfs: [],
  thumbsOnly: undefined,
  valid: true,
  empty: true,
  key: "",
};
const defaultSetState: SetSearchState = {
  setBoard: () => {},
  setSfb: () => {},
  setSfs: () => {},
  setQuery: () => {},
  setThumbsOnly: () => {},
  setSort: () => {},
};

export const SearchContext = createContext<SearchState & SetSearchState>({
  ...defaultState,
  ...defaultSetState,
});

const calculateFormValidity = (state: SearchStateValues) => {
  return true;
};

const calculateFormKey = (state: SearchStateValues) => {
  return (
    state.board +
    state.query +
    state.sfb.join("") +
    state.sfs.join("") +
    state.sort +
    state.sortBy +
    state.thumbsOnly
  );
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

  const setCookie = (key: string, value: any) => {
    Cookies.set(`search-${key}`, value);
  };

  const setQuery = useCallback((value: string) => {
    setSearchStateImmutable((draft) => {
      draft.query = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
    });
  }, []);

  const setBoard = useCallback((value: CminiBoardType) => {
    setSearchStateImmutable((draft) => {
      draft.board = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
      setCookie("board", value);
    });
  }, []);

  const setSfb = useCallback((value: number[]) => {
    setSearchStateImmutable((draft) => {
      draft.sfb = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
      setCookie("sfb", value.join(","));
    });
  }, []);

  const setSfs = useCallback((value: number[]) => {
    setSearchStateImmutable((draft) => {
      draft.sfs = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
      setCookie("sfs", value.join(","));
    });
  }, []);

  const setThumbsOnly = useCallback((value: boolean) => {
    setSearchStateImmutable((draft) => {
      draft.thumbsOnly = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
    });
  }, []);

  const setSort = useCallback(
    (sort: SortOrder | undefined, sortBy: SearchSortField | undefined) => {
      setSearchStateImmutable((draft) => {
        draft.sort = sort;
        draft.sortBy = sortBy;
        draft.key = calculateFormKey(draft);
        setCookie("sort", sort);
        setCookie("sortBy", sortBy);
      });
    },
    [],
  );

  return (
    <SearchContext.Provider
      value={{
        ...searchState,
        setQuery,
        setBoard,
        setSfb,
        setSfs,
        setThumbsOnly,
        setSort,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default React.memo(SearchStateProvider);
