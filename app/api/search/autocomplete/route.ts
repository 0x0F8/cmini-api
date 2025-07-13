import * as z from "zod/v4";
import { parseQuery } from "@util/url";
import { meta } from "@util/api";
import CminiApi from "@backend/cmini/api";
import { ApiDataPaginated } from "types";
import {
  CminiBoardType,
  CminiLayout,
  CminiMeta,
  CminiStats,
} from "@backend/cmini/types";
import CminiController from "@backend/cmini/controller";
import { SearchSortField } from "@frontend/feature/search/types";
import { PAGE_LIMIT } from "@/constants";

export type AutocompleteApiData = {
  stats: CminiStats;
  meta: CminiMeta[];
  layoutId: string;
  boardId: string;
  board: CminiBoardType;
  layout: CminiLayout;
};

export type AutoCompleteApiResult = ApiDataPaginated<AutocompleteApiData>;

const schema = z.object({
  corpora: z.enum(CminiController.getCorpora()),
  query: z.string().min(1).max(55),
  sortBy: z.enum([SearchSortField.Author, SearchSortField.Name]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

export async function GET(req) {
  const queryObj = parseQuery(req.url!);
  const validation = schema.safeParse(queryObj);
  if (validation.error) {
    return Response.json({
      error: validation.error!.issues,
      success: false,
    });
  }

  const result = CminiApi.autoComplete(queryObj as any);
  const { rows, cursor, ...metas } = meta(result, 1, PAGE_LIMIT);

  return Response.json({
    data: rows,
    success: true,
    meta: metas,
  });
}
