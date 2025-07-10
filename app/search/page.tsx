import { cookies } from "next/headers";
import useSearchDefaults from "@frontend/hooks/useSearchDefaults";
import { objectFromCookies } from "@util/nextjs";
import SearchContainer from "@frontend/feature/search/SearchContainer";
import CminiApi from "@backend/cmini/api";
import KeySearchStateProvider from "@frontend/state/KeySearchStateProvider";
import SearchStateProvider from "@frontend/state/SearchStateProvider";
import { SearchApiResult } from "app/api/search/route";
import { meta } from "@util/api";
import { SWRConfig } from "swr";
import useAppDefaults from "@frontend/hooks/useAppDefaults";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const cookieStore = await cookies();
  const appDefaults = await useAppDefaults([
    ["cookies", objectFromCookies(cookieStore, "app")],
  ]);
  const searchDefaults = await useSearchDefaults(
    [
      ["query", query],
      ["cookies", objectFromCookies(cookieStore, "search")],
    ],
    appDefaults.defaultState.metrics,
  );

  let fallback: { [key: string]: SearchApiResult | undefined } = {};
  if (searchDefaults.defaultArgs) {
    const searchDefaultResult = CminiApi.search(searchDefaults.defaultArgs);
    const { rows, cursor, ...metas } = meta(searchDefaultResult, 1, 25);
    const path = `/api/search?${searchDefaults.defaultQueryString}&limit=25&page=1`;
    fallback = searchDefaults.defaultQueryString
      ? {
          [path]: {
            data: rows,
            meta: metas,
            success: true,
          },
          "/api/search": {
            data: rows,
            meta: metas,
            success: true,
          },
        }
      : {};
  }

  return (
    <SWRConfig value={{ fallback }}>
      <SearchStateProvider injectedState={searchDefaults.defaultState}>
        <KeySearchStateProvider injectedState={searchDefaults.defaultKeyState}>
          <SearchContainer
            searchFormConstraints={searchDefaults.constraints}
            searchDefaultResult={searchDefaults}
          />
        </KeySearchStateProvider>
      </SearchStateProvider>
    </SWRConfig>
  );
}
