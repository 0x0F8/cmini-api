"use server";

import CminiController from "@backend/cmini/controller";
import { AppState } from "@frontend/state/AppStateProvider";
import { SearchSortField } from "../feature/search/types";

function getCombinedMetric(name: string): { min: number; max: number } {
  let min = 0;
  let max = 100;
  switch (name) {
    case SearchSortField.Sfb: {
      const metric = CminiController.getMetric("sfb");
      min = metric!.min;
      max = metric!.max;
      break;
    }
    case SearchSortField.Sfs: {
      const metric1 = CminiController.getMetric("dsfb-red");
      const metric2 = CminiController.getMetric("dsfb-alt");
      min = metric1!.min + metric2!.min;
      max = metric1!.max + metric2!.max;
      break;
    }
    case SearchSortField.Alternate: {
      const metric1 = CminiController.getMetric("alternate");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchSortField.Roll: {
      const metric1 = CminiController.getMetric("roll-in");
      const metric2 = CminiController.getMetric("roll-out");
      min = metric1!.min + metric2!.min;
      max = metric1!.max + metric2!.max;
      break;
    }
    case SearchSortField.Redirect: {
      const metric1 = CminiController.getMetric("redirect");
      const metric2 = CminiController.getMetric("bad-redirect");
      min = metric1!.min + metric2!.min;
      max = metric1!.max + metric2!.max;
      break;
    }
    case SearchSortField.PinkyOff: {
      const metric1 = CminiController.getMetric("pinky-off");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchSortField.Fsb: {
      const metric1 = CminiController.getMetric("fsb");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchSortField.RollRatio: {
      const metric1 = CminiController.getMetric("roll-in");
      const metric2 = CminiController.getMetric("roll-out");
      min = metric1!.min / metric2!.min;
      max = metric1!.max / metric2!.max;
      break;
    }
    case SearchSortField.LeftHand: {
      const metric1 = CminiController.getMetric("LH");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchSortField.RightHand: {
      const metric1 = CminiController.getMetric("RH");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    default:
    // nop
  }

  return { min, max };
}

function parseDefaults(name: string, store): AppDefaultResult {
  const defaultState: AppState = {
    corpora: store.corpora ?? "monkeyracer",
    metrics: Object.values(SearchSortField).reduce((prev, key) => {
      prev.set(key, getCombinedMetric(key));
      return prev;
    }, new Map()),
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
