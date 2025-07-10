import { rangeProgress } from "./math";

export function gradientValue(
  progress: number,
  startColor: string,
  endColor: string,
) {
  let p = progress;
  if (p > 1) p = 1;
  if (p < 0) p = 0;
  const [r1, g1, b1] = hexToRgb(startColor);
  const [r2, g2, b2] = hexToRgb(endColor);

  const r3 = rangeProgress(progress, r1, r2);
  const g3 = rangeProgress(progress, g1, g2);
  const b3 = rangeProgress(progress, b1, b2);
  return rgbToHex([r3, g3, b3]);
}

export function gradientValueFromArray(progress: number, colors: string[]) {
  if (colors.length === 0) {
    return undefined;
  }
  if (colors.length === 1) {
    return colors[0];
  }

  let p = progress;
  if (p > 1) p = 1;
  if (p < 0) p = 0;

  if (p === 1) {
    return colors[colors.length - 1];
  }

  const interval = 1 / (colors.length - 1);
  let localProgress = 0;
  let startIndex = 0;
  let endIndex = 1;
  for (let i = 0; i < colors.length - 1; i++) {
    const current = i * interval;
    const next = (i + 1) * interval;

    if (progress < next && progress >= current) {
      startIndex = i;
      endIndex = i + 1;
      localProgress = (progress - current) / (next - current);
      break;
    }
  }

  const startColor = colors[startIndex];
  const endColor = colors[endIndex];
  return gradientValue(localProgress, startColor, endColor);
}

export function hexToRgb(hex: string) {
  let h = hex.replace("#", "");
  const color: number[] = [];
  color[0] = parseInt(h.trim().substring(0, 2), 16);
  color[1] = parseInt(h.trim().substring(2, 4), 16);
  color[2] = parseInt(h.trim().substring(4, 6), 16);
  return color;
}

export function rgbToHex(rgb: number[]) {
  return (
    "#" +
    Math.round(rgb[0]).toString(16).padStart(2, "0") +
    Math.round(rgb[1]).toString(16).padStart(2, "0") +
    Math.round(rgb[2]).toString(16).padStart(2, "0")
  ).toUpperCase();
}
