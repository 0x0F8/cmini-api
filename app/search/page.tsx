import { Stack } from '@mui/material';
import { cookies } from 'next/headers'
import SearchForm from '@frontend/components/SearchForm';
import useSearchDefaults from '@frontend/hooks/useSearchDefaults';
import { objectFromCookies } from '@util/nextjs';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page({ searchParams }: {
    searchParams: SearchParams
  }) {
    const query = await searchParams
    const cookieStore = await cookies()
    const { defaultState, constraints } = await useSearchDefaults([query, objectFromCookies(cookieStore)])

    return (
        <Stack>
            <SearchForm defaultState={defaultState} constraints={constraints} />
        </Stack>
    )
}