export function rangeProgress(progress: number, start: number, end: number) {
  let p = progress;
  if (p > 1) p = 1;
  if (p < 0) p = 0;
  if (start < end) {
    return start + (end - start) * progress;
  } else {
    return end + (start - end) * (1 - progress);
  }
}

export function progressRange(value: number, start: number, end: number) {
  let v = value;
  if (v < start) v = start;
  if (v > end) v = end;
  if (start < end) {
    return (value - start) / (end - start);
  } else {
    return (value - end) / (start - end);
  }
}
