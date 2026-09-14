export const clamp = (n: number) => Math.max(0, Math.min(1, n))
export const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }

// The hero ball is driven by scroll position, never by elapsed time, so the
// whole move replays exactly in reverse when you scroll back up.
//
//   p=0        p≈0.5            p=1
//   upper view  zoomed in        side by side
//   camera high  camera close     camera level, ball pushed right
//
// `polar` is the angle down from straight overhead: 0 is looking at the top of
// the ball, PI/2 is looking at its equator. `radius` is the camera distance.
// `aside` runs 0 -> 1 over the last phase, as the ball moves out of the centre
// to make room for the copy. Which direction it moves is a layout question, so
// the component decides it: right on a wide screen for the side-by-side the old
// hero used, up on a phone where there is no room beside it.
export function ballState(progress: number) {
  const p = clamp(progress)
  const dive = smooth(p / 0.46)          // fall toward the surface
  const settle = smooth((p - 0.5) / 0.5) // then pull back to the resting frame
  return {
    // The dive bottoms out where the ball still fits the frame. Going closer
    // crops it into a featureless wall, and the zoom is carried by the canvas
    // opening out (--frame) and the swing overhead-to-level anyway.
    radius: 3.2 + (2.9 - 3.2) * dive + (4.15 - 2.9) * settle,
    polar: 0.16 + (1.44 - 0.16) * smooth((p - 0.12) / 0.76),
    aside: smooth((p - 0.58) / 0.42),
    // The canvas starts as the shallow band the design crops it to, then opens
    // out to the full viewport as you dive in.
    frame: smooth(p / 0.4),
    hero: 1 - smooth(p / 0.26),
    // The Vectis V resolves inside the shell as the dive bottoms out, and
    // stays there: the second act pulls back to find the tools around it.
    mark: smooth((p - 0.3) / 0.26),
    leverage: smooth((p - 0.66) / 0.28),
  }
}

// The two acts that follow the hero obey the same rule as the hero itself:
// every value is a pure function of where the section sits in the viewport,
// never of elapsed time, so scrolling back up runs the machine in reverse.

// --- 02 · the mark and the tools it works with ----------------------------
// The ball comes back to the middle, the Vectis V resolves inside it, and the
// tools circle it. `spin` is a plain multiple of progress rather than an eased
// curve on purpose: the ring keeps turning for as long as you keep scrolling,
// which is the whole point of the section.
export function orbitState(progress: number) {
  const p = clamp(progress)
  return {
    centre: smooth(p / 0.2),        // the ball comes back from its side-by-side spot
    // and the camera goes all the way in behind it, then holds there. The shell
    // filling the frame is the still the act is built around: it is where the
    // problem gets stated, so it lasts half the section rather than a moment,
    // and the tools are kept out of it.
    close: smooth(p / 0.2),
    mark: smooth((p - 0.1) / 0.32), // the V fades up inside the shell
    // The problem, told against that held frame.
    copy: smooth((p - 0.22) / 0.16) * (1 - smooth((p - 0.93) / 0.07)),
    // Radians, monotonic in scroll. Fast enough that the ring is visibly
    // turning while the camera holds still — at the old rate the back half of
    // the act read as a stalled picture.
    spin: p * 6,
    frame: smooth((p - 0.52) / 0.34), // only then does the camera back off
    ring: smooth((p - 0.56) / 0.3),   // far enough to hold the ring of tools
  }
}

// --- 03 · the ball breaks, and becomes the leverage -----------------------
// The shell shatters and its dust flies outward. The same dust then falls into
// the volume of a beam and hands over to a solid plank. The mark turns 180°
// underneath it: the V becomes the Λ fulcrum. Then the tools land on the short
// arm, the beam tips, and the rocket goes.
export function leverState(progress: number, tiles = 8) {
  const p = clamp(progress)
  return {
    shatter: smooth(p / 0.24),          // shell fades out, dots fly apart
    flip: smooth((p - 0.12) / 0.36),    // V turns over and drops into place
    gather: smooth((p - 0.3) / 0.22),   // the dust falls into the beam
    solid: smooth((p - 0.46) / 0.12),   // and hands over to a real plank
    tiles: Array.from({ length: tiles }, (_, i) => smooth((p - 0.6 - i * 0.026) / 0.085)),
    tilt: smooth((p - 0.64) / 0.24),    // the beam tips under the load
    launch: smooth((p - 0.86) / 0.14),  // and the rocket leaves
    pull: smooth((p - 0.06) / 0.55),    // camera settles on the whole machine
    // Early, so there is no silent stretch between this act's caption and the
    // one the second act just gave up.
    copy: smooth((p - 0.02) / 0.14),
  }
}
