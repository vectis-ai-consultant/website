// The pointer's effect on the dot field, as one pure function of distance.
//
// Kept out of the component so it can be tested: everything that decides where a
// dot goes lives here, and the component only draws. The numbers were chosen by
// the client against a live three-variant demo rather than guessed — an earlier
// field went through five rejections on inferred parameters.
//
// The field pushes dots AWAY from the pointer. A well that pulls them in was the
// reference image's own behaviour, but every version of this that concentrated
// the dots anywhere was rejected, so repulsion is the deliberate choice: it opens
// a clearing and can never pile dots up.

export const SPACING = 28 // px between dots at rest
export const DOT = 2 // dot radius
export const STRENGTH = 100 // px of shove at the pointer itself
export const REACH = 260 // px; at this distance the shove is a quarter strength
export const SETTLE = 1.3 // seconds from the last movement back to a flat lattice

// No dot may travel more than this fraction of its own distance to the pointer.
// Without it the offset is `STRENGTH` however close the dot already is, so
// everything inside that radius crosses the pointer and lands in a heap on the
// far side. Capping against the dot's own distance keeps the map injective: no
// dot overtakes another, so the lattice opens up and never tears.
const CAP = 0.45
// The push is a little softer than the equivalent pull, which otherwise clears
// too wide a hole and reads as a spotlight rather than as a field.
const LEAN = 0.8

/**
 * How far to move a dot, as a fraction of its offset from the pointer.
 *
 * Multiply the vector (pointer - dot) by the result and add it to the dot.
 * Negative, because the dot moves away from the pointer.
 *
 * @param d    distance from the dot to the pointer, in px
 * @param mass 0 at rest, 1 while the pointer is moving
 */
export function shove(d: number, mass: number): number {
  if (mass <= 0 || d <= 0) return 0
  // A soft 1/r-ish falloff rather than one with a cutoff radius: the field has
  // to thin out with distance without ever reaching an edge, or the effect reads
  // as a bubble stuck to the cursor sitting on an otherwise flat background.
  const f = REACH / (d + REACH)
  const move = Math.min(STRENGTH * f * f * mass, d * CAP)
  return -(move / d) * LEAN
}

/** How bright a dot sits, 0 at rest out in the field, 1 right by the pointer. */
export function lift(d: number, mass: number): number {
  if (mass <= 0) return 0
  const f = REACH / (d + REACH)
  return f * f * mass
}

/** Mass after `dt` seconds with no movement. Reaches exactly 0, never an asymptote. */
export function decay(mass: number, dt: number): number {
  return Math.max(0, mass - dt / SETTLE)
}
