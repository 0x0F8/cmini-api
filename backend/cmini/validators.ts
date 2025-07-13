import * as z from "zod/v4";
import CminiController from "./controller";
import { CminiBoardType } from "./types";
import { SearchSortField } from "@frontend/feature/search/types";
import { SortOrder } from "@/types";

export const SearchSchema = z.object({
  corpora: z.enum(CminiController.getCorpora()),
  name: z.string().min(1).max(255).optional(),
  author: z.string().min(1).max(32).optional(),
  query: z.string().max(55).optional(),
  board: z.enum(CminiBoardType).optional(),
  minSfb: z.number().gte(0).optional(),
  maxSfb: z.number().lte(100).optional(),
  minSfs: z.number().gte(0).optional(),
  maxSfs: z.number().lte(100).optional(),
  minFsb: z.number().gte(0).optional(),
  maxFsb: z.number().lte(100).optional(),
  minRedirect: z.number().gte(0).optional(),
  maxRedirect: z.number().lte(100).optional(),
  minPinkyOff: z.number().gte(0).optional(),
  maxPinkyOff: z.number().lte(100).optional(),
  minAlternation: z.number().gte(0).optional(),
  maxAlternation: z.number().lte(100).optional(),
  minRoll: z.number().gte(0).optional(),
  maxRoll: z.number().lte(100).optional(),
  minRollRatio: z.number().gte(0).optional(),
  maxRollRatio: z.number().lte(2).optional(),
  minLeftHand: z.number().gte(0).optional(),
  maxLeftHand: z.number().lte(50).optional(),
  minRightHand: z.number().gte(0).optional(),
  maxRightHand: z.number().lte(50).optional(),
  keyQuery: z.string().min(2).max(55).optional(),
  hasThumb: z.boolean().optional(),
  createdBefore: z.number().gte(1e9).lte(1e10).optional(),
  createdAfter: z.number().gte(1e9).lte(1e10).optional(),
  modifiedBefore: z.number().gte(1e9).lte(1e10).optional(),
  modifiedAfter: z.number().gte(1e9).lte(1e10).optional(),

  sortBy: z.enum(SearchSortField).optional(),
  sort: z.enum(SortOrder).optional(),
  limit: z.number().gt(0).lte(50).optional(),
  page: z.number().gt(0).optional(),
});
