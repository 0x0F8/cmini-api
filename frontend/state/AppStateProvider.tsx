"use client";

import cookies from "@frontend/Cookies";
import React, { ReactNode } from "react";
import { createContext, useState } from "react";
import { SearchSortField } from "../feature/search/types";

type Metrics = Map<SearchSortField, { min: number; max: number }>;
export type AppState = {
  corpora: string;
  corporas: string[];
  metrics: Metrics;
};

type SetAppState = {
  setCorpora: (corpora: string) => void;
  setMetrics: (metrics: Metrics) => void;
};

const defaultState: AppState = {
  corpora: "monkeyracer",
  corporas: [],
  metrics: new Map(),
};
const defaultSetState: SetAppState = {
  setCorpora: (_: string) => {},
  setMetrics: (_: Metrics) => {},
};

export const AppContext = createContext<AppState & SetAppState>({
  ...defaultState,
  ...defaultSetState,
});

const AppStateProvider = ({
  children,
  injectedState = {},
}: {
  injectedState?: Partial<AppState>;
  children: ReactNode;
}) => {
  const [appState, setAppState] = useState({
    ...defaultState,
    ...injectedState,
  });

  const setCookie = (key: string, value: string) => {
    cookies.set(`app-${key}`, value);
  };

  const setCorpora = (corpora: string) => {
    setAppState((state) => ({ ...state, corpora }));
    setCookie("corpora", corpora);
  };

  const setMetrics = (metrics: Metrics) => {
    setAppState((state) => ({ ...state, metrics }));
  };

  return (
    <AppContext.Provider
      value={{
        ...appState,
        setCorpora,
        setMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default React.memo(AppStateProvider);
