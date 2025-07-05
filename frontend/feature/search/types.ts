import { CminiBoardType } from "@backend/cmini/types";
import { SortOrder } from "types";
import { KeySearchKeyGroupProps } from "./KeySearchKeyGroup";

export type SearchApiArgs = {
  corpora: string;
  query?: string;
  board?: CminiBoardType;
  sort?: SortOrder;
  sortBy?: string;
  minSfb?: number;
  maxSfb?: number;
  author?: string;
  authorId?: string;
  name?: string;
  keyQuery?: string;
  createdBefore?: string;
  modifiedBefore?: string;
  createdAfter?: string;
  modifiedAfter?: string;
};

export type SearchState = {
  query: string;
  board: CminiBoardType | undefined;
  sfb: number[];
  valid: boolean;
  empty: boolean;
};

export type KeySearchState = {
  left: KeySearchKeyGroupProps[];
  either: KeySearchKeyGroupProps[];
  right: KeySearchKeyGroupProps[];
  editing: boolean;
  empty: boolean;
  valid: boolean;
  output: string;

  getHandGroups: (hand: KeySearchHandConstraint) => KeySearchKeyGroupProps[];
  getKeyGroup: (
    hand: KeySearchHandConstraint,
    index: number,
  ) => KeySearchKeyGroupProps;
  isProposedEditValid: (
    value: string,
    hand: KeySearchHandConstraint,
    groupIndex: number,
    keyIndex: number,
  ) => boolean;
};

export type SearchStateValues = Omit<SearchState, "valid" | "empty">;

export type KeySearchStateValues = Omit<
  KeySearchState,
  | "empty"
  | "editing"
  | "valid"
  | "output"
  | "getHandGroups"
  | "getKeyGroup"
  | "isProposedEditValid"
>;

export type SearchConstraints = {
  sfb: number[];
};

export enum KeySearchHandConstraint {
  Left = "left",
  Right = "right",
  Either = "either",
}
