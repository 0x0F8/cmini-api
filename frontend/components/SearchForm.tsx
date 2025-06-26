'use client'
 
import { Button, MenuItem, Slider, Stack, TextField } from "@mui/material";
import Select from '@mui/material/Select';
import { useState } from "react";
import { CminiBoardType } from "../../backend/cmini/types";

export type SearchConstraints = {
    sfb: number[]
}

export type SearchState = {
    query: string
    board: CminiBoardType | undefined
    sfb: number[]
}

export default function SearchForm({defaultState, constraints}: {defaultState:SearchState,constraints:SearchConstraints}) {
    const [searchState, setSearchState] = useState<SearchState>(defaultState)

    const onQueryChange = (e: any) => 
        setSearchState(state => ({...state, query: e.target.value}))
    const onBoardChange = (e: any, value: number) => setSearchState(state => ({...state, board: value}))
    const onSfbChange = (e: any, value: number[]) => setSearchState(state => ({...state, sfb: value}))
    const onSubmit = () => {}

    return (
        <Stack>
            <TextField variant="outlined" value={searchState.query} onChange={onQueryChange} />
            <Select
                value={searchState.board}
                label="Board Type"
                onChange={onBoardChange}
            >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={CminiBoardType.Staggered}>Staggered</MenuItem>
                <MenuItem value={CminiBoardType.Ortho}>Orthogonal</MenuItem>
                <MenuItem value={CminiBoardType.Mini}>Mini</MenuItem>
            </Select>
            <Slider
                getAriaLabel={() => 'Single Finger Bigrams (SFB)'}
                value={searchState.sfb}
                onChange={onSfbChange}
                step={0.1}
                valueLabelDisplay="on"
                min={constraints.sfb[0]}
                max={constraints.sfb[1]}
            />
            <Button onClick={onSubmit} />
        </Stack>  
    )
}