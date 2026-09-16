// The problem, in the words a small team actually uses.
//
// Not four panels of detail any more: a dozen short things said out loud, drifting
// around the shell that the next two acts answer. Each one is a chat bubble, because
// that is what they are — the sentence somebody says on a Tuesday, not a statistic.
//
// The figures need a different rule from the one the cards had. There, they were
// measurements of an illustration on screen — you could count the rows. There is no
// illustration now, so the rule that replaces it is: a figure may describe the
// speaker's own situation, and may never read as a result. "three days, and still
// nobody has replied" is a complaint; "replies went up 40%" would be an outcome
// claimed on someone's behalf, and that is what ADR-0001 exists to keep out. Nothing
// here is attributed to anyone, and nothing here is a number we have measured.
type Voice = { text: string; x: number; y: number; side: 'l' | 'r' }

// x is the edge the bubble is anchored by — its left edge on the left of the ball,
// its right edge on the right — so a bubble can never hang off the side of the
// screen the way a centred one does when it grows. y is its middle. Both are
// percentages of the stage. Order is reveal order, so the cloud fills down both
// sides at once rather than filling one side and then the other.
const VOICES: Voice[] = [
  { text: 'nobody finds us unless we pay for ads', x: 10, y: 24, side: 'l' },
  { text: 'leads go cold before anyone replies', x: 90, y: 28, side: 'r' },
  { text: 'I run the whole business on spreadsheets', x: 4, y: 38, side: 'l' },
  { text: 'the questions wait until someone is at a desk', x: 96, y: 42, side: 'r' },
  { text: '0 of 3 AI answers mention us', x: 8, y: 52, side: 'l' },
  { text: 'quotes take a day, so they go elsewhere', x: 92, y: 56, side: 'r' },
  { text: 'the same three steps, by hand, every client', x: 3, y: 66, side: 'l' },
  { text: 'answered next morning — fifteen hours later', x: 97, y: 70, side: 'r' },
  { text: 'we post when somebody remembers to', x: 9, y: 80, side: 'l' },
  { text: 'three days, and still nobody has replied', x: 91, y: 84, side: 'r' },
  { text: 'every new tool turns into a headache', x: 20, y: 92, side: 'l' },
  { text: 'we answer the same five questions all day', x: 80, y: 95, side: 'r' },
]

// The drift has to look unplanned, and it has to be the same unplanned on the
// server as in the browser and on every reload — a Math.random() here is a
// hydration mismatch and a different page every time you look at it. So the
// numbers come from the line itself: same sentence, same motion, forever.
const seed = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) / 4294967295
}

export default function ProblemVoices() {
  return (
    <section className="ball-problems" aria-labelledby="pv-title">
      <div className="pv-head">
        <span className="pv-num">01 — WHAT IT COSTS YOU</span>
        <h2 id="pv-title">The work is already there.<br /><em>The hours aren&rsquo;t.</em></h2>
      </div>
      <ul className="pv-list">
        {VOICES.map((v, i) => {
          const a = seed(v.text)
          const b = seed(v.text + '~')
          const c = seed(v.text + '~~')
          // Two loops of different lengths on two different elements, each with its
          // own phase, so the compound path takes minutes to repeat and never reads
          // as a dozen things bobbing in time. The negative delay starts every
          // bubble part-way through its own cycle: nothing ever begins together.
          return (
            <li
              key={v.text}
              className="pv-bubble"
              data-side={v.side}
              style={{
                ['--xn' as string]: v.x,
                ['--yn' as string]: v.y,
                // Its own slice of the same position-derived machine the ball runs on.
                ['--p' as string]: `var(--p${i + 1})`,
                ['--e' as string]: `var(--e${i + 1})`,
                ['--fx' as string]: (b < 0.5 ? -1 : 1) * (11 + a * 17),
                ['--fy' as string]: 9 + b * 15,
                ['--rot' as string]: (c < 0.5 ? -1 : 1) * (0.7 + c * 1.7),
                ['--dur' as string]: `${(12 + a * 9).toFixed(1)}s`,
                ['--dur2' as string]: `${(7 + c * 7).toFixed(1)}s`,
                ['--t' as string]: `${-(a * 23).toFixed(1)}s`,
                ['--t2' as string]: `${-(c * 17).toFixed(1)}s`,
              }}
            >
              <span className="pv-float">
                <span className="pv-say">{v.text}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
