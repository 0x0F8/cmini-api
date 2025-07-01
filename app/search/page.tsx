import { cookies } from 'next/headers'
import useSearchDefaults from '@frontend/hooks/useSearchDefaults';
import { objectFromCookies } from '@util/nextjs';
import SearchContainer from '@frontend/feature/search/SearchContainer';
import CminiApi from '@backend/cmini/api';
import transformSearchFormToApiArgs from '@frontend/feature/search/transformSearchFormToApiArgs';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page({ searchParams }: {
    searchParams: SearchParams
}) {
    const query = await searchParams
    const cookieStore = await cookies()
    const searchFormDefaults = await useSearchDefaults([
        ['query', query], 
        ['cookies', objectFromCookies(cookieStore, 'search')]
    ])
    const searchResultDefault = searchFormDefaults?.source === 'query' ? 
        CminiApi.search(transformSearchFormToApiArgs(searchFormDefaults.defaultState)) : undefined

    return (
        <SearchContainer searchFormDefaults={searchFormDefaults} searchResultDefault={searchResultDefault} />
    )
}