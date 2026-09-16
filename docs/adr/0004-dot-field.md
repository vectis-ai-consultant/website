# ADR-0004 — The dot field is pointer-driven decoration, outside the scroll timeline

Status: accepted
Date: 2026-09-15

## Context

The homepage story runs on one rule: the scroll is the timeline. Every structural
thing is a pure `state = f(scrollProgress)` in `lib/ball-state.ts`, which is what
makes the whole story reversible by construction — scroll back up and it replays
exactly. ADR-0001 and ADR-0003 carve out one exception: ambient loops (the shell's
sheen, the voices' drift) are allowed because they carry no state, so removing them
loses no story information.

The client asked for a field of dots behind the hero that reacts to the mouse.

A first attempt coupled the field to the story: a canvas lattice warped by the
three.js shell's projected screen position, published from `StoryScene`'s render
loop. It was rebuilt five times and rejected five times, and the whole thing was
deleted. The rejections, in order, were: the dots could not move at all (a CSS
`background-image` cannot be warped); the dots collapsed into a clot; it needed to
behave like a gravity grid; "no local bubble or particle, it should be only the
grid changing and the grid should be a consistent grid in default"; and finally
that the spacing under the mass should match the spacing at rest.

Two things came out of that. The first is that the coupling to the ball was never
requested — it was invented, and three of the five rebuilds were fixing the maths
of a design nobody had asked for. The second is that the target was being inferred
from screenshots rather than confirmed.

## Decision

**The dot field is decoration and sits outside the scroll timeline**, in the same
class as the ambient loops. It reads nothing from `ballState`, nothing from the
`--p*`/`--e*`/`--frame` CSS channels, and nothing about where the shell is. Its
only input is the pointer.

It may carry state — pointer position and a decaying strength — because it is not
a beat in the story. Reversibility does not apply to it: delete it and the story is
unchanged. It must return to a perfectly regular lattice at rest, and the draw loop
must stop when it does, so an idle page costs nothing.

**The field pushes dots away from the pointer.** The reference image the client
supplied is measurably an attracting well — every row's dip bottomed on the same
column while horizontal gaps compressed toward it — but the client chose repulsion
from a three-variant demo. Repulsion can never concentrate the field, which is what
five rejections were about.

**The parameters were chosen by the client against a live demo**, not picked here:
spacing 28px, dot radius 2px, strength 100px, reach 260px, settle 1.3s.

## Consequences

- `lib/dot-field.ts` holds the map as pure functions so it can be unit-tested;
  `components/DotField.tsx` only draws. `tests/dot-field.test.ts` covers the two
  properties that matter: the lattice is exactly regular at rest, and the map is
  injective so the field opens up and can never fold or clot.
- It is a standalone canvas, not part of the three.js scene. `.ball-canvas` is
  translated down the page at hero rest, `StoryScene`'s loop parks when the story
  is off-screen and under reduced motion, and its camera moves — a field living in
  there would inherit all three.
- Reduced motion, and any device without a fine pointer, get the resting lattice
  and no listener. The effect has nothing to say to a reader who cannot move a
  cursor over it.
- Mounted inside `.story-stage`, so it spans the three acts. The ground there runs
  `--sky-3` → `--sky-2` → `#f2f5fb`, all pale; the dots are `rgb(198,212,245)`,
  which is close to `--sky-2` `#c9daf8`, so contrast is thinnest around 37% through
  the story. If it ever needs to go behind a darker section, the colour has to
  become a custom property rather than a constant.

## Alternatives rejected

- **Coupling the field to the shell.** What the deleted version did. Never asked
  for, and it made a piece of decoration depend on the most intricate machinery on
  the page.
- **Folding it into the three.js scene.** Would need a second orthographic pass
  with `autoClear=false`, re-entangling the decoration with the system that had
  just failed four times.
- **An attracting well, matching the reference exactly.** Measurably what the
  reference does, and rejected by the client in favour of the push.
- **Keeping the area-preserving map** `r' = √(r² − a)`, which bends the lattice
  with provably zero density change. Elegant, and it survives here only as a note:
  the client wanted the field to answer the mouse, not to hold a permanent warp.
