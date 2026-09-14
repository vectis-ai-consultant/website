// The problem, shown rather than listed.
//
// A morning's inbox stacking up. Each row arrives as the hero's last phase
// runs, and the ones already there are visibly older by the time the next one
// lands — so the section makes its point by piling up rather than by claiming
// anything. The bar underneath is the same value again: the longer the stack,
// the worse the answer time.
//
// Everything reads --leverage, the position-derived value the panel already
// fades on, so scrolling back up empties the inbox again.
const MAIL: { kind: string; line: string; age: string; cold: 0 | 1 | 2 }[] = [
  { kind: 'New lead', line: 'Can you do this for us?', age: '4m', cold: 0 },
  { kind: 'Quote', line: 'What would it cost?', age: '2h', cold: 0 },
  { kind: 'Support', line: 'Where is my order?', age: '5h', cold: 1 },
  { kind: 'New lead', line: 'Saw your site — call?', age: '1d', cold: 1 },
  { kind: 'Content', line: 'Need copy for Friday', age: '2d', cold: 2 },
  { kind: 'New lead', line: 'Still interested?', age: '3d', cold: 2 },
]

export default function InboxStack() {
  return (
    <div className="inbox" aria-hidden="true">
      <p className="inbox-cap">The inbox, by Thursday</p>
      <ul className="inbox-list">
        {MAIL.map((m, i) => (
          <li key={m.age} className="inbox-row" data-cold={m.cold} style={{ ['--r' as string]: i + 1 }}>
            <span className="inbox-dot" />
            <span className="inbox-kind">{m.kind}</span>
            <span className="inbox-line">{m.line}</span>
            <span className="inbox-age">{m.age}</span>
          </li>
        ))}
      </ul>
      <p className="inbox-meter">
        <span>Speed to lead</span>
        <span className="inbox-bar"><i /></span>
      </p>
    </div>
  )
}
