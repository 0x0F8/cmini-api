"use client";

import {
  InputLabel,
  MenuItem,
  Slider,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { CminiBoardType } from "@backend/cmini/types";
import { SearchConstraints } from "./types";
import useSearchState from "@frontend/hooks/useSearchState";
import Checkbox from "@mui/material/Checkbox";

export default function SearchForm({
  constraints,
  keySearchForm,
  ...props
}: {
  constraints: SearchConstraints;
  keySearchForm: React.ReactElement;
} & StackProps) {
  const {
    query,
    board,
    sfb,
    sfs,
    setSfs,
    setSfb,
    setBoard,
    setQuery,
    setThumbsOnly,
    empty,
    valid,
  } = useSearchState();

  const onQueryChange = (e: any) => setQuery(e.target.value);
  const onBoardChange = (e: any) => setBoard(e.target.value);
  const onSfbChange = (_: any, values: number[]) => setSfb(values);
  const onSfsChange = (_: any, values: number[]) => setSfs(values);
  const onThumbsChange = (_: any, values: boolean) => setThumbsOnly(values);

  return (
    <Stack {...props}>
      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Search</Typography>
          </Stack>
        </Stack>
        <TextField variant="outlined" value={query} onChange={onQueryChange} />
      </Stack>
      {/* <Select
        value={board || CminiBoardType.None}
        label="Board Type"
        onChange={onBoardChange}
      >
        <MenuItem value={CminiBoardType.None}>All</MenuItem>
        <MenuItem value={CminiBoardType.Staggered}>Staggered</MenuItem>
        <MenuItem value={CminiBoardType.Ortho}>Orthogonal</MenuItem>
        <MenuItem value={CminiBoardType.Mini}>Mini</MenuItem>
      </Select> */}

      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Same Finger Bigrams (SFB)</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {sfb[0]}&nbsp;-&nbsp;{sfb[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          getAriaLabel={() => "Same Finger Bigrams (SFB)"}
          value={sfb}
          onChange={onSfbChange}
          step={0.01}
          min={constraints.sfb[0]}
          max={constraints.sfb[1]}
        />
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Same Finger Skipgrams (SFS)</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {sfs[0]}&nbsp;-&nbsp;{sfs[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          getAriaLabel={() => "Same Finger Skipgrams (SFS)"}
          value={sfs}
          onChange={onSfsChange}
          step={0.01}
          min={constraints.sfs[0]}
          max={constraints.sfs[1]}
        />
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row">
          <Stack alignItems="center" justifyContent="center">
            <Typography>Uses Thumbs</Typography>
          </Stack>

          <Stack alignItems="center">
            <Checkbox onChange={onThumbsChange} />
          </Stack>
        </Stack>
      </Stack>
      {keySearchForm}
    </Stack>
  );
}
