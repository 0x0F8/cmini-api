"use client";

import Cookies from "@frontend/Cookies";
import { Button, MenuItem, Slider, Stack, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import { useState } from "react";
import { CminiBoardType } from "@backend/cmini/types";
import { SearchFormState, SearchConstraints } from "./types";

export default function SearchForm({
  defaultState,
  constraints,
  onSubmit,
  keySearchForm,
  isValid,
}: {
  defaultState: SearchFormState;
  constraints: SearchConstraints;
  onSubmit: (args: SearchFormState) => void;
  keySearchForm: React.ReactElement;
  isValid: boolean;
}) {
  const [searchState, setSearchState] = useState<SearchFormState>(defaultState);
  const { query, board, sfb } = searchState;

  const onQueryChange = (e: any) =>
    setSearchState((state) => ({ ...state, query: e.target.value }));
  const onBoardChange = (event: any) => {
    const value = event.target.value;
    setSearchState((state) => ({ ...state, board: value }));
    Cookies.set("search-board", value);
  };
  const onSfbChange = (e: any, value: number[]) => {
    setSearchState((state) => ({ ...state, sfb: value }));
    Cookies.set("search-sfb", value.join(","));
  };

  const onSubmitInternal = () => onSubmit(searchState);

  return (
    <Stack>
      <TextField variant="outlined" value={query} onChange={onQueryChange} />
      <Select
        value={board || CminiBoardType.None}
        label="Board Type"
        onChange={onBoardChange}
      >
        <MenuItem value={CminiBoardType.None}>All</MenuItem>
        <MenuItem value={CminiBoardType.Staggered}>Staggered</MenuItem>
        <MenuItem value={CminiBoardType.Ortho}>Orthogonal</MenuItem>
        <MenuItem value={CminiBoardType.Mini}>Mini</MenuItem>
      </Select>
      <Slider
        getAriaLabel={() => "Single Finger Bigrams (SFB)"}
        value={sfb}
        onChange={onSfbChange}
        step={0.01}
        valueLabelDisplay="on"
        min={constraints.sfb[0]}
        max={constraints.sfb[1]}
      />
      {keySearchForm}
      <Button
        onClick={onSubmitInternal}
        variant="contained"
        disabled={!isValid}
      >
        Submit
      </Button>
    </Stack>
  );
}
