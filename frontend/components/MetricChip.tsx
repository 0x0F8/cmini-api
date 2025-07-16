import ColoredProgressChip from "@/frontend/components/ColoredProgressChip";
import { progressRange } from "@util/math";
import { format } from "@util/string";

export default function MetricChip({
  children,
  min,
  max,
  decimals = 1,
  colors,
  reverse,
  center,
  adorn = "none",
}: {
  children: number;
  min: number;
  max: number;
  decimals?: number;
  colors: string[];
  reverse?: boolean;
  center?: number;
  adorn?: "left" | "right" | "none";
}) {
  const p = progressRange(children, min, max, center);
  return (
    <ColoredProgressChip
      progress={p}
      colors={colors}
      reverseColors={reverse}
      adorn={adorn}
    >
      {format(children, decimals)}
    </ColoredProgressChip>
  );
}
