"use client";

import cookies from "@frontend/Cookies";
import React, { ReactNode } from "react";
import { createContext, useState } from "react";

export type AppState = {
  corpora: string;
  corporas: string[];
};

type SetAppState = {
  setCorpora: (corpora: string) => void;
};

const defaultState: AppState = {
  corpora: "monkeyracer",
  corporas: [],
};
const defaultSetState: SetAppState = {
  setCorpora: (_: string) => {},
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

  return (
    <AppContext.Provider
      value={{
        ...appState,
        setCorpora,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default React.memo(AppStateProvider);
