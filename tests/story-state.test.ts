import { test } from 'node:test'
import assert from 'node:assert/strict'
import { orbitState, leverState, DECK } from '../lib/ball-state.ts'
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

// --- act two names the four services, on a deck -----------------------------
// The act's eyebrow says OUR SOLUTION, so it has to name a solution. These guard
// the reading order and the mechanism rather than the look: vertical scroll
// drives the deck sideways, so `deck` is the whole of it and everything else —
// which card is legible, how far the track has moved — falls out of that number.

const SWEEP2 = Array.from({ length: 2001 }, (_, i) => i / 2000)

test('the deck starts on the first card and ends on the last', () => {
  assert.ok(Math.abs(orbitState(0).deck - 0) < 0.01, 'the deck does not start on card one')
  assert.ok(Math.abs(orbitState(1).deck - (DECK - 1)) < 0.01, `the deck never reaches card ${DECK}`)
})

test('the deck only ever moves forwards', () => {
  // It is a track, not a shuffle: scrolling down must never take a card back.
  let prev = -1
  for (const p of SWEEP2) {
    const at = orbitState(p).deck
    assert.ok(at >= prev - 1e-9, `the deck went backwards at ${p}`)
    prev = at
  }
})

test('every card gets the middle of the frame to itself', () => {
  // Each one has to actually arrive at the centre, or it is never readable.
  for (let i = 0; i < DECK; i++) {
    const at = SWEEP2.find((p) => orbitState(p).cards[i] > 0.99)
    assert.ok(at !== undefined, `card ${i + 1} is never the one in the middle`)
  }
})

test('every card holds the middle with the deck fully on screen', () => {
  // Being at the centre of the frame is not the same as being readable. The
  // first card is the one with nothing before it to cover its arrival: when the
  // deck's fade-in overlapped its move off the mark, card one was never seen at
  // full prominence at all and the act read as a list of three.
  for (let i = 0; i < DECK; i++) {
    const held = SWEEP2.filter((p) => { const s = orbitState(p); return s.cards[i] > 0.97 && s.deckIn > 0.99 }).length / SWEEP2.length
    assert.ok(held * ACT_PX > 40, `card ${i + 1} is legible for only ${(held * ACT_PX).toFixed(0)}px of scroll`)
  }
})

test('the cards reach the middle in order', () => {
  for (let i = 1; i < DECK; i++) {
    const prev = SWEEP2.find((p) => orbitState(p).cards[i - 1] > 0.99)!
    const here = SWEEP2.find((p) => orbitState(p).cards[i] > 0.99)!
    assert.ok(here > prev, `card ${i + 1} arrived before card ${i}`)
  }
})

test('only one card is ever the one being read', () => {
  // The neighbours stay visible to say how many there are, but two cards at full
  // prominence at once is two things asking to be read.
  for (const p of SWEEP2) {
    const lit = orbitState(p).cards.filter((v) => v > 0.9).length
    assert.ok(lit <= 1, `${lit} cards were in the middle at ${p}`)
  }
})

// Act two is 230vh (ball-hero.css), and it animates across its whole section, so
// a fraction of the act converts straight to pixels of scroll at a given viewport
// height. The dwell guards below are written in those pixels rather than in
// fractions, because pixels of scroll are what decide whether a card can be read
// and a fraction is only a proxy that moves whenever the act's height does.
const ACT_PX = 2.3 * 900

test('the deck rests on each card instead of sliding past it', () => {
  // A linear track never lets you read anything. Every card must hold the middle
  // for a stretch of scroll, not just touch it for an instant.
  //
  // 40px is the floor, and going from four cards to eight is what put it under
  // pressure: the track is the same 0.36 of the act either way, so each card's
  // share of it halved. What pays for that is the cards getting lighter — a name
  // and one promise, where the four services carried a paragraph and an
  // instrument panel. This is a scan for your own trade, not a read of all eight.
  for (let i = 0; i < DECK; i++) {
    const held = SWEEP2.filter((p) => orbitState(p).cards[i] > 0.97).length / SWEEP2.length
    assert.ok(held * ACT_PX > 40,
      `card ${i + 1} holds the middle for only ${(held * ACT_PX).toFixed(0)}px of scroll`)
  }
})

test('the shell neither moves nor changes size while the deck runs', () => {
  // The act's one rule, and it is a rule about stillness: across the whole of the
  // horizontal scroll the camera does nothing at all. `ease` is the pull-back off
  // the caption's close-up and it has to be finished before the track starts, or
  // the shell is changing size while the cards slide across it — two moves at
  // once, and the sideways one is the one being read. `frame` is the camera's
  // next move and must not begin until the track is over.
  const trackStart = SWEEP2.find((p) => orbitState(p).deck > 0.001)!
  const trackEnd = SWEEP2.find((p) => orbitState(p).deck > 2.999)!
  const held = orbitState(trackStart).ease
  assert.ok(held > 0.999, `the camera is still pulling back at the track start (ease ${held.toFixed(3)})`)
  for (const p of SWEEP2.filter((p) => p >= trackStart && p <= trackEnd)) {
    const s = orbitState(p)
    assert.equal(s.ease, held, `the shell changed size mid-track at ${p}`)
    assert.equal(s.frame, 0, `the camera started its next move at ${p}, before the deck was done`)
  }
})

test('the deck is done before the camera leaves the shell', () => {
  // The cards cross the held shell; once `frame` starts the camera is pulling
  // back for the ring of tools and the picture has moved on.
  const framePulls = SWEEP2.find((p) => orbitState(p).frame > 0.01)!
  const lastCard = SWEEP2.find((p) => orbitState(p).cards[DECK - 1] > 0.99)!
  assert.ok(lastCard < framePulls, `the last card lands at ${lastCard}, after the camera starts moving at ${framePulls}`)
})

test('the caption leads, and is gone before the deck takes the frame', () => {
  // Act two says its line first, against the held shell with nothing else in
  // the picture, and clears out as the cards arrive. That is what keeps the two
  // from sharing the frame — and it is why the cards do not have to be squeezed
  // around a block of type at the foot.
  const copy = SWEEP2.find((p) => orbitState(p).copy > 0.5)!
  const deckUp = SWEEP2.find((p) => orbitState(p).deckIn > 0.5)!
  assert.ok(copy < deckUp, `the deck was up at ${deckUp}, before the caption at ${copy}`)
  assert.ok(orbitState(deckUp).copy < 0.5, 'the caption was still holding the frame as the deck arrived')
  const trackStarts = SWEEP2.find((p) => orbitState(p).deck > 0.01)!
  assert.ok(orbitState(trackStarts).copy < 0.02, 'the caption was still on screen when the deck started moving')
  // And it is read for long enough to be read: a stretch of scroll at full
  // strength, not a flash between two other things.
  const held = SWEEP2.filter((p) => orbitState(p).copy > 0.97).length / SWEEP2.length
  assert.ok(held > 0.04, `the caption holds for only ${(held * 100).toFixed(1)}% of the act`)
})



test('the deck leaves as one thing, and before the tools land', () => {
  // It goes out whole rather than a card at a time, and it is gone before the
  // ring arrives: two lists on screen at once is two things asking to be read.
  const ringUp = SWEEP2.find((p) => orbitState(p).ring > 0.5)!
  const deckGone = SWEEP2.find((p) => p > 0.6 && orbitState(p).deckIn < 0.01)!
  assert.ok(deckGone < ringUp, `the deck is still up at ${deckGone}, with the ring already in at ${ringUp}`)
  const end = orbitState(1)
  for (const v of end.cards) assert.ok(v < 0.01, 'a card was left on screen')
  assert.ok(end.deckIn < 0.01)
  assert.ok(end.copy < 0.01)
})

test('the last card is held long enough to be read', () => {
  // It arrives with nothing following it, so nothing but the schedule stops it
  // from being on screen for an instant before the deck clears.
  const landed = SWEEP2.find((p) => orbitState(p).cards[DECK - 1] > 0.99)!
  const gone = SWEEP2.find((p) => p > landed && orbitState(p).deckIn < 0.5)!
  assert.ok(gone - landed > 0.1, `the last card holds for only ${(gone - landed).toFixed(3)} of the act`)
})

test('act two is pure, so scrolling back up replays the deck', () => {
  for (const p of [0.2, 0.4, 0.5, 0.8]) {
    assert.deepEqual(orbitState(p).cards, orbitState(p).cards)
    assert.equal(orbitState(p).deck, orbitState(p).deck)
  }
  assert.deepEqual(orbitState(-1).cards, orbitState(0).cards)
  assert.equal(orbitState(9).deck, orbitState(1).deck)
})

