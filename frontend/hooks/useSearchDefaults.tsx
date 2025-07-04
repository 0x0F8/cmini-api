"use server";

import {
  SearchApiArgs,
  SearchConstraints,
  SearchFormState,
} from "@frontend/feature/search/types";
import CminiController from "../../backend/cmini/controller";
import { KeySearchState } from "@frontend/state/KeySearchStateProvider";
import transformQueryStringToKeySearchState from "@frontend/feature/search/transformQueryStringToKeySearchState";
import transformSearchFormToApiArgs from "@frontend/feature/search/transformSearchFormToApiArgs";

const DEFAULT_RANGE = [0, 100];

function getSearchConstraint(searchField: string): number[] {
  switch (searchField) {
    case "sfb": {
      const metric = CminiController.getMetric("sfb");
      return [metric!.min, metric!.max];
    }
    case "sfs": {
      const metric1 = CminiController.getMetric("dsfb-red");
      const metric2 = CminiController.getMetric("dsfb-alt");
      return [metric1!.min + metric2!.min, metric1!.max + metric2!.max];
    }
    default:
      return DEFAULT_RANGE;
  }
}

function parseDefaults(name: string, store): SearchDefaultResult {
  const query = store.query ?? "";
  const board = !Number.isNaN(Number(store.board))
    ? Number(store.board)
    : undefined;

  const sfbConstraint = getSearchConstraint("sfb");
  const [sfbMinStr, sfbMaxStr] = (store.sfb ?? "").split(",");
  let sfbMin = !Number.isNaN(Number(sfbMinStr))
    ? Number(sfbMinStr)
    : sfbConstraint[0];
  let sfbMax = !Number.isNaN(Number(sfbMaxStr))
    ? Number(sfbMaxStr)
    : sfbConstraint[1];

  const keyQuery = store.keyQuery?.replace(/\s/g, "+") ?? "";
  let hasKeyQuery = !!keyQuery;
  let defaultKeyState: Partial<KeySearchState> = {};
  if (keyQuery) {
    defaultKeyState = {
      ...transformQueryStringToKeySearchState(keyQuery),
      query: keyQuery,
    };
    hasKeyQuery =
      (defaultKeyState?.left?.length || 0) > 0 ||
      (defaultKeyState?.right?.length || 0) > 0 ||
      (defaultKeyState?.either?.length || 0) > 0;
  }

  const defaultState = {
    query,
    board,
    sfb: [sfbMin, sfbMax],
  };

  return {
    isEmpty:
      query === "" &&
      !hasKeyQuery &&
      typeof board === "undefined" &&
      sfbMin === sfbConstraint[0] &&
      sfbMax === sfbConstraint[1],
    source: name,
    defaultState,
    defaultKeyState,
    defaultArgs: transformSearchFormToApiArgs({
      corpora: "monkeyracer",
      ...defaultState,
      keyQuery,
    }),
    constraints: {
      sfb: sfbConstraint,
    },
  };
}

export type SearchDefaultResult = {
  defaultState: SearchFormState;
  defaultKeyState: Partial<KeySearchState>;
  defaultArgs: SearchApiArgs;
  constraints: SearchConstraints;
  isEmpty: boolean;
  source: string;
};

export default async function useSearchDefaults(
  stores,
): Promise<SearchDefaultResult> {
  let result: SearchDefaultResult | undefined = undefined;
  for (const [name, store] of stores) {
    result = parseDefaults(name, store);
    if (!result.isEmpty) break;
  }
  return result!;
}
