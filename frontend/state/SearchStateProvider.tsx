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
import { randomString } from "@/util/random";

type SetSearchState = {
  setBoard: (value: CminiBoardType) => void;
  setSfb: (value: number[]) => void;
  setSfs: (value: number[]) => void;
  setFsb: (value: number[]) => void;
  setRedirect: (value: number[]) => void;
  setPinkyOff: (value: number[]) => void;
  setAlternate: (value: number[]) => void;
  setRoll: (value: number[]) => void;
  setRollRatio: (value: number[]) => void;
  setLeftHand: (value: number[]) => void;
  setRightHand: (value: number[]) => void;
  setQuery: (value: string) => void;
  setThumbsOnly: (value: boolean) => void;
  setRandomize: (value: boolean) => void;
  setSort: (
    sort: SortOrder | undefined,
    sortBy: SearchSortField | undefined,
  ) => void;
};

const defaultState: SearchState = {
  sort: SortOrder.Ascending,
  sortBy: SearchSortField.Sfb,
  randomize: "",
  query: "",
  board: undefined,
  sfb: [],
  sfs: [],
  fsb: [],
  redirect: [],
  pinkyOff: [],
  alternate: [],
  roll: [],
  rollRatio: [],
  handUse: [],
  thumbsOnly: undefined,
  valid: true,
  empty: true,
  dirty: false,
  key: "",
};
const defaultSetState: SetSearchState = {
  setBoard: () => {},
  setSfb: () => {},
  setSfs: () => {},
  setFsb: () => {},
  setRedirect: () => {},
  setPinkyOff: () => {},
  setAlternate: () => {},
  setRoll: () => {},
  setRollRatio: () => {},
  setLeftHand: () => {},
  setRightHand: () => {},
  setQuery: () => {},
  setThumbsOnly: () => {},
  setRandomize: () => {},
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
  const combinedState = {
    ...defaultState,
    ...injectedState,
  };
  const [searchState, setSearchState] = useState({
    ...combinedState,
    empty: calculateSearchFormEmptiness(combinedState),
  });
  const setSearchStateImmutable = (
    callback: (draft: WritableDraft<SearchState>) => void,
  ) => setSearchState(produce(callback));

  const setCookie = (key: string, value: any) => {
    Cookies.set(`search-${key}`, value);
  };
  const deleteCookie = (key: string) => {
    Cookies.remove(`search-${key}`);
  };

  const setQuery = useCallback((value: string) => {
    setSearchStateImmutable((draft) => {
      draft.query = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
      draft.dirty = true;
    });
  }, []);

  const setBoard = useCallback((value: CminiBoardType) => {
    setSearchStateImmutable((draft) => {
      draft.board = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
      draft.dirty = true;
      setCookie("board", value);
    });
  }, []);

  const setRange = useCallback(
    (key: string) => (value: number[]) => {
      setSearchStateImmutable((draft) => {
        draft[key] = value;
        draft.valid = calculateFormValidity(draft);
        draft.empty = calculateSearchFormEmptiness(draft);
        draft.key = calculateFormKey(draft);
        draft.dirty = true;
        setCookie(key, value.join(","));
      });
    },
    [],
  );

  const setSfb = useCallback(setRange("sfb"), []);
  const setSfs = useCallback(setRange("sfs"), []);
  const setFsb = useCallback(setRange("fsb"), []);
  const setRedirect = useCallback(setRange("redirect"), []);
  const setPinkyOff = useCallback(setRange("pinkyOff"), []);
  const setAlternate = useCallback(setRange("alternate"), []);
  const setRoll = useCallback(setRange("roll"), []);
  const setRollRatio = useCallback(setRange("rollRatio"), []);
  const setLeftHand = useCallback(setRange("leftHand"), []);
  const setRightHand = useCallback(setRange("rightHand"), []);

  const setThumbsOnly = useCallback((value: boolean) => {
    setSearchStateImmutable((draft) => {
      draft.thumbsOnly = value;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
      draft.dirty = true;
    });
  }, []);

  const setSort = useCallback(
    (sort: SortOrder | undefined, sortBy: SearchSortField | undefined) => {
      setSearchStateImmutable((draft) => {
        draft.sort = sort;
        draft.sortBy = sortBy;
        if (sort !== undefined) {
          draft.randomize = "";
        }
        draft.valid = calculateFormValidity(draft);
        draft.empty = calculateSearchFormEmptiness(draft);
        draft.key = calculateFormKey(draft);
        draft.dirty = true;
        setCookie("sort", sort);
        setCookie("sortBy", sortBy);
      });
    },
    [],
  );

  const setRandomize = useCallback((randomize: boolean) => {
    setSearchStateImmutable((draft) => {
      const seed = randomString(5);
      draft.randomize = randomize ? seed : "";
      draft.sort = undefined;
      draft.valid = calculateFormValidity(draft);
      draft.empty = calculateSearchFormEmptiness(draft);
      draft.key = calculateFormKey(draft);
      draft.dirty = true;
      deleteCookie("sort");
    });
  }, []);

  return (
    <SearchContext.Provider
      value={{
        ...searchState,
        setQuery,
        setBoard,
        setSfb,
        setSfs,
        setFsb,
        setRedirect,
        setPinkyOff,
        setAlternate,
        setRoll,
        setRollRatio,
        setLeftHand,
        setRightHand,
        setThumbsOnly,
        setRandomize,
        setSort,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default React.memo(SearchStateProvider);
