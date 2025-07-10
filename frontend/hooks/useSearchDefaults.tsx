"use server";

import {
  KeySearchState,
  KeySearchStateValues,
  SearchApiArgs,
  SearchConstraints,
  SearchStateValues,
} from "@frontend/feature/search/types";
import transformQueryStringToKeySearchState from "@frontend/feature/search/transformQueryStringToKeySearchState";
import transformSearchFormToApiArgs from "@frontend/feature/search/transformSearchFormToApiArgs";
import calculateSearchFormEmptiness from "@frontend/feature/search/calculateSearchFormEmptiness";
import calculateKeySearchFormEmptiness from "@frontend/feature/search/calculateKeySearchFormEmptiness";
import { stringifyQuery } from "@util/url";

function parseDefaults(name: string, store, metrics): SearchDefaultResult {
  const query = store.query ?? "";
  const board = !Number.isNaN(Number(store.board))
    ? Number(store.board)
    : undefined;

  const sfbConstraint = metrics["sfb"];
  const [sfbMinStr, sfbMaxStr] = (store.sfb ?? "").split(",");
  let sfbMin = !Number.isNaN(Number(sfbMinStr))
    ? Number(sfbMinStr)
    : sfbConstraint[0];
  let sfbMax = !Number.isNaN(Number(sfbMaxStr))
    ? Number(sfbMaxStr)
    : sfbConstraint[1];

  const sfsConstraint = metrics["sfs"];
  const [sfsMinStr, sfsMaxStr] = (store.sfs ?? "").split(",");
  let sfsMin = !Number.isNaN(Number(sfsMinStr))
    ? Number(sfsMinStr)
    : sfsConstraint[0];
  let sfsMax = !Number.isNaN(Number(sfsMaxStr))
    ? Number(sfsMaxStr)
    : sfsConstraint[1];

  const keyQuery = store.keyQuery?.replace(/\s/g, "+") ?? "";
  const defaultKeyState: KeySearchStateValues & Pick<KeySearchState, "output"> =
    {
      ...transformQueryStringToKeySearchState(keyQuery),
      output: keyQuery,
    };

  const constraints: SearchConstraints = {
    sfb: sfbConstraint,
    sfs: sfsConstraint,
  };
  const defaultState: SearchStateValues = {
    query,
    board,
    sfb: [sfbMin, sfbMax],
    sfs: [sfsMin, sfsMax],
    thumbsOnly: false,
  };
  const isEmpty =
    calculateSearchFormEmptiness(defaultState, constraints) &&
    calculateKeySearchFormEmptiness(defaultKeyState);
  const defaultArgs = isEmpty
    ? undefined
    : transformSearchFormToApiArgs(
        {
          corpora: "monkeyracer",
          ...defaultState,
          keyQuery,
        },
        constraints,
      );
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
  metrics,
): Promise<SearchDefaultResult> {
  let result: SearchDefaultResult | undefined = undefined;
  for (const [name, store] of stores) {
    result = parseDefaults(name, store, metrics);
    if (!result.isEmpty) break;
  }
  return result!;
}
