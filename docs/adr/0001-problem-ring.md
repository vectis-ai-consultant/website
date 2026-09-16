# ADR-0001: The problem is four symptoms around one ball, in one act

- Status: superseded in part by [ADR-0003](0003-problem-as-voices.md) — the
  four-card layout and the content-boundary wording are replaced there. The rest (one
  act, one ball, reveal by distance from one position-derived machine, the ball holding
  the centre, the exit into the shell) still stands.
- Date: 2026-09-14

## Context

The hero act closed on a single problem — leads waiting in a full inbox — shown as a
panel beside the ball. The owner's objection was that it is not the only problem, and
that the panel looked static and dated.

The first proposal here was a separate section with a list and a swapping panel,
copying the services section's interaction. The owner rejected the extra section:
*"Merge those four problems together into the same session. We don't need them to be
separate anymore. It has to be the same session, using the same animation and the same
ball. The only difference is that there will be different problems. We can do it by
distance, with four problems on each side of the ball: two on the right side, and two
on the left side."*

## Decision

**One act, one ball, four cards ringed around it** — two left, two right, arriving in
reading order (top-left, top-right, bottom-left, bottom-right) as the scroll runs.

**The reveal is by distance, from the same machine as everything else.** `ballState`
gains `problems`, four staggered `smooth()` ramps over one shared run. StoryScene
publishes them as `--p1` to `--p4`; the CSS only reads them. Scrolling back up clears
the ring, because nothing here is on a clock.

**The act is long enough to show them one at a time.** `--hero-h` went from 340vh to
480vh, and the act splits in two: the dive and the pull-back keep roughly the absolute
scroll they always had (the first ~48%), and the whole of the rest belongs to the ring.
Four cards sharing the last screen of scroll arrived on top of each other and the
reveal read as a single pop; each now owns about half a screen, and **the windows do
not overlap at all** — there is never more than one card in flight, with a deliberate
beat between them. Back to back they blur into one movement, which is the thing this
replaced.

**The pull-back finishes before the ring starts**, at p≈0.48, rather than still closing
as the first cards land. The resting radius went from 4.15 to 4.8 because the ball has
to sit *between* two columns rather than beside one.

**The cards are anchored to the centre line, not to the viewport edges.** The ball is
centred and its size follows viewport *height*, so edge-pinned cards opened a gutter
that grew with every extra pixel of width — past about 1600px the ring stopped reading
as a ring. `--gap` is the clearance from the centre to a card's inner edge: a little
more than the ball's half-width, and additionally bounded by the width actually left
over so a narrow desktop cannot push a card off screen.

**The ball holds the centre.** An earlier attempt made room by nudging it down; the
owner's correction — *"the buddle moved but it should stay in the centre"* — is the
rule. Room comes from distance and from the headline taking the band above, never
from moving the ball. `aside` therefore no longer drives x at all on a wide screen; it
still lifts the ball on a phone, where there is no room beside it either way.

**The cards loop, and each one loops the thing that is wrong with it.** The inbox
fills again, the answer is given again without you in it, the same three steps are
done again. Arrival is the card's job (`--p`) and the loop is the rows' job, so the
two never fight: the rows can run continuously underneath a card that has not arrived.
A sheen crosses each card a quarter-cycle behind the last, because four in unison
strobe.

**Every card says the same three things in the same three places:** what goes wrong
as a sentence, three rows of which exactly one is marked as the one that fails, and
the cost as a figure. Four cards that each made their point differently read as four
unrelated widgets — the operations card in particular looked like a process working,
which is the opposite of what it is for. The figure is always a measurement of the
rows above it (4m to 3d is three days; 18:42 to 09:15 is fifteen hours), never a claim
about a reader's business, so the block gets a hard number where the eye lands last
without inventing an outcome.

**The warm end of the range is beige, not orange.** One warm tone, defined once as
`--sand-deep` / `--sand` on `.ball-problems`: deep enough to carry type on a white card
(a true beige is unreadable at text size) and quiet enough not to become a second
accent competing with the blue.

**The four problems are the services section's own `replaces:` lines.** Problem and
answer are the same list read from opposite ends, so nothing is claimed here that the
page does not answer further down, and no metric is invented.

## Consequences

- `components/InboxStack.tsx` is gone; its inbox survives as the Sales card.
- `lib/ball-state.ts` stays the single source of the act's timing. Its tests were
  rewritten to assert behaviour rather than sample points: the old ones pinned the
  radius at p=0.48 and the aside at p=0.5, which encoded one particular cut of the act,
  so lengthening it for the ring broke four tests that nothing was actually wrong with.
  They now sweep the range — the deepest point is found rather than assumed, `aside`
  never goes backwards, hero copy and problem headline are never both up, and at most
  one card is ever in flight.
- Every loop is disabled under `prefers-reduced-motion`, stopped rather than hidden so
  the rows stay readable.
- The cards are presentational, so what people do with them is not observable. If that
  matters later, the hook is `data-slot` on each card; there is no analytics target in
  this app yet, so nothing is wired.

**The ring is a grid, not four corner-pinned boxes.** Each side is a pair, and a pair
has to read as one column of two. Pinning the top cards to the top of the stage and
the bottom cards to the bottom made the space between them a function of viewport
height: 24px on a 900-tall screen, 199px on an 1100-tall one, and negative — the cards
overlapping — below about 850. A three-column grid (card / centre channel / card) with
two rows, the top pair `align-self:end` and the bottom pair `align-self:start`, puts
exactly `row-gap` between them down both sides no matter how tall the screen is or how
much the four cards differ in height. The centre channel is `--gap * 2`, so the
clearance from the centre line is still the single number the ring is tuned by.

Short screens then need real compression rather than a bigger gap: two breakpoints on
viewport *height* (940px and 860px) tighten padding, row height and the headline. The
headline can only rise as far as the nav, which ends at 64px, so the remainder comes
out of the cards. Nothing is dropped or hidden on the way down — the phone layout,
which does stack and drop the rows, is a separate rule on width.

**The ring is taken back into the ball, one card at a time.** The act used to end by
simply unpinning: the cards were still at full opacity when the section scrolled off
the top, so the whole beat read as a page moving rather than as an act finishing. Two
things caused that. The window was 7% of the act (~34vh, one or two rendered frames at
real scroll speed), and — the actual defect — `.ball-problems` declared `--exit:0` in
its own rule, which shadowed the value `StoryScene` sets on `.story` for every card
inside it. The exit never ran at all. Scene channels are now declared once, on `.story`
with the rest of them, and nowhere else; a local default on a container that consumes
the channel is a silent override, not a fallback.

The replacement is not a longer fade. Each card converges on the shell that has been
sitting between them all act — `--ex` is the distance from the card's own centre to the
centre line, so it lands on the ball at any viewport — shrinking, turning slightly and
dissolving before it reaches it. They go in reverse order, last in first out, so the
ring unwinds; the shell answers with one swell (`flare`, a hump rather than a ramp, so
it reads as impact and is back at nothing by the handover); and the headline lifts away
last, once the ring it introduced has been swallowed. That is also the story: the four
problems go into Vectis, and act 02 opens on the ball alone to answer them.

## Alternatives rejected

**A separate problems section with a list and a swapping panel**, mirroring the
services section. More room per problem and one interaction language taught once, but
it adds a section to a page that already runs three pinned acts, and it splits the
problem away from the ball that the whole story is built on.

**Advancing the cards on a timer.** Simpler than a scroll ramp, but this codebase's
stated rule is that the scroll is the timeline, and a timer would desynchronise from
the ball moving behind it.

**Keeping the act at 340vh and just narrowing the four windows.** It would have fitted
them in without lengthening the page, but at ~20vh each the reveal is faster than a
scroll wheel's own granularity — two cards would still land in one flick.

**Keeping one problem and adding a grid of the rest.** Smallest change, but it ranks
one symptom above the others when the point is that a small team is hit by all four.
