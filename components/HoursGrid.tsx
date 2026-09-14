// The problem, shown rather than listed.
//
// Forty blocks — a working week, one block an hour. They go dark as the hero's
// last phase runs, so you watch the week fill up with the work that repeats
// instead of reading three bullet points about it. Four blocks are left alight:
// no figure is claimed, the gap is the whole argument.
//
// Every block is driven by --leverage, the same position-derived value the rest
// of the hero reads, so scrolling back up empties the week again. -1 means the
// block never fills; the order is scattered rather than left-to-right because a
// week does not get eaten in reading order.
const FILL = [
  14, 25, 21, 32, 31, 3, 23, 17,
  6, 34, 2, 27, -1, 9, 20, 8,
  13, 24, 29, -1, 26, 15, 35, 18,
  11, 7, 1, -1, 33, 30, 5, 10,
  4, 16, -1, 0, 28, 22, 12, 19,
]

// The three that do the eating. Each fades in once the week is a quarter,
// a half and three quarters gone.
const TAKERS = ['Follow-ups', 'Quotes', 'Content']

export default function HoursGrid() {
  return (
    <div className="hours" aria-hidden="true">
      <p className="hours-cap">One week</p>
      <div className="hours-grid">
        {FILL.map((o, i) => (
          <span key={i} className="hours-cell" style={{ ['--o' as string]: o < 0 ? 999 : o }} />
        ))}
      </div>
      <ul className="hours-tags">
        {TAKERS.map((t, i) => (
          <li key={t} style={{ ['--t' as string]: i + 1 }}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
