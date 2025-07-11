import { CminiBoardType } from "@backend/cmini/types";
import { SortOrder } from "types";
import { KeySearchKeyGroupProps } from "./KeySearchKeyGroup";

export type SearchApiArgs = {
  corpora: string;
  query?: string;
  board?: CminiBoardType;
  sort?: SortOrder;
  sortBy?: SearchSortField;
  minSfb?: number;
  maxSfb?: number;
  minSfs?: number;
  maxSfs?: number;
  author?: string;
  authorId?: string;
  name?: string;
  keyQuery?: string;
  createdBefore?: string;
  modifiedBefore?: string;
  createdAfter?: string;
  modifiedAfter?: string;
  hasThumb?: boolean;
};

export type AutocompleteApiArgs = {
  corpora: string;
  query: string;
  sort?: SortOrder | undefined;
  sortBy?: SearchSortField;
};

export enum SearchSortField {
  Sfs = "sfs",
  Sfb = "sfb",
  Name = "name",
  Author = "author",
}

export type SearchState = {
  sort: SortOrder | undefined;
  sortBy: SearchSortField | undefined;
  query: string;
  board: CminiBoardType | undefined;
  sfb: number[];
  sfs: number[];
  thumbsOnly: boolean | undefined;
  valid: boolean;
  empty: boolean;
  key: string;
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

export type SearchStateValues = Omit<SearchState, "valid" | "empty" | "key">;

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
  sfs: number[];
};

export enum KeySearchHandConstraint {
  Left = "left",
  Right = "right",
  Either = "either",
}
