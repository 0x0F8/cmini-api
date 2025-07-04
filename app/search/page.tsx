import { cookies } from "next/headers";
import useSearchDefaults from "@frontend/hooks/useSearchDefaults";
import { objectFromCookies } from "@util/nextjs";
import SearchContainer from "@frontend/feature/search/SearchContainer";
import CminiApi from "@backend/cmini/api";
import KeySearchStateProvider from "@frontend/state/KeySearchStateProvider";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const cookieStore = await cookies();
  const searchDefaults = await useSearchDefaults([
    ["query", query],
    ["cookies", objectFromCookies(cookieStore, "search")],
  ]);
  const searchDefaultResult =
    searchDefaults?.source === "query"
      ? CminiApi.search(searchDefaults.defaultArgs)
      : undefined;

  return (
    <KeySearchStateProvider injectedState={searchDefaults.defaultKeyState}>
      <SearchContainer
        searchFormDefaultState={searchDefaults.defaultState}
        searchFormConstraints={searchDefaults.constraints}
        searchDefaultResult={searchDefaultResult}
      />
    </KeySearchStateProvider>
  );
}
