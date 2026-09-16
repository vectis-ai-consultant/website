# 5. Act two names the four services

Date: 2026-09-15

## Status

Accepted. Narrows the copy scope of act two as described in
[ADR-0001](0001-problem-ring.md) and [ADR-0002](0002-lever-caption-on-top.md); the
scroll-is-the-timeline rule, the act order, and the content boundaries of ADR-0001 all
still stand.

## Context

Measured against a scrolled viewport, the homepage ran 17.4 screens and the first
mention of a service by name — the `#services` section — began 56% of the way down it.
Act one spends a full pinned act on a dozen voices saying what is broken; act two
answered them with a promise ("You bring the ambition. We bring the leverage.") and act
three with a machine. A visitor who bounced in the first two thirds of the page never
learned what the company sells.

The user's framing was blunt: the page is too long, and "we don't mention what kind of
service we have until the second half of the page, which is very not optimal for our
company planning page". Two rounds of alternative headline and eyebrow wordings were
built and rejected — the objection was never the words. It was that the section made a
claim instead of an offer.

## Decision

Act two names all four services, by name, against the held frame — before the camera
backs off and before the ring of tools arrives.

Four cards on a deck in the frame, one per service: a number, the service name, and the
single line describing what it takes off the client's plate. Vertical scroll drives the
deck sideways across the held shell, one card in the middle of the frame at a time with
its neighbours faint either side. The mechanism is in the Revision below; it replaced a
four-column row under the caption, which is what shipped first.

The description lines are the services' own `replaces` strings from `SYSTEMS` in
`lib/home-behaviors.ts`, condensed but not reworded. Two sections claiming different
things about the same service is the failure mode this guards against, and it keeps
ADR-0001's content boundary intact: nothing is claimed here that the services section
does not already say.

They arrive one at a time, in order, and the last is done by p = 0.60. Act one is a
dozen voices stating a problem; this is the act that answers them, so the answers have
to arrive as answers arrive — each legible on its own — rather than as a block of four
that the eye takes in as one grey shape. 0.60 is not arbitrary: the camera starts
backing off at 0.66 and the tools ring lands at 0.70, so the answer is complete while
the shell is still held.

The services now appear at roughly 22% down the page instead of 56%.

## Consequences

The eyebrow reads `02 — OUR SOLUTION` and the act is no longer a pure promise, so the
`#services` section further down is a second, fuller pass rather than the first mention.
Whether that section still earns its 4.7 screens is a separate question and is not
settled here.

The orbit scrim is anchored to the block's top padding (`--scrim`) rather than to a
percentage of the block, so the eyebrow always starts below the fade however tall the
block grows. That was needed when the services lived inside the caption and pushed its
top edge over the middle of the shell, where the mark is nearly black and the eyebrow
disappeared into it. The deck took the height back out, but the anchor stays: it is the
correct rule either way.

Act three's scrim moved to a `.lever-copy::before` gated on `--lever-1`. Act two's
sticky is pulled a full viewport into act three's (`#orbit .act-sticky` has
`margin-bottom:-100vh`), so a scrim that painted at all times covered the foot of act
two from wherever act three's sticky happened to sit — which is what was erasing the
service row. On a pseudo-element the three caption lines keep their own arrivals
instead of being multiplied by the scrim's.

### Revision: the four are a deck the scroll drives sideways

Two layouts were built and rejected before this one. The first was a four-column row
under the caption, which faded in without the story's blur and drew its hairlines over
four empty cells while it waited. The second gave the row the story's grammar and had
each cell travel out of the middle of the frame to its slot — [ADR-0001](0001-problem-ring.md)'s
exit reversed. Both were still a row at the foot of the caption, and that was the actual
problem: a block that tall needs a scrim 597px deep in a 720px frame, which whites out
the lower two thirds of the scene. The act read as two pages stacked, the canvas above
and a table below.

So the deck moves instead of the layout. Vertical scroll drives four cards sideways
across the held shell, one in the middle at a time with its neighbours either side.
`orbitState().deck` is the whole mechanism — which card is in the middle, fractional —
and `cards[i]` is how much of the frame each one has, falling off with its distance from
the middle. The track offset is worked out in CSS from `--deck` and the card width,
because the card width is a layout question and changes with the viewport.

`deck` is three eased moves with a rest between each rather than one ramp. A linear
track never lets you read anything, and the rests are what stop the deck sliding past
without ever being still.

How much rest, measured rather than asserted: the track is 0.30 of a 170vh act, so each
of the two middle rests is about 5.6vh, card one's is about 5vh and card four holds for
about 10vh. At 900 tall that is roughly 50px of scroll per card — enough to be still,
not enough to dwell. An earlier draft of this ADR claimed the rests are "what make it a
list of four rather than a blur going past"; at 50px that overstates them. Whether the
act should be lengthened to buy real dwell time is open, and it is the same question as
the page's total length — see the rejected alternative on looping the card thumbnails.

The deck is fully on screen before the track starts moving — up at 0.29, moving from
0.32. The first card is the only one with nothing before it to cover its arrival, so
when the fade-in overlapped the first move it was never seen at full prominence at all:
by the time the deck was solid the track had already carried card two into the middle,
and the act read as a list of three. Card one now gets a rest of its own, the same as
the other three.

Three things follow from it, and they are why this one works where the rows did not:

- **No side room is needed**, so the camera never has to back off and the held close-up
  survives. That is what ruled out ringing the cards (below).
- **The shell never leaves the frame**, so the field is continuous. The caption drops to
  eyebrow, headline and one line, and `--scrim` comes down from 150px to 104px.
- **All four are visible at once** — one being read, its neighbours faint beside it — so
  the section still says how many there are, which the one-at-a-time alternatives could
  not.

The camera looks down while the deck runs (`ease`, feeding `lookY` in StoryScene) so
the shell rides up out of the band the cards occupy and the mark stays readable above
them. `frame` and `ring` moved from 0.52/0.56 to 0.66/0.70 to give the deck the middle
of the act, and the deck clears at 0.78 — before the tools land.

The cards and the caption also have to stay out of each other. The deck's band sits at
50% of the frame rather than 58%, and the caption's foot padding came down from
`9vh + 26px` to `3.5vh + 22px`: with the service row gone the block was still reserving
the height the row used to need, which read as a slab of empty white under the last
line and pushed the scrim's opaque end up over the bottom third of every card.
Two lists on screen at once is two things asking to be read, and the tools are the
hand-over to act three, not a second answer.

### Each card is a thumbnail of the panel it points at

`#services` shows four mock UIs at full size — an SOP checklist with an approval gate,
platform chips and a posts-waiting bar, a chat exchange, a training format pair — and
animates them with `row-loop 7s ease infinite` and a hand-set `animationDelay` per row
(`app/home.css:5`). Each `.svc` card now carries a two-row still of the same mock UI,
built from the same content, so the deck reads as a contents page for that section
rather than as a second, competing one.

**It is built by the scroll, not by a timer.** Each row's arrival is a function of
`--a` — the card's own share of the frame, `--sys-N` — with a per-row offset, so the
still assembles as the card comes to the middle and takes itself apart as the card
leaves, and it runs backwards on the way back up like everything else in the story.

The arithmetic is why a loop was not an option. The track is 0.30 of a 170vh act, so a
card gets about 13vh of travel and about 6vh of rest — at 900 tall a rest is roughly
50px of scroll, well under a second of ordinary scrolling. A seven-second cycle would
never be seen through once, and what the reader saw would depend on how long they had
had the page open, which is the thing the scroll-is-the-timeline rule exists to
prevent.

**The still is a dark panel.** Two references settled the treatment: airev.us, whose
whole language is deep navy panels on light with hairline-bordered tag pills and one
accent used sparingly; and a near-black research band built from rules rather than
boxes, with letterspaced mono small-caps labels and outlined rather than filled
controls. A pale panel inside a pale card is two greys arguing. A deep one reads as a
screen — which is what it is a picture of — and it gives each card a centre of gravity.
So: a navy gradient panel, a header rule with a mono small-caps label, rows divided by
hairlines at 7.5% white, an outlined `Approve` rather than a filled slab, and the
waiting step marked by a lit left edge instead of a filled background.

One element is exempt: the live dot in the panel header. It passes
[ADR-0004](0004-dot-field.md)'s test for decoration verbatim — it reads nothing from the
story channels, carries no story information, and deleting it leaves the story
unchanged. A live dot blinks because live dots blink. Everything on the cards that says
something is scroll-built. It is switched off under `prefers-reduced-motion`.

The strips cost the card about 90px of height. That is paid for by the caption leaving
(below) rather than by cutting the description line — that line is the service's
`replaces` string and is the content boundary this ADR is built on.

### Revision: the caption says its line and leaves

The caption kept its place at the foot of the frame; what changed is when it is there.
`orbitState().copy` moved from 0.22–0.93 to **0.03–0.30**: it fades up over the held
shell at the top of the act, holds, and is gone before the deck's track starts at 0.32.
The two are now beats in sequence rather than two things sharing one picture.

Five placements were built and scrubbed side by side before this one — foot (as it
was), top band, middle-then-out, left column, and out of the act entirely. The client
picked the timing of the third and the position of the first.

What it buys is the whole frame, twice. The act opens on the close-up with the promise
under it — the still the act was originally built around — and then hands the entire
picture to the cards. So:

- The deck sits **dead centre** (`--deck-y:50%`) and the height-aware clamp is gone. It
  existed only to hold the cards clear of a caption that is no longer there when the
  cards are, and it was the thing forcing the deck high and top-heavy in the frame.
- There is no scrim over the cards at any point, at any viewport height. The card can
  be as tall as the frame allows rather than as tall as the leftovers allow, which is
  what paid for the thumbnails above.
- The two cross between 0.22 and 0.30, while the caption is fading down and the deck is
  fading up. They overlap in space on a short frame and it reads as a hand-over rather
  than a collision, because neither is at full strength during it.

### Revision: the deck takes the caption's band, and the shell gives up room

The cards sit at the **foot of the frame** — the band the caption has just left — rather
than across the middle of it. `--deck-b` anchors them to a fixed gap from the fold
instead of to a percentage, because what has to stay constant is that gap; everything
above belongs to the shell and the mark, which stay whole and uncovered for the entire
act. The promise dissolves and the cards take its place in the same part of the
picture, which is a swap rather than two things moving.

`lift` became **`ease`** and now drives two things on one schedule (0.24–0.62, the
length of the track): the camera's look-down, and a pull-back from 2.9 to 3.5. So the
shell is about a sixth smaller by the fourth card than it was at the first — it gives
up room to the cards as they arrive. That is deliberately the only thing in the scene
that moves while the deck runs, and it is slow enough to read as the picture opening
out rather than as a move of its own. The alternative — parking the camera the moment
the swap finishes — was tried and rejected: a completely still frame with a list
sliding across it reads as a slideshow.

`lookY` is **not** scaled by `fit` the way act three's is. On a phone that much lift
pushes the mark up into act one's `.hero-bleed`, which is still painted over the top
third of this act because `.orbit-stage` is pulled a full viewport into act one. That
bleed is a pre-existing defect and is not addressed here.

The cost is that the headline is on screen for about a quarter of the act rather than
all of it. Someone who scrolls hard through the opening will miss it. That is the
trade the client took knowingly: the alternative placements that keep it up the whole
act (the top band, the left column) all take frame back off the cards.

### Rejected

**Moving `#services` up the page instead.** It is 4.7 screens of detail. Putting that
before the story either buries the story or means the page opens on a price list; the
story is what makes the services legible as a set.

**New headline and eyebrow wordings.** Built twice, rejected twice. The problem was
structural, not lexical.

**A static grid of four cards.** Four boxes laid out at once read as one texture at a
glance, and at the size the frame allows none of them is readable. The deck keeps the
card as the unit but gives one of them the middle of the frame at a time, which is what
makes each one legible; and it clears before the tools ring arrives, so the two never
compete.

**Animating the card thumbnails on a loop, the way `#services` animates the panels.**
This is what was asked for, and the deck cannot host it: a card holds the middle for
about 50px of scroll and the loop is seven seconds long. Making it watchable means
rests of roughly 20vh, which means a track of about 180vh and an act around 600vh —
and the page being too long is the complaint that produced this ADR in the first place.
The two pull against each other and it is a client call, not a design one.

**Keeping the caption up for the whole act, at the top of the frame or in a left
column.** Both work and both were built. The top band is the conventional answer and
matches acts one and three; the left column is the most distinctive and has no answer
below 900px wide. Both were rejected for the same reason: they keep a block of type in
the frame for the act's whole length, which is exactly what the deck was invented to
get away from.

**Ringing the four services around the shell, the way act one rings its voices.** The
obvious answer to "put the services into the animation", and it does not fit. The act is
built around a held close-up — `close` puts the camera at 2.9 with a 49° field, so the
shell fills the frame's full height for exactly the window the services occupy
(0.30–0.515). Side room is about 22% of the width per side at 16:9 and about 15% at
aspect 1.0, which is roughly 140px at 1100px wide — not enough for a service name and
the line under it. Making room means backing the camera off before 0.52, which is act
one's framing: the same ball at the same distance with cards around it, twice in a row,
and the close-up the act exists for is gone. The deck needs no side room at all — it
moves through the frame rather than sitting beside the shell — so it gets the same
integration without touching the composition or the camera.

## Amendment — the deck runs behind a masked rail

The deck is wider than the frame at every position on its track, so the cards on
either side of the one being read used to end at the viewport's edge — a hard
vertical cut through a card, which reads as a layout accident rather than as a
list continuing past the frame.

The deck now sits inside `.svc-rail`, a wrapper that carries a horizontal
`mask-image` and nothing else: `transparent → #000 → transparent`, so the
off-centre cards dissolve into the frame instead of being sliced by it. The rail
and the deck are separate elements because the mask has to stay still while the
track slides — a mask on the moving element would travel with the cards and never
reach the frame's edge.

Two things about it are load-bearing and non-obvious:

- **The mask is sized to the viewport (`mask-size: 100vw 100%`), not to the
  rail.** On a phone the rail inherits `#orbit .act-sticky`'s 24px inset, and a
  mask that stopped at the rail's own box would begin fading the cards 24px
  inside the screen edge rather than at it.
- **`mask-repeat: no-repeat`.** The deck overflows the rail on both sides at every
  position, and the default `repeat` tiles a second gradient across that overflow.

The deck is still centred with `left:50%` plus a `-50%` in its own transform.
Grid's `justify-items:center` and auto margins were both tried first and both
clamp an item wider than its container to the start edge, which left the deck
hanging off the right of the screen.

None of this reads a story channel, so by ADR-0004's test it is decoration and
the reduced-motion block drops the whole rail treatment — there the deck is a
static 2×2 grid with no mask and all four cards legible at once.

## Amendment — the shell only changes size while the deck runs

The camera used to do two things over the deck's track: back off from 2.9 to 3.5
(`radius`) and tilt its aim down to -0.34 (`lookY`), which lifted the shell up out
of the band the cards occupy at the foot. That is two moves at once, and the one
the reader is actually following is the third: the deck sliding sideways. The lift
is gone. Over the whole of the track `lookY` is now identically 0 and `polar` is
constant, so the shell's centre projects to the middle of a canvas that does not
move — the ball changes size and nothing else.

That puts all of the work on `radius`, and the first attempt gave it too much:
the deck target went to 3.9 and the ramp started at 0.20, which cleared the V but
was itself read as the ball moving. It is not — the V's centre X was measured at
719.5px in every frame of the run, and solving the top edge's 29px descent against
the 20% width change puts the scale centre at y≈452, the middle of the frame, so
it is a pure scale about a fixed point. But a large scale still *looks* like
travel, because the silhouette's top edge descends.

So the shrink was pulled back to 3.6 with the ramp starting at 0.22, and the rest
of the room the V needs was taken from the cards instead: `--deck-b` went from
`max(46px, 8vh)` to `max(38px, 5.5vh)`, dropping the band about 22px at 900 tall.
Moving the cards costs nothing, because the cards are already the thing that moves
in this act. The start of the ramp still matters — `deckIn` completes at 0.29 and
the first card rests at about 0.32, and at the original 0.24 start the shell was
still at full close-up size when the first card arrived — so it begins slightly
before the deck without front-loading: a shrink that finishes before the deck
starts turns the act back into a still frame with a list sliding across it, which
is what `ease` was introduced to avoid.

Act three's `lookY` is untouched, and act two's remains deliberately unscaled by
`fit`: on a phone that much aim offset pushes the mark into act one's
`.hero-bleed`, which is still painting over the top of this act.

## Amendment — the panel is a scan, not a stack of rows

The thumbnail described above — a dark panel building three rows in a staggered
fade off `--a` — has been replaced. The fade was four separate reveals of four
separate things and read as a list assembling itself; the replacement is one
continuous motion, taken from a screen recording of a computer-vision monitor
that the client supplied as a reference.

Each panel is now the service **as a left-to-right run of three stages**, with a
line travelling through it on a hairline grid. A stage is dim until the line
reaches it, then its dot fills, its label comes up, and the rail behind it fills
in accent. A readout strip at the foot is held back until the run is nearly done
and carries the one line of plain language on the card.

The stages are what make one mechanic fit four different services. A chatbot
conversation and a training programme have nothing in common as objects, but both
are things that go from a start to a finish in order, and so are the other two:

| Card | The run | Readout |
|---|---|---|
| AI agents | intake → matched → approval | Approval gate · your call |
| Social automation | drafted → scheduled → posted | 3 posts need your OK · approve |
| Website chatbot | asked → answered → booked | Answered, then booked · live |
| Corporate training | assessed → seminar → workshop | Your team, using it · in use |

An earlier attempt drew abstract detection boxes on all four, straight from the
reference. It was rejected on sight: a bounding box around a calendar slot is the
CV metaphor showing through rather than the service. The line is the only part
that is shared.

### The sweep is driven by the track, not by the card's prominence

The first build read `--scan` off `--a`, the card's own prominence, and that was
wrong in a way worth writing down because it looked right in a still.

`cards[i]` rises **and falls**. So a sweep read off it runs backwards while the
reader is still scrolling forwards — the panel un-finds what it has just found —
and it rests at 0.2 rather than 0 for a neighbour, which parks a bright rule a
fifth of the way across a panel and leaves it there. Measured over the act: cards
two and three held the line mid-panel for **42% and 43%** of the section, every
card ran backwards on forward scroll for 2-7% of it, and card one was at
`--scan: 1` the instant `deckIn` faded it up, so the card with the most attention
on it was the one card that never swept in at all.

`deck` only ever increases as you scroll down. Reading the sweep off it instead —
`scans[i] = clamp(deck - (i - 1))`, with card one riding `deckIn`'s rising half
because it has no approach move of its own — gives each card a sweep of about
13vh that lands exactly on its travel into the middle, never reverses on forward
scroll, and parks nothing. Three tests in `tests/story-state.test.ts` hold it
there; all three fail against the old mapping.

### Why this is spent on the move rather than the rest

The sweep plays across a card's ~13vh approach and is finished and still for its
~6vh hold. That is deliberate and it is the same arithmetic that killed an earlier
looping proposal: a rest is about 50px of scroll at 900 tall, so anything spent
there is never seen. It also means the sweep is fast — roughly 117px of scroll,
which a reader covers in a few hundred milliseconds against the reference
recording's 2.5 seconds — and its first part plays while the card is still
blurred. That is a real cost of the deck's pace, accepted rather than solved.

Under `prefers-reduced-motion` the rAF loop does not run, so `--scan` is parked at
1 on every card and the line is hidden. Each panel shows its finished run, which
is the state the sweep exists to arrive at; a rule frozen against the right-hand
edge is the one part of this that means nothing standing still.

The blinking status dot went with all of it. It was the last thing on the page
whose appearance depended on how long the page had been open; the state word now
brightens with the sweep instead.

---

## Amendment — act two names the *industries*, not the services (2026-09-16)

Superseding the act's subject. The deck now carries the eight verticals from
`lib/industries.ts`, not the four services from `SYSTEMS`. The four services keep
`#services` further down, unchanged. The flat `#industries` section that had been
added to the homepage earlier the same day is removed: it and the deck were the
same eight cards twice on one page, and the deck is the better of the two because
it is the one with the frame to itself.

The client's reason is the one the industry layer exists for at all: a horizontal
service list leaves the reader to work out whether any of it applies to them, and
the deck is the moment in the page where there is nothing else to look at.

### What eight cards cost, and what paid for it

The track is 0.36 of a 170vh act either way, so doubling the cards halves each
card's share of it. The measured dwell is now **≈48px of scroll** per card at 900
tall, against the ≈50px the four-card deck had — barely moved, because the eased
ends of each move count toward the hold, and seven shorter moves have more eased
ends between them than three long ones did.

What paid for it is the card getting lighter: a name and one promise, where a
service card carried a paragraph *and* an instrument panel. Eight of the old card
would have been a wall. The fall-off was halved to match (`0.34`, from `0.62`), so
five cards are on screen instead of three — which is the point. This is a reader
scanning for their own trade, not reading all eight.

The two dwell guards in `tests/story-state.test.ts` are now written in **pixels of
scroll** rather than as a fraction of the act. A fraction was only ever a proxy;
pixels are what decide whether a card can be read, and the proxy moves whenever
the act's height does.

### What went with the services

The scan panel — `.art*`, the `scans` channel, `--scan-1..4`, and its three tests
— is deleted. It was a still of the service's own mock UI further down the page;
an industry has no such panel to be a still of, so the mechanism had nothing left
to point at. The removed CSS, channel and tests are archived in the session
scratchpad rather than rewritten from memory if the services ever want them back.

The card's one moving part now is `.svc-rule`, a rule that draws itself across as
the card comes to the middle. It is read off `--a` like everything else, so it
costs one declaration and cannot get out of step with the deck.

### Rejected: the dark room

Tried and reverted within the hour, at the client's word ("dont need to use dark
ones"). The reference they had picked (aicubed.com) builds its cards out of
hairlines rather than elevation, and a hairline card only reads against a flat
dark field — so the first attempt brought a `--night` channel that crossfaded act
two's ground to near-black and back out before act three.

It worked and it was in grammar: a pure function of the act's own progress,
reversible, with the 3D layer still painting over it. It was rejected on taste,
not on mechanism. The card kept the reference's *structure* — numbered label, name,
accent rule, one line, a meta line at the foot — on the story's own light field
and brand gradient. Recorded because the channel is the part worth remembering:
if a future act ever wants its own ground, `.orbit-night` is how, and it is three
declarations plus a `smooth()` in/out.

### The meta line

The foot of each card carries that industry's own first `win` (`INDUSTRIES[i]
.wins[0]`), not a line written in the markup, so it cannot disagree with that
industry's page. It went in to pin the bottom — the eight names are different
lengths, and without it the deck was a row of boxes with unequal puddles of empty
space under the text.

A count of workflows sat there first and was dropped: all eight industries carry
six, so the five cards on screen all said "6 WORKFLOWS" at once.

### Where the reader goes next

The cards are not links. `.svc-rail` is `pointer-events: none` so that a card the
mask has faded to nothing is not still a click target, and a "view →" line on a
card that cannot be clicked would be a lie. The single route out of the act is
`.orbit-all` in the caption — *View all industries →* — to the `/industries` hub,
which is also the only homepage link to the industry layer now that the flat
section is gone.

### Amendment — the deck gets a depth axis (2026-09-16)

`--a` is unsigned: it falls off identically either side of the middle, so a card
two places to the left was drawn exactly like a card two places to the right, and
the row read as a flat strip sliding past rather than as a deck.

`--off: calc(var(--i) - var(--deck))` is the signed distance from the middle, in
cards, and it cost nothing to add — `--i` is already on the element and `--deck` is
already on `.story`, so no new channel and no change to `orbitState`. Clamped to
±1.55 because the far cards are under the rail's mask anyway and an unclamped card
eight places out would be edge-on.

It drives `rotateY`, so the cards turn towards the middle of the frame and the row
reads as a shallow arc you are looking along. `perspective()` is set per card
rather than on `.svc-deck`: the deck is several times wider than the frame, so a
perspective on the track would put the vanishing point far off screen and the tilt
would come out as a shear.

The cards are glass now — `backdrop-filter`, with the white coming up as `--a`
does. They cross the lower third of the shell, and a solid card there punches a
hole in the one object the whole story is about. Dropped on phone, where eight
compositing layers is not a good trade, and under `prefers-reduced-motion`, where
`--deck` is parked and `--off` would tilt a still grid.

### Amendment — the deck gets colour, a click target, and room to move (2026-09-16)

**Colour.** Each card's hue comes off its own index: `--h: calc(208deg + var(--i) *
3.4deg)`. Eight hand-picked colours would be eight decisions with nothing holding
them together; a hue that walks with the index makes colour a property of the
*deck* — it sweeps across the row and the order of the cards is legible from the
colour alone. The span is under 25deg and is bracketed by the brand's own blues
(219deg is `--sky`'s #6f9bf0, 229deg is `--accent-2`'s #3a4fae). A first cut ran to
264deg and the last cards came out purple, which is not a colour this site owns.

**The click target.** The cards are links now. `.svc-rail` stays
`pointer-events: none` and only `.svc-hit` turns them back on, scaled by `--a` —
so a card the mask has faded to nothing is left with a two-percent target at its
own centre. Measured across the deck: 387x271 on the centred card, 241x178 either
side, 6x5 on the faded ones.

Making them clickable exposed a latent bug worth recording. `.act-copy>*` turns
pointer events back on for every child of every caption, and `--orbit` is the
caption's own opacity — so from the moment act two's caption faded, its invisible
`<h2>` sat directly on top of the deck and swallowed every click meant for a card.
Nothing in that caption is interactive except the link, so nothing else gets to be,
and the link is clipped out of hit-testing once the caption drops below half
opacity. The same shape of bug is still latent in act three's caption; nothing
currently sits under it.

**Room to move.** The act went from 170vh to 230vh and the track from 0.36 to 0.48
of it. Not for dwell — for smoothness. A move slides one whole card across the
frame, so the bigger the card the more scroll it needs: at 436px of card against
55px of scroll the ratio was about 8:1 and a single wheel notch threw the deck
nearly two cards. It is 2.9:1 now, which is what the original four-card deck had.
Dwell went from 48px to 86px of scroll per card as a side effect.

Damping the deck would have been the cheap fix and it is not available: ADR-0004
makes the scroll the timeline, so what the reader sees may not depend on how long
ago they scrolled. The length of the act is the only honest lever.

Worth recording what this was *not*: the jank was not the glass or the blurs. Both
were measured and neither moved the needle (script 125ms/style 26ms/layout 1ms
across the scroll, unchanged with `filter` and `backdrop-filter` forced off), and
the 33ms frame interval turned out to be the measuring browser's own 30fps cap,
identical with both canvases hidden.

### Amendment — Back returns the reader, it does not drive them there (2026-09-16)

`components/KeepScroll.tsx`. Now that the cards are links, Back matters. Three
things were wrong with it, all measured frame by frame rather than reasoned about:

1. `globals.css` sets `html { scroll-behavior: smooth }`, which applies to
   `scrollTo` and therefore to scroll restoration. Coming back from an industry
   page, the homepage did not *appear* at the saved position — it animated there
   from the top over about a second, replaying act one on the way. Restoring a
   position is not a journey. Restored with `behavior: 'instant'`.
2. The App Router's own restore waits for the route's render, about two seconds on
   a page this heavy. This runs as soon as the route commits.
3. At commit the content has not laid out — the document measured 1534px — and a
   scroll is clamped to the height that exists, so the restore silently landed at
   634 (1534 minus the 900 viewport). Whether it recovered depended on whether the
   content finished growing before a fixed retry window closed, which is why the
   same code gave 4289 one run and 634 the next. The page is now propped to the
   height the target needs so the first attempt lands, and the loop ends when the
   position has actually held rather than when a timer says it should have.

Scoped to back/forward only: a `popstate` must have fired, so clicking "Home" in
the nav still lands at the top, which is what choosing that link asks for. Held
positions live in module scope, so they survive soft navigation and die with a hard
load — after a real reload the browser does its own restoring and a remembered
position would be fighting it. Any real input from the reader during the restore
cancels it.
