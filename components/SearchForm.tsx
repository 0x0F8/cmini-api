'use client'
 
import { MenuItem, Slider, Stack, TextField } from "@mui/material";
import Select from '@mui/material/Select';
import { useState, useEffect } from "react";
import { CminiBoard } from "../cmini/types";
import { useSearchDefaults } from '../hooks/useSearchDefaults';

export type SearchConstraints = {
    minSfb: number;
    maxSfb: number;
}

export type SearchState = {
    query: string
    board: CminiBoard | undefined
    sfb: number[]
}

export default function SearchForm({constraints}: {constraints:SearchConstraints}) {
    const defaults = useSearchDefaults(constraints)
    const [searchState, setSearchState] = useState<SearchState>(defaults)

    const onQueryChange = (e: any) => 
        setSearchState(state => ({...state, query: e.target.value}))
    const onBoardChange = (e: any, value: number) => setSearchState(state => ({...state, board: value}))
    const onSfbChange = (e: any, value: number[]) => setSearchState(state => ({...state, sfb: value}))

    return (
        <Stack>
            <TextField variant="outlined" value={searchState.query} onChange={onQueryChange} />
            <Select
                value={searchState.board}
                label="Board Type"
                onChange={onBoardChange}
            >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={CminiBoard.Staggered}>Staggered</MenuItem>
                <MenuItem value={CminiBoard.Ortho}>Orthogonal</MenuItem>
                <MenuItem value={CminiBoard.Mini}>Mini</MenuItem>
            </Select>
            <Slider
                getAriaLabel={() => 'Single Finger Bigrams (SFB)'}
                value={searchState.sfb}
                onChange={onSfbChange}
                step={0.1}
                valueLabelDisplay="on"
                min={constraints.minSfb}
                max={constraints.maxSfb}
            />
        </Stack>  
    )
}