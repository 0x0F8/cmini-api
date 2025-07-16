"use server";

import CminiController from "@backend/cmini/controller";
import { AllMetrics, AppState } from "@frontend/state/AppStateProvider";
import { SearchRangeField } from "../feature/search/types";

function getCombinedMetric(
  corpora: string,
  name: string,
): { min: number; max: number } {
  let min = 0;
  let max = 100;
  switch (name) {
    case SearchRangeField.Sfb: {
      const metric = CminiController.getMetric(corpora, "sfb");
      min = metric!.min;
      max = metric!.max;
      break;
    }
    case SearchRangeField.Sfs: {
      const metric1 = CminiController.getMetric(corpora, "dsfb-red");
      const metric2 = CminiController.getMetric(corpora, "dsfb-alt");
      min = metric1!.min + metric2!.min;
      max = metric1!.max + metric2!.max;
      break;
    }
    case SearchRangeField.Alternate: {
      const metric1 = CminiController.getMetric(corpora, "alternate");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchRangeField.Roll: {
      const metric1 = CminiController.getMetric(corpora, "roll-in");
      const metric2 = CminiController.getMetric(corpora, "roll-out");
      min = metric1!.min + metric2!.min;
      max = metric1!.max + metric2!.max;
      break;
    }
    case SearchRangeField.Redirect: {
      const metric1 = CminiController.getMetric(corpora, "redirect");
      const metric2 = CminiController.getMetric(corpora, "bad-redirect");
      min = metric1!.min + metric2!.min;
      max = metric1!.max + metric2!.max;
      break;
    }
    case SearchRangeField.PinkyOff: {
      const metric1 = CminiController.getMetric(corpora, "pinky-off");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchRangeField.Fsb: {
      const metric1 = CminiController.getMetric(corpora, "fsb");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchRangeField.RollRatio: {
      const metric1 = CminiController.getMetric(corpora, "roll-in");
      const metric2 = CminiController.getMetric(corpora, "roll-out");
      min = metric1!.min / metric2!.min;
      max = metric1!.max / metric2!.max;
      break;
    }
    case SearchRangeField.LeftHand: {
      const metric1 = CminiController.getMetric(corpora, "LH");
      min = metric1!.min;
      max = metric1!.max;
      break;
    }
    case SearchRangeField.RightHand: {
      const metric1 = CminiController.getMetric(corpora, "RH");
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
  const corporas = CminiController.getCorpora();
  let allMetrics: AllMetrics = new Map();
  for (const corpora of corporas) {
    const ref = new Map();
    allMetrics.set(corpora, ref);

    for (const key of Object.values(SearchRangeField)) {
      ref.set(key, getCombinedMetric(corpora, key));
    }
  }

  const corpora = store.corpora ?? "monkeyracer";
  const metrics = allMetrics.get(corpora)!;
  const defaultState: AppState = {
    corpora: store.corpora ?? "monkeyracer",
    allMetrics,
    metrics,
    corporas,
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
