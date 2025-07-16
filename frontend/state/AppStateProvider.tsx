"use client";

import cookies from "@frontend/Cookies";
import React, { ReactNode } from "react";
import { createContext, useState } from "react";
import { SearchRangeField } from "../feature/search/types";

export type Metrics = Map<SearchRangeField, { min: number; max: number }>;
export type AllMetrics = Map<string, Metrics>;
export type AppState = {
  corpora: string;
  corporas: string[];
  metrics: Metrics;
  allMetrics: AllMetrics;
};

type SetAppState = {
  setCorpora: (corpora: string) => void;
  setMetrics: (metrics: Metrics) => void;
};

const defaultState: AppState = {
  corpora: "monkeyracer",
  corporas: [],
  metrics: new Map(),
  allMetrics: new Map(),
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
    setAppState((state) => ({
      ...state,
      corpora,
      metrics: state.allMetrics.get(corpora)!,
    }));
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
