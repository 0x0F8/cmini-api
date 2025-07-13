import { progressRange } from "@/util/math";
import ColoredProgressChip from "./ColoredProgressChip";

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
}: {
  colors: string[];
  ratio: number;
  min: number;
  max: number;
  reverse?: boolean;
}) {
  const p = progressRange(ratio, min, max, 1);
  return (
    <ColoredProgressChip colors={colors} progress={p} invert reverse={reverse}>
      {getText(ratio)}
    </ColoredProgressChip>
  );
}
