import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shove, lift, decay, SETTLE, SPACING, REACH } from '../lib/dot-field.ts'

// Distances worth checking, from right on top of the pointer out to a corner.
const FAR = Array.from({ length: 200 }, (_, i) => 1 + i * 12)

test('at rest the lattice is exactly regular', () => {
  for (const d of FAR) assert.equal(shove(d, 0), 0)
  assert.equal(lift(120, 0), 0)
})

test('the field settles to rest, and reaches it rather than approaching it', () => {
  let m = 1
  for (let t = 0; t < SETTLE + 0.2; t += 1 / 60) m = decay(m, 1 / 60)
  assert.equal(m, 0, 'mass must land on exactly zero, or the loop never stops')
})

test('dots move away from the pointer, never toward it', () => {
  for (const d of FAR) assert.ok(shove(d, 1) <= 0, `d=${d} pulled instead of pushed`)
})

test('no dot travels past the pointer, at any distance or strength', () => {
  // This is the guard that stops the field piling into a clot. The offset is
  // |shove| * d, and it must stay under d itself by a clear margin.
  for (const d of FAR) {
    for (const m of [0.25, 0.5, 0.75, 1]) {
      const moved = Math.abs(shove(d, m)) * d
      assert.ok(moved < d, `a dot at ${d} moved ${moved}, reaching the pointer`)
      assert.ok(moved <= d * 0.45, `a dot at ${d} moved ${moved}, over the cap`)
    }
  }
})

test('the lattice cannot fold: dots keep their order outward', () => {
  // Two dots one cell apart must still be that way round after displacement,
  // or the field tears instead of opening.
  for (let d = 1; d < 1400; d += 3) {
    const a = d + Math.abs(shove(d, 1)) * d
    const b = d + SPACING + Math.abs(shove(d + SPACING, 1)) * (d + SPACING)
    assert.ok(b > a, `dots at ${d} and ${d + SPACING} crossed over`)
  }
})

test('the push fades with distance but never hits a cutoff edge', () => {
  let prev = Infinity
  for (const d of FAR) {
    const moved = Math.abs(shove(d, 1)) * d
    assert.ok(moved > 0, `the field died completely at ${d}`)
    if (d > REACH) {
      assert.ok(moved < prev, `the push grew with distance at ${d}`)
      prev = moved
    }
  }
})

test('the push scales with how recently the pointer moved', () => {
  const d = 140
  const full = Math.abs(shove(d, 1)) * d
  const half = Math.abs(shove(d, 0.5)) * d
  assert.ok(half < full && half > 0)
})

test('the brightest dots are the ones nearest the pointer', () => {
  assert.ok(lift(10, 1) > lift(200, 1))
  assert.ok(lift(200, 1) > lift(900, 1))
  assert.ok(lift(10, 1) <= 1)
})
