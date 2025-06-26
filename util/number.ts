export function rangeProgress(progress: number, start: number, end: number) {
    let p = progress;
    if (p > 1) p = 1
    if (p < 0) p = 0
    if ( start < end ) {
        return start + (end - start) * progress
    } else {
        return start + (start - end) * progress
    }
}