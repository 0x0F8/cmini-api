"use server";

import {
  KeySearchState,
  KeySearchStateValues,
  SearchApiArgs,
  SearchConstraints,
  SearchRangeField,
  SearchSortField,
  SearchStateValues,
} from "@frontend/feature/search/types";
import transformQueryStringToKeySearchState from "@frontend/feature/search/transformQueryStringToKeySearchState";
import transformSearchFormToApiArgs from "@frontend/feature/search/transformSearchFormToApiArgs";
import calculateSearchFormEmptiness from "@frontend/feature/search/calculateSearchFormEmptiness";
import calculateKeySearchFormEmptiness from "@frontend/feature/search/calculateKeySearchFormEmptiness";
import { stringifyQuery } from "@util/url";
import { CminiBoardType } from "@backend/cmini/types";
import { Metrics } from "../state/AppStateProvider";
import { Toggle } from "@/types";

function parseDefaults(
  name: string,
  store: Record<string, any>,
  metrics: Metrics,
): SearchDefaultResult {
  const query = store.query ?? "";
  const sort = store.sort ?? undefined;
  const sortBy = store.sortBy ?? undefined;
  const randomize = store.randomize ?? undefined;
  const thumbsOnly = !Number.isNaN(Number(store.thumbsOnly))
    ? Number(store.thumbsOnly)
    : Toggle.None;

  const board =
    !Number.isNaN(Number(store.board)) &&
    Number(store.board) !== CminiBoardType.None
      ? Number(store.board)
      : undefined;

  const constraints: SearchConstraints = Object.values(SearchSortField).reduce(
    (prev, k) => {
      prev[k] = { min: 0, max: 0 };
      return prev;
    },
    {} as SearchConstraints,
  );
  const defaultState: SearchStateValues = {
    query,
    sort,
    randomize,
    sortBy,
    board,
    thumbsOnly,
    sfb: [],
    sfs: [],
    fsb: [],
    redirect: [],
    pinkyOff: [],
    alternate: [],
    roll: [],
    rollRatio: [],
    handUse: [],
  };

  for (let [key, value] of [
    [SearchRangeField.Sfb, store.sfb],
    [SearchRangeField.Sfs, store.sfs],
    [SearchRangeField.Fsb, store.fsb],
    [SearchRangeField.Redirect, store.redirect],
    [SearchRangeField.PinkyOff, store.pinkyOff],
    [SearchRangeField.Alternate, store.alternate],
    [SearchRangeField.Roll, store.roll],
    [SearchRangeField.RollRatio, store.rollRatio],
    [SearchRangeField.LeftHand, store.leftHand],
    [SearchRangeField.RightHand, store.rightHand],
  ]) {
    const constraint = metrics.get(key)!;
    const [minStr, maxStr] = (value ?? "").split(",");

    let min =
      minStr && minStr.length > 0 && !Number.isNaN(Number(minStr))
        ? Number(minStr)
        : constraint?.min;
    let max =
      maxStr && maxStr.length > 0 && !Number.isNaN(Number(maxStr))
        ? Number(maxStr)
        : constraint?.max;

    constraints[key] = constraint;
    defaultState[key] = [min, max];
  }

  const keyQuery = store.keyQuery?.replace(/\s/g, "+") ?? "";
  const defaultKeyState: KeySearchStateValues & Pick<KeySearchState, "output"> =
    {
      ...transformQueryStringToKeySearchState(keyQuery),
      output: keyQuery,
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
  };
}

export type SearchDefaultResult = {
  defaultState: SearchStateValues;
  defaultKeyState: Partial<KeySearchState>;
  defaultArgs: SearchApiArgs | undefined;
  defaultQueryString: string | undefined;
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
