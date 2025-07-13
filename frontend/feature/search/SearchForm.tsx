"use client";

import {
  InputLabel,
  MenuItem,
  Slider,
  Stack,
  StackProps,
  Switch,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { SearchConstraints } from "./types";
import useSearchState from "@frontend/hooks/useSearchState";

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
    randomize,
    sfb,
    sfs,
    fsb,
    redirect,
    pinkyOff,
    alternate,
    roll,
    rollRatio,
    handUse,
    thumbsOnly,
    setSfs,
    setSfb,
    setFsb,
    setRedirect,
    setPinkyOff,
    setAlternate,
    setRoll,
    setRollRatio,
    setLeftHand,
    setRightHand,
    setBoard,
    setQuery,
    setRandomize,
    setThumbsOnly,
  } = useSearchState();

  const onQueryChange = (e: any) => setQuery(e.target.value);
  const onBoardChange = (e: any) => setBoard(e.target.value);
  const onSfbChange = (_: any, values: number[]) => setSfb(values);
  const onSfsChange = (_: any, values: number[]) => setSfs(values);
  const onFsbChange = (_: any, values: number[]) => setFsb(values);
  const onRedirectChange = (_: any, values: number[]) => setRedirect(values);
  const onPinkyOffChange = (_: any, values: number[]) => setPinkyOff(values);
  const onAlternateChange = (_: any, values: number[]) => setAlternate(values);
  const onRollChange = (_: any, values: number[]) => setRoll(values);
  const onRollRatioChange = (_: any, values: number[]) => setRollRatio(values);
  // const onLeftHandChange = (_: any, values: number[]) => setLeftHand(values);
  // const onRightChange = (_: any, values: number[]) => setRightHand(values);
  const onThumbsChange = (_: any, values: boolean) => setThumbsOnly(values);
  const onRandomizeChange = (_: any, values: boolean) => setRandomize(values);

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
          value={sfb}
          onChange={onSfbChange}
          step={0.01}
          min={constraints.sfb.min}
          max={constraints.sfb.max}
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
          value={sfs}
          onChange={onSfsChange}
          step={0.01}
          min={constraints.sfs.min}
          max={constraints.sfs.max}
        />
      </Stack>

      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Full Scissor Bigrams (FSB)</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {fsb[0]}&nbsp;-&nbsp;{fsb[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          value={fsb}
          onChange={onFsbChange}
          step={0.01}
          min={constraints.fsb.min}
          max={constraints.fsb.max}
        />
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Redirects</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {redirect[0]}&nbsp;-&nbsp;{redirect[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          value={redirect}
          onChange={onRedirectChange}
          step={0.01}
          min={constraints.redirect.min}
          max={constraints.redirect.max}
        />
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Pinky Off</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {pinkyOff[0]}&nbsp;-&nbsp;{pinkyOff[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          value={pinkyOff}
          onChange={onPinkyOffChange}
          step={0.01}
          min={constraints.pinkyOff.min}
          max={constraints.pinkyOff.max}
        />
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Alternation</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {alternate[0]}&nbsp;-&nbsp;{alternate[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          value={alternate}
          onChange={onAlternateChange}
          step={0.01}
          min={constraints.alternate.min}
          max={constraints.alternate.max}
        />
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Rolls</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {roll[0]}&nbsp;-&nbsp;{roll[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          value={roll}
          onChange={onRollChange}
          step={0.01}
          min={constraints.roll.min}
          max={constraints.roll.max}
        />
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="center">
            <Typography>Roll Ratio</Typography>
          </Stack>
          &nbsp;
          <Stack justifyContent="flex-end">
            <Typography variant="body2">
              {rollRatio[0]}&nbsp;-&nbsp;{rollRatio[1]}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          value={rollRatio}
          onChange={onRollRatioChange}
          step={0.01}
          min={constraints.rollRatio.min}
          max={constraints.rollRatio.max}
        />
      </Stack>
      {/* TODO: hand use */}
      <Stack my={1}>
        <Stack flexDirection="row">
          <Stack alignItems="center" justifyContent="center">
            <Typography>Uses Thumbs</Typography>
          </Stack>

          <Stack alignItems="center">
            <Switch onChange={onThumbsChange} checked={thumbsOnly || false} />
          </Stack>
        </Stack>
      </Stack>
      <Stack my={1}>
        <Stack flexDirection="row">
          <Stack alignItems="center" justifyContent="center">
            <Typography>Randomize</Typography>
          </Stack>

          <Stack alignItems="center">
            <Switch
              onChange={onRandomizeChange}
              checked={randomize.length > 0}
            />
          </Stack>
        </Stack>
      </Stack>
      {keySearchForm}
    </Stack>
  );
}
