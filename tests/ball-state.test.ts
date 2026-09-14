import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ballState, clamp, smooth } from '../lib/ball-state.ts'

test('progress is clamped at both ends', () => {
  assert.deepEqual(ballState(-3), ballState(0))
  assert.deepEqual(ballState(9), ballState(1))
  assert.equal(smooth(0), 0)
  assert.equal(smooth(1), 1)
  assert.equal(clamp(2), 1)
})

test('the ball starts overhead and ends level', () => {
  assert.ok(ballState(0).polar < 0.2, 'starts looking down at the top')
  assert.ok(ballState(1).polar > 1.4, 'ends looking at the equator')
})

test('the camera dives in before pulling back out', () => {
  const start = ballState(0).radius, mid = ballState(0.48).radius, end = ballState(1).radius
  assert.ok(mid < start, 'zooms in by the middle')
  assert.ok(end > mid, 'pulls back out again')
})

test('the ball only moves aside at the end', () => {
  assert.equal(ballState(0).aside, 0)
  assert.equal(ballState(0.5).aside, 0)
  assert.equal(ballState(1).aside, 1, 'fully aside for the side-by-side')
})

test('hero copy hands over to the leverage copy', () => {
  assert.equal(ballState(0).hero, 1)
  assert.equal(ballState(0.3).hero, 0)
  assert.equal(ballState(0.5).leverage, 0)
  assert.equal(ballState(1).leverage, 1)
})

test('the mark resolves inside the ball once the dive bottoms out', () => {
  assert.equal(ballState(0.2).mark, 0, 'nothing to see on the way down')
  assert.equal(ballState(0.6).mark, 1)
  assert.equal(ballState(1).mark, 1, 'it stays for the acts that follow')
})

test('the ball still fits the frame at the deepest point', () => {
  // fov 49 -> the half-height in world units is radius * tan(24.5deg); the dot
  // cloud reaches 1.32, so anything closer than ~2.9 crops it.
  assert.ok(ballState(0.48).radius * Math.tan((49 * Math.PI) / 360) > 1.3)
})

test('every phase is reversible: state is a pure function of position', () => {
  for (const p of [0, 0.17, 0.4, 0.63, 0.9, 1]) {
    assert.deepEqual(ballState(p), ballState(p))
  }
})
