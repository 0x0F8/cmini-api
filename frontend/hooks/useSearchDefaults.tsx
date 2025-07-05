"use server";

import {
  KeySearchState,
  KeySearchStateValues,
  SearchApiArgs,
  SearchConstraints,
  SearchStateValues,
} from "@frontend/feature/search/types";
import CminiController from "../../backend/cmini/controller";
import transformQueryStringToKeySearchState from "@frontend/feature/search/transformQueryStringToKeySearchState";
import transformSearchFormToApiArgs from "@frontend/feature/search/transformSearchFormToApiArgs";
import calculateSearchFormEmptiness from "@frontend/feature/search/calculateSearchFormEmptiness";
import calculateKeySearchFormEmptiness from "@frontend/feature/search/calculateKeySearchFormEmptiness";
import { stringifyQuery } from "@util/url";

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
  const defaultKeyState: KeySearchStateValues & Pick<KeySearchState, "output"> =
    {
      ...transformQueryStringToKeySearchState(keyQuery),
      output: keyQuery,
    };

  const constraints: SearchConstraints = {
    sfb: sfbConstraint,
  };
  const defaultState: SearchStateValues = {
    query,
    board,
    sfb: [sfbMin, sfbMax],
  };
  const isEmpty =
    calculateSearchFormEmptiness(defaultState, constraints) &&
    calculateKeySearchFormEmptiness(defaultKeyState);
  const defaultArgs = isEmpty
    ? undefined
    : transformSearchFormToApiArgs({
        corpora: "monkeyracer",
        ...defaultState,
        keyQuery,
      });
  const defaultQueryString = defaultArgs
    ? stringifyQuery(defaultArgs)
    : undefined;

  return {
    isEmpty,
    source: name,
    defaultState,
    defaultKeyState,
    defaultArgs,
    defaultQueryString,
    constraints,
  };
}

export type SearchDefaultResult = {
  defaultState: SearchStateValues;
  defaultKeyState: Partial<KeySearchState>;
  defaultArgs: SearchApiArgs | undefined;
  defaultQueryString: string | undefined;
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
