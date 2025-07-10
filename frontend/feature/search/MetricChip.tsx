import ColoredChip from "@frontend/components/ColoredChip";
import { progressRange } from "@util/math";
import { format } from "@util/string";

export default function MetricChip({
  children,
  min,
  max,
  decimals = 1,
  colors,
}: {
  children: number;
  min: number;
  max: number;
  decimals?: number;
  colors: string[];
}) {
  const p = progressRange(children, min, max);
  return (
    <ColoredChip progress={p} colors={colors}>
      {format(children, decimals)}
    </ColoredChip>
  );
}
