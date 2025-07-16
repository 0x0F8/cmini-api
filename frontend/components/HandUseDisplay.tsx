import { progressRange } from "@/util/math";
import ColoredProgressChip from "./ColoredProgressChip";
import { Box, Stack } from "@mui/material";
import MetricChip from "./MetricChip";

function getLeanText(value: number) {
  if (value >= -2 && value <= 2) {
    return "even";
  } else if (value < 0) {
    return "left";
  }
  return "right";
}

function getIntensityText(value: number) {
  const abs = Math.abs(value);
  if (abs <= 2) {
    return "";
  } else if (abs <= 4) {
    return "leans";
  } else if (abs <= 8) {
    return "heavy";
  }
  return "mostly";
}

export default function HandUseDisplay({
  colors,
  min,
  max,
  left,
  right,
  showText = false,
}: {
  colors: string[];
  left: number;
  right: number;
  min: number;
  max: number;
  showText?: boolean;
}) {
  const v = right - left;
  const p = progressRange(v, min, max);
  const intensity = getIntensityText(v);
  const lean = getLeanText(v);
  const space = Boolean(intensity) ? " " : "";
  return (
    <Stack flexDirection="column">
      <MetricChip
        min={min}
        max={max}
        colors={colors}
        decimals={0}
        adorn={v < 2 && v > -2 ? "none" : v < 0 ? "left" : "right"}
      >
        {v}
      </MetricChip>
      {showText && (
        <ColoredProgressChip colors={colors} progress={p} textOnly>
          {intensity}
          {space}
          {lean}
        </ColoredProgressChip>
      )}
    </Stack>
  );
}
