"use server";

import { AppState } from "@frontend/state/AppStateProvider";

function parseDefaults(name: string, store): AppDefaultResult {
  const defaultState: AppState = {
    corpora: store.corpora ?? "monkeyracer",
    corporas: [],
  };

  return {
    source: name,
    defaultState,
  };
}

export type AppDefaultResult = {
  defaultState: AppState;
  source: string;
};

export default async function useAppDefaults(
  stores,
): Promise<AppDefaultResult> {
  let result: AppDefaultResult | undefined = undefined;
  for (const [name, store] of stores) {
    result = parseDefaults(name, store);
  }
  return result!;
}
