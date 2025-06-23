import { Stack } from '@mui/material';
import { cookies } from 'next/headers'
import SearchForm from '../../components/SearchForm';
import useSearchDefaults from '../../hooks/useSearchDefaults';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page({ searchParams }: {
    searchParams: SearchParams
  }) {
    const query = await searchParams
    const cookieStore = await cookies()
    const { defaultState, constraints } = await useSearchDefaults([query, cookieStore])

    return (
        <Stack>
            <SearchForm defaultState={defaultState} constraints={constraints} />
        </Stack>
    )
}