# 6. The third act's caption waits for the machine to exist

Date: 2026-09-15

## Status

Accepted. Supersedes the timing clause of
[ADR-0002](0002-lever-caption-on-top.md) only — the band the caption takes, the
camera hand-over, and the line-at-a-time arrival all still stand, as does the
scroll-is-the-timeline rule.

## Context

ADR-0002 put act three's three lines at 0.02 / 0.07 / 0.14 and recorded the reason:
"All three are up well before the first tile lands, so the caption is readable while
the beam it describes is still assembling." That was the right call against the risk it
was solving — a silent stretch between act two giving up its caption and act three
finding its own.

Watching it, the cost is larger than the risk. The shell shattering, the dust flying
out, the dust falling into the volume of the beam and the beam going solid is one
continuous move and it is the thing the act exists to show. A headline over the top of
it is a second thing asking to be read while the first is still happening, and the
words win — they are words. The machine gets built behind a caption nobody is watching.

The user's instruction was direct: show the title after the leverage is built.

## Decision

**The caption arrives once the lever exists.** `leverState.copy` moves from
0.02 / 0.07 / 0.14 to **0.56 / 0.62 / 0.68**. `solid` — the dust handing over to a real
plank — completes at 0.58, so the first line starts as the beam becomes a beam.

The lines are still three windows off the same scroll position, still a line at a time,
still reversible. Only the offsets moved.

The words are up for the whole second half of the act: the tools land from 0.60, the
beam tips from 0.64, the rocket goes at 0.86. So the caption is read against a finished
machine being loaded, which is what it is about — "a little leverage, everything else
moves" is a claim about a lever under load, not about dust.

## Consequences

Act three now opens in silence, for a little over half its length. That is the cost
ADR-0002 was avoiding, and it is accepted rather than hidden: the assembly is worth
watching without a caption on it, and act two's caption is still on screen for part of
it — act two's sticky is pulled a full viewport into act three's.

ADR-0002's test, "the caption is up before the machine it describes is built", asserted
the behaviour this reverses. It is replaced by "the caption waits for the machine it
names to exist", which pins the other end: the first line may not start before `solid`
completes, it must be fully up by the time the beam tips, and all three must have
finished arriving by the end of the act.

## Alternatives rejected

**Splitting the caption — eyebrow early, headline late.** The eyebrow is the act's
number and title; putting it up alone reads as a heading with nothing under it for half
a screen, which is worse than either whole option.

**Fading the caption out during the build and back in after.** Two arrivals for one
caption. The scroll is the timeline, so this would be legible and reversible, but it
says the words twice and neither time is the moment.
