import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detailedDiff } from "deep-object-diff";
import {
  AppStateQueryKeys,
  SearchStateQueryKeys,
} from "@frontend/feature/search/types";
import { parseQuery, stringifyQuery } from "@util/url";

const searchKeys = Object.keys(SearchStateQueryKeys);
const appKeys = Object.keys(AppStateQueryKeys);

export function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const hasCookies = Object.keys(cookies).length > 0;

  const url = request.nextUrl.clone();
  if (!hasCookies) return;

  const query = parseQuery(url.search);

  const pcookies = cookies.reduce((prev, { name, value }) => {
    for (const [prefix, keys] of [
      ["search", searchKeys],
      ["app", appKeys],
    ]) {
      const k = name.replace((prefix as string) + "-", "");
      if (keys.includes(k)) {
        prev[k] = value;
      }
    }
    return prev;
  }, {});
  const nextQuery = { ...pcookies, ...query };
  url.search = stringifyQuery(nextQuery);
  return NextResponse.rewrite(url);

  //   const diff = detailedDiff(cookies,query)
  //   const hasDiff=Object.keys(diff.added).length>0||Object.keys(diff.updated).length>0
  //   const url=new URL(request.url)

  //   if(hasDiff){
  //     const nextQuery=new URLSearchParams({...cookies,...query})
  //     return NextResponse.redirect(`${url.pathname}?${nextQuery}`)
  //   }
}

export const config = {
  matcher: "/search",
};
