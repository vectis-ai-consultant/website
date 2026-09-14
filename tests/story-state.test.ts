import { test } from 'node:test'
import assert from 'node:assert/strict'
import { orbitState, leverState } from '../lib/ball-state.ts'
import { railState } from '../lib/rail-state.ts'

test('orbit clamps outside the section', () => {
  assert.deepEqual(orbitState(-3), orbitState(0))
  assert.deepEqual(orbitState(9), orbitState(1))
})

test('the ball is back in the middle before the tools finish arriving', () => {
  const s = orbitState(0.3)
  assert.equal(s.centre, 1)
  assert.ok(s.ring < 1)
})

test('the ring keeps turning the whole way down', () => {
  // Not eased: a smoothstep would stall the spin at both ends, and the ask was
  // for logos that keep going as long as you keep scrolling.
  const a = orbitState(0.25).spin, b = orbitState(0.5).spin, c = orbitState(0.75).spin
  assert.ok(a < b && b < c)
  assert.ok(Math.abs((b - a) - (c - b)) < 1e-9)
})

test('the ball is fully broken before the dust starts gathering', () => {
  assert.equal(leverState(0.28).shatter, 1)
  assert.equal(leverState(0.28).gather, 0)
})

test('the beam is solid before it ever tips', () => {
  assert.equal(leverState(0.6).solid, 1)
  assert.equal(leverState(0.6).tilt, 0)
})

test('tools land left to right, and the rocket goes last', () => {
  const s = leverState(0.72)
  for (let i = 1; i < s.tiles.length; i++) assert.ok(s.tiles[i] <= s.tiles[i - 1])
  assert.equal(s.launch, 0)
  const end = leverState(1)
  assert.ok(end.tiles.every((t) => t === 1))
  assert.equal(end.launch, 1)
})

test('both acts are pure, so scrolling back up replays them', () => {
  for (const p of [0, 0.17, 0.41, 0.63, 0.88, 1]) {
    assert.deepEqual(orbitState(p), orbitState(p))
    assert.deepEqual(leverState(p), leverState(p))
  }
})

test('the rail is position-derived and clamps outside its section', () => {
  assert.deepEqual(railState(-2, 4), railState(0, 4))
  assert.deepEqual(railState(5, 4), railState(1, 4))
  // Every step gets a turn, in order, and the last one holds to the end.
  assert.deepEqual([0, 0.3, 0.6, 0.9, 1].map((p) => railState(p, 4).index), [0, 1, 2, 3, 3])
  // Pure: the same position always gives the same state.
  for (const p of [0.07, 0.41, 0.83]) assert.deepEqual(railState(p, 4), railState(p, 4))
})
