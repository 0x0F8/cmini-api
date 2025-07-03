"use client";

import cookies from "@frontend/Cookies";
import React, { ReactNode } from "react";
import { createContext, useState } from "react";

enum AppStateCookie {
  Corpora = "app-corpora",
}

type AppState = {
  corpora: string;
  corporas: string[];
};

type SetAppState = {
  setCorpora: (corpora: string) => void;
};

const defaultState: AppState = {
  corpora: cookies.get(AppStateCookie.Corpora) || "monkeyracer",
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
  const [appState, setAppState] = useState(defaultState);

  const setCorpora = (corpora: string) => {
    cookies.set(AppStateCookie.Corpora, corpora);
    setAppState((state) => ({ ...state, corpora }));
  };

  return (
    <AppContext.Provider
      value={{
        ...appState,
        setCorpora,
        ...injectedState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default React.memo(AppStateProvider);
