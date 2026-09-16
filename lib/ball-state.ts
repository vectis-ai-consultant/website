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
// `aside` runs 0 -> 1 over the last phase, as room is made for the problems.
// How that room is made is a layout question, so the component decides it: on a
// wide screen the four cards ring the ball and it simply holds the centre, while
// on a phone there is no room beside it and the ball lifts out of the way.
export function ballState(progress: number, voices = 12) {
  const p = clamp(progress)

  // The act runs in two halves. The dive and the pull-back own the first ~48% —
  // about the same absolute scroll they had before the section was lengthened —
  // and the whole of the rest belongs to the ring of problems. That split is the
  // point of the length: four cards sharing one screen of scroll arrived on top of
  // each other, and the reveal read as a single pop rather than as four findings.
  const dive = smooth(p / 0.29)          // fall toward the surface
  const settle = smooth((p - 0.29) / 0.19) // then pull back to the resting frame
  // The arrivals share 0.485..0.738 and the departures 0.9..0.955, however many
  // there are, which leaves a hold of about 44vh with the whole cloud up — the
  // frame this act exists for, and the one that used to get four.
  const step = 0.253 / Math.max(1, voices - 1)
  const estep = 0.055 / Math.max(1, voices - 1)
  return {
    // Ends further out than the old side-by-side needed. The shell holds the centre
    // of the frame now, so the room for the ring and for the headline above it has
    // to come from distance rather than from moving the ball aside.
    radius: 3.2 + (2.9 - 3.2) * dive + (4.8 - 2.9) * settle,
    polar: 0.16 + (1.44 - 0.16) * smooth((p - 0.076) / 0.48),
    aside: smooth((p - 0.29) / 0.18),
    // The canvas starts as the shallow band the design crops it to, then opens
    // out to the full viewport as you dive in.
    frame: smooth(p / 0.253),
    hero: 1 - smooth(p / 0.164),
    // The Vectis V resolves inside the shell as the dive bottoms out, and
    // stays there: the second act pulls back to find the tools around it.
    mark: smooth((p - 0.19) / 0.164),
    leverage: smooth((p - 0.42) / 0.08),
    // The cloud fills as you scroll, then holds. The arrivals are spread over a
    // fixed stretch of the act and the departures over another, so the schedule is
    // the same shape whether there are twelve of them or the six a phone shows —
    // otherwise the phone spends most of a pinned screen on nothing happening.
    // 0.485 is where the camera's pull-back finishes, so the shell is at its
    // resting size before the first bubble lands, and each window is narrower than
    // the step between them, so no more than two are ever in flight.
    problems: Array.from({ length: voices }, (_, i) => smooth((p - 0.485 - i * step) / 0.045)),
    // Then they are taken back into the shell that has been sitting in the middle
    // of them all act — in reverse, newest first, so the cloud unwinds instead of
    // blinking out. Everything is gone by p=1, so the act hands over to an empty
    // frame and the second act opens on the ball alone.
    exit: Array.from({ length: voices }, (_, i) => smooth((p - 0.9 - (voices - 1 - i) * estep) / 0.045)),
    // The headline goes last, and it has to actually be last: it starts leaving
    // only once the final bubble has started to.
    headExit: smooth((p - 0.955) / 0.045),
    // What the shell does about it: one swell as the cards come in, back to
    // nothing by the end. A hump rather than a ramp, so it reads as an impact and
    // not as a fade-up — and, like everything else here, it is a function of
    // position, so scrolling back up plays it in reverse.
    flare: (() => { const e = smooth((p - 0.9) / 0.1); return 4 * e * (1 - e) })(),
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
    // Said against the held frame, and then gone. The caption owns the act's
    // opening — the shell at its closest with nothing else in the frame — and
    // clears out as the deck arrives, so the cards never share the picture with
    // it and never have to be squeezed around it. A move in time rather than in
    // space, which is what the rest of this page is made of. It keeps its place
    // at the foot of the frame; only the schedule moved.
    copy: smooth((p - 0.015) / 0.05) * (1 - smooth((p - 0.115) / 0.045)),
    // --- the four things we actually sell, on a deck that scrolls sideways ---
    // Act one is a dozen voices saying what is broken; this is the act that
    // answers them, and the answers are a list. A list needs every item legible
    // on its own and still needs to say how many there are, and the frame has no
    // room beside the shell to lay four of them out — the camera comes in to 2.9
    // until `frame`, so the shell fills the height. So the deck moves instead of
    // the layout: vertical scroll drives it sideways across the held shell, one
    // card in the middle at a time with its neighbours either side.
    //
    // `deck` is the whole thing: which card is in the middle, fractional. It is
    // three eased moves rather than one ramp, so each card is still for a moment
    // before the next one comes — a linear track never lets you read anything.
    deck: deckAt(p),
    // How much of the frame each card gets, falling off with its distance from
    // the middle. The neighbours stay legible enough to say there are four; the
    // ones beyond them are gone. Cards leave with the caption at 0.93.
    // Falls off half as fast as it did with four. These cards are a name and one
    // line rather than a name, a paragraph and an instrument panel, so five of them
    // can be on screen without the frame becoming a wall of type — and five is the
    // point: the reader is scanning for their own trade, not reading all eight.
    cards: Array.from({ length: DECK }, (_, i) =>
      Math.max(0, 1 - Math.abs(i - deckAt(p)) * 0.34) * (1 - smooth((p - 0.93) / 0.07))),
    deckIn: smooth((p - 0.13) / 0.045) * (1 - smooth((p - 0.74) / 0.09)),
    ease: smooth((p - 0.06) / 0.14),
    // Radians, monotonic in scroll. Fast enough that the ring is visibly
    // turning while the camera holds still — at the old rate the back half of
    // the act read as a stalled picture.
    spin: p * 6,
    // Both moved later and tightened to give the deck the middle of the act. The
    // tools are the hand-over to act three, not a second list competing with the
    // first: they arrive once the deck is done at 0.60 and are up before the
    // caption starts to leave at 0.93.
    frame: smooth((p - 0.72) / 0.2), // only then does the camera back off
    ring: smooth((p - 0.76) / 0.18),   // far enough to hold the ring of tools
  }
}

// Where the deck has got to along its own track, in cards: 0 is the first card
// in the middle of the frame, 3 is the last. Three overlapping eased moves with
// a rest between each, so the thing dwells on a card instead of sliding past it.
// Pure in p like everything else, so scrolling back up runs the deck backwards.
export const DECK = 8

// Where the deck has got to along its own track, in cards: 0 is the first card in
// the middle of the frame, DECK-1 is the last. One eased move per gap with a rest
// between each, so the thing dwells on a card instead of sliding past it. Pure in
// p like everything else, so scrolling back up runs the deck backwards.
//
// The arithmetic, because it is what decides whether the thing is readable AND
// whether it is smooth — which turned out to be the same number. The track is 0.48
// of a 230vh act, so about 110vh for DECK-1 moves and DECK rests. The widths below
// solve (DECK-1)*W + (DECK-2)*REST = 1 with W = 0.10 and REST = 0.05, which puts a
// move at about 11vh and a rest at about 5.5vh — roughly 99px and 50px of scroll at
// 900 tall.
//
// The act was 170vh and the track 0.36 of it when the cards were small. Both grew
// for the same reason: a move slides one whole card across the frame, so the bigger
// the card the more scroll the move needs to not read as a lurch. At 436px of card
// against 55px of scroll the ratio was about 8:1 and a single wheel notch threw the
// deck nearly two cards; it is about 4.4:1 now. Damping the deck would have been
// the cheap fix and it is not available: ADR-0004 makes the scroll the timeline, so
// what you see may not depend on how long ago you scrolled.
export function deckAt(progress: number) {
  const t = clamp((clamp(progress) - 0.2) / 0.48)
  const W = 0.10, STEP = 0.15
  let at = 0
  for (let i = 0; i < DECK - 1; i++) at += smooth((t - i * STEP) / W)
  return at
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
    // After the thing is built, not during. The shell shattering, the dust
    // gathering and the plank going solid are one continuous move and they are
    // what the act is for; a caption over the top of them is a second thing to
    // read while the first is still happening. `solid` completes at 0.58, so the
    // first line starts at 0.56 — the lever exists by the time it is named, and
    // the words are still up for the tools landing, the tip and the launch.
    // A line at a time, and three windows off the same position, so scrolling
    // back up takes the lines away in reverse.
    copy: [
      smooth((p - 0.56) / 0.1),
      smooth((p - 0.62) / 0.11),
      smooth((p - 0.68) / 0.12),
    ],
  }
}
