import { progressRange } from "@/util/math";
import ColoredProgressChip from "./ColoredProgressChip";
import { Stack } from "@mui/material";
import MetricChip from "./MetricChip";

function getText(value: number) {
  if (value > 0.95 && value < 1.05) {
    return "even";
  } else if (value < 1) {
    return "outward";
  }
  return "inward";
}

export default function RollRatioDisplay({
  colors,
  min,
  max,
  ratio,
  reverse,
  showText = false,
}: {
  colors: string[];
  ratio: number;
  min: number;
  max: number;
  reverse?: boolean;
  showText?: boolean;
}) {
  const p = progressRange(ratio, min, max, 1);
  const isInward = ratio < 1;
  return (
    <Stack>
      <MetricChip
        min={min}
        max={max}
        colors={colors}
        decimals={2}
        center={1}
        reverse
        adorn={isInward ? "right" : "left"}
      >
        {ratio}
      </MetricChip>
      {showText && (
        <ColoredProgressChip
          colors={colors}
          progress={p}
          textOnly
          reverseColors={reverse}
        >
          {getText(ratio)}
        </ColoredProgressChip>
      )}
    </Stack>
  );
}
