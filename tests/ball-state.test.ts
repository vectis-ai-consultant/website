import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ballState, clamp, leverState, smooth } from '../lib/ball-state.ts'

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

test('every phase is reversible: state is a pure function of position', () => {
  for (const p of [0, 0.17, 0.4, 0.63, 0.9, 1]) {
    assert.deepEqual(ballState(p), ballState(p))
  }
})

// The timings below are deliberately not pinned to sample points. An earlier
// version asserted the radius at p=0.48 and the aside at p=0.5, which encoded one
// particular cut of the act rather than what the act has to do — so lengthening it
// to give the ring room broke several tests that nothing was actually wrong with.
const SWEEP = Array.from({ length: 2001 }, (_, i) => i / 2000)
const argmin = (f: (p: number) => number) =>
  SWEEP.reduce((best, p) => (f(p) < f(best) ? p : best), 0)

test('the camera dives in before pulling back out', () => {
  const deepest = argmin((p) => ballState(p).radius)
  assert.ok(deepest > 0 && deepest < 1, 'the closest point is inside the act, not at an end')
  assert.ok(ballState(deepest).radius < ballState(0).radius, 'zooms in')
  assert.ok(ballState(1).radius > ballState(deepest).radius, 'pulls back out again')
})

test('the ball still fits the frame at the deepest point', () => {
  // fov 49 -> the half-height in world units is radius * tan(24.5deg); the dot
  // cloud reaches 1.32, so anything closer than ~2.9 crops it.
  const deepest = ballState(argmin((p) => ballState(p).radius)).radius
  assert.ok(deepest * Math.tan((49 * Math.PI) / 360) > 1.3)
})

test('the ball only makes room once the dive is over', () => {
  assert.equal(ballState(0).aside, 0)
  assert.equal(ballState(0.1).aside, 0, 'not while it is still falling')
  assert.equal(ballState(1).aside, 1)
  let prev = -1
  for (const p of SWEEP) {
    const a = ballState(p).aside
    assert.ok(a >= prev - 1e-9, `aside never goes backwards (at ${p})`)
    prev = a
  }
})

test('hero copy and the problem headline are never both up', () => {
  assert.equal(ballState(0).hero, 1)
  assert.equal(ballState(1).leverage, 1)
  for (const p of SWEEP) {
    const s = ballState(p)
    assert.ok(!(s.hero > 0 && s.leverage > 0), `one hands over to the other (at ${p})`)
  }
})

test('the mark resolves inside the ball before the problems start', () => {
  assert.equal(ballState(0).mark, 0, 'nothing to see on the way down')
  assert.equal(ballState(1).mark, 1, 'it stays for the acts that follow')
  const firstCard = SWEEP.find((p) => ballState(p).problems[0] > 0)!
  assert.equal(ballState(firstCard).mark, 1, 'the V has resolved by the time a card arrives')
})

test('the voices arrive as a stream, never as one pop', () => {
  // Twelve is a cloud filling up rather than four findings read one by one, so the
  // windows may overlap — but only just. Three in flight at once and the scroll
  // stops being what is placing them.
  for (const p of SWEEP) {
    const inFlight = ballState(p).problems.filter((v) => v > 0 && v < 1).length
    assert.ok(inFlight <= 2, `at most two are moving at a time (at ${p}, ${inFlight})`)
  }
  const starts = ballState(0).problems.map((_, i) => SWEEP.find((q) => ballState(q).problems[i] > 0)!)
  for (let i = 1; i < starts.length; i++) {
    assert.ok(starts[i] > starts[i - 1], `voice ${i} starts after voice ${i - 1}`)
  }
})

test('each voice leads the one after it, and none start before the pull-back', () => {
  const settled = ballState(1).radius
  const first = SWEEP.find((p) => ballState(p).problems[0] > 0)!
  assert.ok(Math.abs(ballState(first).radius - settled) < 1e-9,
    'the shell is at its resting size before the first voice lands')

  for (const p of SWEEP) {
    const q = ballState(p).problems
    for (let i = 1; i < q.length; i++) {
      assert.ok(q[i - 1] >= q[i], `voice ${i} never overtakes voice ${i - 1} (at ${p})`)
    }
  }
  assert.ok(ballState(0.4).problems.every((v) => v === 0), 'nothing showing during the dive')
  assert.ok(ballState(1).problems.every((v) => v === 1), 'all of them up by the end')
})

test('the ring is pure, so scrolling back up clears it', () => {
  for (const p of [0.5, 0.62, 0.75, 0.9]) {
    assert.deepEqual(ballState(p).problems, ballState(p).problems)
  }
})

test('the whole cloud holds together before anything leaves', () => {
  // The frame with the whole problem up is the payoff of the act. It used to last
  // about six vh, which is not long enough to read four cards, so the exit now
  // waits for a real hold.
  const allUp = SWEEP.find((p) => ballState(p).problems.every((v) => v === 1))!
  const leaving = SWEEP.find((p) => ballState(p).exit.some((v) => v > 0))!
  assert.ok(leaving > allUp, 'nothing starts leaving until all four have landed')
  // 0.01 of a 380vh run is 4vh — a flick, which is what this test is supposed to
  // rule out. The frame with the whole cloud up is the payoff of the act.
  assert.ok(leaving - allUp > 0.1, `the hold is worth reading (got ${(leaving - allUp).toFixed(3)})`)
})

test('the ring leaves under its own power', () => {
  // Otherwise the cards are simply carried off the top when the section unpins,
  // which is a page scrolling rather than an act ending.
  assert.ok(ballState(0.5).exit.every((v) => v === 0), 'not while the cards are still arriving')
  assert.ok(ballState(1).exit.every((v) => v === 1), 'and fully gone by the time the act hands over')
  assert.equal(ballState(1).headExit, 1, 'headline included')
  let prev = ballState(0).exit.map(() => -1)
  for (const p of SWEEP) {
    const e = ballState(p).exit
    e.forEach((v, i) => assert.ok(v >= prev[i] - 1e-9, `exit never reverses (card ${i} at ${p})`))
    prev = e
  }
})

test('the cloud unwinds: the last voice in is the first one out', () => {
  // A cloud that leaves in the order it arrived reads as a queue. Taking the newest
  // back first is what makes it read as being drawn into the shell.
  const n = ballState(0).exit.length
  const starts = Array.from({ length: n }, (_, i) => SWEEP.find((p) => ballState(p).exit[i] > 0)!)
  for (let i = 1; i < n; i++) {
    assert.ok(starts[i] < starts[i - 1], `voice ${i} leaves before voice ${i - 1}`)
  }
  const landed = SWEEP.find((p) => ballState(p).problems[n - 1] === 1)!
  assert.ok(starts[n - 1] > landed, 'and only once it has actually landed')
})

test('the headline is genuinely the last thing to leave', () => {
  // The comment in ball-state says so; for a while it was not true — the headline
  // started lifting before the final bubble had begun to go.
  const lastOut = SWEEP.find((p) => ballState(p).exit[0] > 0)!
  const headOut = SWEEP.find((p) => ballState(p).headExit > 0)!
  assert.ok(headOut >= lastOut, `head goes at ${headOut}, last voice at ${lastOut}`)
  assert.equal(ballState(1).headExit, 1, 'and it is gone by the handover')
})

test('a shorter cloud runs the same schedule, not a shorter one', () => {
  // The phone shows six of the twelve. Six on the twelve-voice schedule lands the
  // last one a third of the way in and leaves the rest of a pinned act empty.
  const last12 = SWEEP.find((p) => ballState(p).problems.every((v) => v === 1))!
  const last6 = SWEEP.find((p) => ballState(p, 6).problems.every((v) => v === 1))!
  assert.ok(Math.abs(last6 - last12) < 0.02, `six land where twelve do (${last6} vs ${last12})`)
  assert.ok(ballState(1, 6).exit.every((v) => v === 1), 'and all six are gone by the end')
  assert.ok(ballState(0.5, 6).exit.every((v) => v === 0), 'none leave early')
})

test('the shell answers with one swell, and is quiet at both ends', () => {
  // A hump, not a ramp: it has to be back at nothing by the time the act hands
  // over, or the second act opens on a lit ball for no reason.
  assert.equal(ballState(0.5).flare, 0, 'nothing while the ring is still arriving')
  assert.ok(ballState(1).flare < 1e-9, 'and nothing left at the handover')
  const peak = SWEEP.reduce((b, p) => (ballState(p).flare > ballState(b).flare ? p : b), 0)
  assert.ok(ballState(peak).flare > 0.95, 'it does peak')
  assert.ok(peak > 0.87 && peak < 0.97, `and peaks while the cards are coming in (at ${peak})`)
})

test("the third act's caption arrives a line at a time", () => {
  // Read in the order it is written: the eyebrow leads the headline, which leads
  // the line under it. If any two shared a window the block would fade in as one
  // slab again, which is what putting it at the top of the frame was meant to end.
  for (const p of SWEEP) {
    const [num, head, body] = leverState(p).copy
    assert.ok(num >= head && head >= body, `lines stay in order (at ${p})`)
  }
  const starts = [0, 1, 2].map((i) => SWEEP.find((p) => leverState(p).copy[i] > 0)!)
  assert.ok(starts[0] < starts[1] && starts[1] < starts[2], 'each line leads the next')
})

test('the caption waits for the machine it names to exist', () => {
  // The shatter, the gather and the plank going solid are one move and they are
  // what the act is for; a caption over the top of them is a second thing to
  // read while the first is still happening. So the words come after the lever
  // is built — and while it is still being loaded, so they are up for the tip.
  const built = SWEEP.find((p) => leverState(p).solid === 1)!
  const firstLine = SWEEP.find((p) => leverState(p).copy[0] > 0)!
  assert.ok(firstLine > built - 0.03, `the caption started at ${firstLine}, before the beam was solid at ${built}`)
  const tips = SWEEP.find((p) => leverState(p).tilt > 0.5)!
  assert.ok(leverState(tips).copy[0] === 1, 'the first line is still arriving when the beam tips')
  assert.ok(leverState(1).copy.every((v) => v === 1), 'a line never finished arriving')
})
