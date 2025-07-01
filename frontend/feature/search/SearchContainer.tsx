'use client'

import LayoutTable from "@frontend/components/LayoutTable";
import SearchForm from "@frontend/feature/search/SearchForm";
import useSearch from "@frontend/hooks/useSearch";
import { SearchDefaultResult } from "@frontend/hooks/useSearchDefaults";
import { Stack } from "@mui/material";
import { SearchApiResult } from "app/api/search/route";
import { useCallback, useEffect, useState } from "react";
import { SearchApiArgs } from "./types";

type State = {
    query: SearchApiArgs | undefined
    results: SearchApiResult['data'] | undefined
}

export default function SearchContainer({ searchFormDefaults, searchResultDefault }: { searchFormDefaults: SearchDefaultResult; searchResultDefault: SearchApiResult['data'] | undefined }) {
    const [state, setState] = useState<State>({
        query: undefined,
        results: searchResultDefault
    })
    const { query, results } = state
    const { search, isLoading, error } = useSearch(query)

    const onSubmit = useCallback((args: SearchApiArgs) =>
        setState(state => ({ ...state, query: args })), [])

    useEffect(() => {
        if (!!search && !error) {
            setState(state => ({ ...state, results: search.data }))
        }
    }, [search, error])

    return (
        <Stack>
            <SearchForm
                onSubmit={onSubmit}
                defaultState={searchFormDefaults.defaultState}
                constraints={searchFormDefaults.constraints}
            />
            {results && <LayoutTable data={results} />}
        </Stack>
    )
}