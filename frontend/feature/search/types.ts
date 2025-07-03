import { CminiBoardType } from "@backend/cmini/types";
import { SortOrder } from "types";

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

export type SearchConstraints = {
  sfb: number[];
};

export type SearchFormState = {
  query: string;
  board: CminiBoardType | undefined;
  sfb: number[];
};

export enum KeySearchHandConstraint {
  Left = "left",
  Right = "right",
  Either = "either",
}
