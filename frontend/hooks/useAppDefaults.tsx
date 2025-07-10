"use server";

import CminiController from "@backend/cmini/controller";
import { AppState } from "@frontend/state/AppStateProvider";

const DEFAULT_RANGE = [0, 100];

function getCombinedMetric(name: string): number[] {
  switch (name) {
    case "sfb": {
      const metric = CminiController.getMetric("sfb");
      return [metric!.min, metric!.max];
    }
    case "sfs": {
      const metric1 = CminiController.getMetric("dsfb-red");
      const metric2 = CminiController.getMetric("dsfb-alt");
      return [metric1!.min + metric2!.min, metric1!.max + metric2!.max];
    }
    case "alternate": {
      const metric1 = CminiController.getMetric("alternate");
      return [metric1!.min, metric1!.max];
    }
    case "roll": {
      const metric1 = CminiController.getMetric("roll-in");
      const metric2 = CminiController.getMetric("roll-out");
      return [metric1!.min + metric2!.min, metric1!.max + metric2!.max];
    }
    case "redirect": {
      const metric1 = CminiController.getMetric("redirect");
      const metric2 = CminiController.getMetric("bad-redirect");
      return [metric1!.min + metric2!.min, metric1!.max + metric2!.max];
    }
    case "pinkyOff": {
      const metric1 = CminiController.getMetric("pinky-off");
      return [metric1!.min, metric1!.max];
    }
    case "scissors": {
      const metric1 = CminiController.getMetric("fsb");
      return [metric1!.min, metric1!.max];
    }
    default:
      return DEFAULT_RANGE;
  }
}

function parseDefaults(name: string, store): AppDefaultResult {
  const defaultState: AppState = {
    corpora: store.corpora ?? "monkeyracer",
    metrics: [
      "sfb",
      "sfs",
      "alternate",
      "roll",
      "redirect",
      "pinkyOff",
      "scissors",
    ].reduce((prev, key) => {
      prev[key] = getCombinedMetric(key);
      return prev;
    }, {}),
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
