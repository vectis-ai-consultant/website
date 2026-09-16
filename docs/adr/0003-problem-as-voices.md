# 3. The problem is a dozen voices, not four panels

Date: 2026-09-15

## Status

Accepted. Supersedes the card layout of [ADR-0001](0001-problem-ring.md); the rest of
that record — one act, one ball, reveal by distance, the beige accent, the content
boundaries, and the exit into the shell — still stands.

## Context

ADR-0001 put four detailed panels around the ball: a sentence, three mock UI rows with
one marked as failing, and a cost figure. It was specific and it was dense, and it was
also four objects on a screen that each needed to be read in full before the next one
arrived.

The brief changed. The user sent a recording of another site — a dark hero, one big
question, and a dozen short first-person friction lines ("my ads don't bring in sales",
"I run my whole business on spreadsheets") scattered across the page and drifting — and
asked for this section to work like that, with each line wrapped in a chat bubble.

That is a different claim about the problem. Four panels say *here are four categories
of symptom, examined*. A dozen voices say *this is what the day sounds like* — which is
the thing a reader recognises about their own week, and it is recognition rather than
analysis that this act is for. The analysis is what the services section is.

## Decision

**Twelve short lines, each in a chat bubble, ringed around the ball.** First person,
because that is who says them. A tail on every bubble, because a tail is what makes a
sentence something said rather than something written down.

**The specificity moves into the sentences rather than being dropped.** "0 of 3 AI
answers mention us", "answered next morning — fifteen hours later", "three days, and
still nobody has replied". The figures that carried the old cards are still here; they
are just said out loud instead of set in a panel.

**Which means ADR-0001's content boundary needs restating, not repeating.** There, the
rule was that every figure is a measurement of the illustration on screen — and it was
enforceable because you could count the rows the figure referred to. There is no
illustration now, so that sentence would be a justification for something that no
longer exists. The rule that replaces it: *a figure may describe the speaker's own
situation, and may never read as a result.* "three days, and still nobody has replied"
is a complaint about a state; "replies went up 40%" would be an outcome claimed on
someone's behalf, and that is the thing ADR-0001 exists to keep out. Nothing here is
attributed to anyone, and nothing here is a number we have measured. On the same
grounds the reference's live counter and per-line vote counts were not copied: a
running total of diagnoses is a claim about us, not a complaint by a speaker.

**Each bubble is anchored by the edge nearest the screen, not by its middle.** These
are sentences of very different lengths; a centred bubble hangs off the side of the
screen as soon as its sentence is long. `--ex` — its own way back to the middle of the
frame, where the ball is — is derived from that anchor, so the exit still lands every
bubble on the shell at any width without anything knowing the layout.

**The drift is the one thing here that is not the scroll, and it is ambient.** The
standing rule is that the scroll is the timeline, and every structural beat still obeys
it: arrival (`--p1..--p12`), departure (`--e1..--e12`), the shell's flare and the
headline all come from `ballState()` and all reverse on the way back up. The drift
carries no state — it says nothing, and removing it would lose no information. It runs
on two nested elements with two different periods (a four-waypoint `translate` on one,
a `rotate` sway on the other), each on its own CSS property so neither touches the
`transform` the scroll is writing, and every bubble starts part-way through its own
cycle via a negative delay. A single loop, however you vary the period, reads as one
object breathing; two compound into a path that takes minutes to come round.

**The motion parameters are seeded from the line's own text.** `Math.random()` here is
a hydration mismatch and a different page on every reload. An FNV-1a hash of the
sentence gives motion that looks unplanned and is identical on the server, in the
browser, and between visits.

**Twelve in flight is a stream, not a shower.** Arrival windows are
`smooth((p - 0.485 - i*0.026) / 0.05)`: 0.485 is where the camera's pull-back finishes,
so the shell is at its resting size before the first bubble lands, and the width is at
most twice the stagger, so no more than two are ever moving at once.

## Consequences

- The mock UI rows and the beige failing-row signal are gone. That accent still exists
  in the tokens and is now unused on this page; it has not been deleted.
- The phone gets the first six as a static thread, not a drifting cloud: eight pixels
  of gap against a thirty-pixel float is bubbles landing on each other, and a dozen
  bubbles do not fit a phone under the ball. `ballState` takes a voice count
  for the same reason `leverState` takes a tile count, and the scene passes six on a
  narrow screen: six running the twelve-voice schedule land a third of the way in and
  leave most of a pinned act with nothing happening in it.
- `prefers-reduced-motion` shows all twelve, still, in a wrapped row.
- The tests moved from "four cards, strictly one at a time" to "twelve voices as a
  stream, at most two in flight" — the same class of behavioural assertion.

## Alternatives rejected

**Keeping the four cards and adding a drifting cloud around them.** Both readings of
the problem on one screen, which is two screens of information and no hierarchy.

**Genuinely random placement and motion per load.** More faithful to a real feed, but
it makes the page unrepeatable — no screenshot means anything, no bug is reproducible,
and server and client disagree on the first paint.

**Deriving the ring from an angle and a radius** instead of twelve hand-placed pairs.
Tidier to read, but a bubble's size depends on the length of its sentence, and an even
angular sweep puts the longest sentence wherever the maths lands it.

This one is worth being honest about, because ADR-0001 found the opposite in a similar
place: positions measured in width, against a ball that scales with height, stopped
reading as a ring past about 1600px, and the fix there was to anchor to the centre
line. These positions are percentages of width. The difference is size — a card was
~350px of a 1440px screen, a bubble is a phrase — and it was checked rather than
assumed: at 2560×1440 the cloud still reads as a ring around the shell, with the
nearest bubble 618px from the centre against a shell radius of ~345px. 1366×768 through
2560×1440 are clear of overflow and of collisions. Past that the finding in ADR-0001
should be expected to apply, and the fix is the one it prescribes.
