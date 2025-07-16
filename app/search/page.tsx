import { cookies } from "next/headers";
import useSearchDefaults from "@frontend/hooks/useSearchDefaults";
import { objectFromCookies } from "@util/nextjs";
import SearchContainer from "@/frontend/container/SearchContainer";
import KeySearchStateProvider from "@frontend/state/KeySearchStateProvider";
import SearchStateProvider from "@frontend/state/SearchStateProvider";
import { SearchApiResult } from "app/api/search/route";
import { SWRConfig } from "swr";
import useAppDefaults from "@frontend/hooks/useAppDefaults";
import { convertQuery } from "@util/url";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const cookieStore = await cookies();
  const appDefaults = await useAppDefaults([
    ["query", convertQuery(query)],
    ["cookies", convertQuery(objectFromCookies(cookieStore, "app"))],
  ]);
  const searchDefaults = await useSearchDefaults(
    [
      ["query", convertQuery(query)],
      ["cookies", convertQuery(objectFromCookies(cookieStore, "search"))],
    ],
    appDefaults.defaultState.metrics,
  );

  let fallback: { [key: string]: SearchApiResult | undefined } = {};
  // if (searchDefaults.defaultArgs) {
  //   const searchDefaultResult = CminiApi.search({
  //     ...searchDefaults.defaultArgs,
  //     corpora: appDefaults.defaultState.corpora,
  //   });
  //   if (searchDefaultResult.length > 0) {
  //     const { rows, cursor, ...metas } = meta(
  //       searchDefaultResult,
  //       1,
  //       PAGE_LIMIT,
  //     );
  //     fallback = searchDefaults.defaultQueryString
  //       ? {
  //           [`/api/search?${searchDefaults.defaultQueryString}&limit=${PAGE_LIMIT}&page=1`]:
  //             {
  //               data: rows,
  //               meta: metas,
  //               success: true,
  //             },
  //         }
  //       : {};
  //   }
  // }

  return (
    <SWRConfig value={{ fallback }}>
      <SearchStateProvider injectedState={searchDefaults.defaultState}>
        <KeySearchStateProvider injectedState={searchDefaults.defaultKeyState}>
          <SearchContainer searchDefaultResult={searchDefaults} />
        </KeySearchStateProvider>
      </SearchStateProvider>
    </SWRConfig>
  );
}
