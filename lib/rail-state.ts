// The four-step rail obeys the same rule as the three-act story: one scroll
// fraction drives the progress line and the active step, and nothing is derived
// from elapsed time — so scrolling back up replays the section in reverse.
const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

export function railState(progress: number, count: number) {
  const p = clamp(progress)
  return {
    fill: p,
    // Each step owns an equal slice of the list, so the slice the middle of the
    // viewport is sitting in is exactly the step you are reading.
    index: Math.min(count - 1, Math.floor(p * count)),
  }
}
