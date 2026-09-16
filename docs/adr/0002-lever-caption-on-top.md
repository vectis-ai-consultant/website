# 2. The third act's caption sits above its machine

Date: 2026-09-14

## Status

Accepted, with the caption's timing superseded by
[ADR-0006](0006-lever-caption-after-the-build.md): the three lines now arrive after the
beam is solid rather than before the first tile lands. Everything else here stands.

## Context

Acts 02 and 03 shared one caption treatment: `.act-copy`, pinned to the foot of the
frame on a scrim, fading in on a single value. That works for act 02, whose subject is
a ball and a ring of tiles held near the middle of the frame.

It does not work for act 03. Its subject is a lever — the widest, tallest thing in the
story, with tiles scattered along the beam on the way in and a stack plus a rocket on
it by the end. The tiles at the low end of the beam land exactly where the caption is,
so through the middle of the act the eyebrow was cut in half by the Shopify tile and
the headline had icons sitting on it. The act also read as one block appearing:
`copy: smooth((p - 0.02) / 0.14)` fades the eyebrow, the headline and the line beneath
it together, in 14% of the act, which on a scroll wheel is a single flick.

Act 01 already puts its headline at the top of the frame (`.pr-head`), for the same
reason — its subject holds the centre.

## Decision

**The third act's caption takes the top band, and the camera hands the band over.**
`.lever-copy` is anchored to the top with the scrim flipped, and act 03's `lookY`
target goes from level to above the machine, which drops the whole rig into the lower
two thirds of the frame. The caption no longer competes with the beam for the same
pixels; the beam gets the room it needs.

**The look-up is measured off the act's own camera distance, not fixed.** A phone
watches the beam from roughly twice as far back (the `far` term, which solves for a
distance that fits a four-unit beam at a narrow aspect), and at twice the distance a
world-space offset covers half as much of the frame. `far * 0.164` keeps the reserved
band the same fraction of the screen on every device.

**The caption arrives a line at a time.** `leverState.copy` is now three windows
instead of one — eyebrow (0.02–0.12), headline (0.07–0.19), body (0.14–0.27) — set as
`--lever-1..3`, and each line rises out of a blur on its own value. That is the problem
ring's reveal grammar reused, and it is still the same pure `state = f(scroll)`
machine, so scrolling back up takes the lines away in reverse. All three are up well
before the first tile lands, so the caption is readable while the beam it describes is
still assembling.

## Consequences

- Acts 01 and 03 caption from the top, act 02 from the foot. This is not an
  inconsistency to fix by rule: the band a caption takes is decided by where its
  subject sits in the frame, and act 02's subject sits high.
- `--lever` no longer exists; `--lever-1`, `--lever-2` and `--lever-3` replace it. The
  reduced-motion and phone blocks pin all three to 1.
- Two tests cover the new machine: the lines never cross, and all three are up before
  the first tile lands.

## Alternatives rejected

**Moving the tiles instead of the caption.** Their positions along the beam are the
illustration — a tile that avoids the words is a tile in the wrong place on the lever.

**Keeping the caption at the foot and raising the scrim.** It would have hidden the
collision rather than resolved it, and the bottom of the beam is where the load
gathers, which is the part of the machine the caption is describing.

**Staggering with a CSS transition-delay per line.** Half the cost, but it is a timer:
it would run once on arrival and not rewind on the way back up, and this codebase's
standing rule is that the scroll is the timeline.
