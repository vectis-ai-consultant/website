// The promise, shown rather than claimed.
//
// Four blocks are what the team ships today. They are lit from the start and
// they never change — the headcount is the constant in this picture. The other
// thirty-six fill in as the hero's last phase runs, so the same four people end
// the section shipping forty blocks: the ×10 is the picture, not a statistic
// bolted onto it.
//
// -1 means the block is lit from the start. The rest fill in a scattered order
// rather than left to right, because capacity does not arrive in reading order.
const FILL = [
  -1, -1, 8, 17, 19, 23, 20, 30,
  -1, -1, 5, 4, 6, 21, 14, 13,
  31, 2, 22, 27, 28, 18, 7, 25,
  26, 12, 15, 0, 1, 29, 3, 11,
  35, 34, 24, 16, 32, 9, 10, 33,
]

// What the extra capacity goes to. These were the three bullets the panel used
// to list as failures; they are the same three jobs, now getting done.
const WORK = ['Follow-ups', 'Quotes', 'Content']

export default function OutputGrid() {
  return (
    <div className="grow" aria-hidden="true">
      <p className="grow-cap">
        <span>Your team</span>
        <span className="grow-team">{[0, 1, 2, 3].map((i) => <i key={i} />)}</span>
      </p>
      <p className="grow-cap grow-cap-2">
        <span>What it ships</span>
        <b className="grow-x">&times;10</b>
      </p>
      <div className="grow-grid">
        {FILL.map((o, i) => (
          <span key={i} className="grow-cell" style={{ ['--o' as string]: o }} />
        ))}
      </div>
      <ul className="grow-tags">
        {WORK.map((t, i) => (
          <li key={t} style={{ ['--t' as string]: i + 1 }}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
