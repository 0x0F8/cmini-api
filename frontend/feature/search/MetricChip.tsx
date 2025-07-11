import ColoredChip from "@frontend/components/ColoredChip";
import { progressRange } from "@util/math";
import { format } from "@util/string";

export default function MetricChip({
  children,
  min,
  max,
  decimals = 1,
  colors,
  reverse,
}: {
  children: number;
  min: number;
  max: number;
  decimals?: number;
  colors: string[];
  reverse?: boolean;
}) {
  const p = progressRange(children, min, max);
  return (
    <ColoredChip progress={p} colors={colors} reverse={reverse}>
      {format(children, decimals)}
    </ColoredChip>
  );
}
