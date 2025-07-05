"use client";

import { MenuItem, Slider, Stack, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import { CminiBoardType } from "@backend/cmini/types";
import { SearchConstraints } from "./types";
import useSearchState from "@frontend/hooks/useSearchState";

export default function SearchForm({
  constraints,
  keySearchForm,
}: {
  constraints: SearchConstraints;
  keySearchForm: React.ReactElement;
}) {
  const { query, board, sfb, setSfb, setBoard, setQuery, empty, valid } =
    useSearchState();

  const onQueryChange = (e: any) => setQuery(e.target.value);
  const onBoardChange = (e: any) => setBoard(e.target.value);
  const onSfbChange = (_: any, values: number[]) => setSfb(values);

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
    </Stack>
  );
}
