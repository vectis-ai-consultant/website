// The contact section used to be two columns of prose: a four-step rail down
// the left and a "what the call looks like" panel on the right, which said the
// same thing twice and read as a wall. The same four steps run across the page
// instead — an icon, a number, a title and one line each — so the shape of the
// process is legible before a word of it is read.
const STEPS: { icon: 'form' | 'reply' | 'call' | 'plan'; n: string; name: string; note: string }[] = [
  { icon: 'form', n: '01', name: 'Two minutes, no brief', note: 'Five fields, your own words' },
  { icon: 'reply', n: '02', name: 'A straight answer', note: 'In one business day' },
  { icon: 'call', n: '03', name: 'A working call', note: 'Thirty minutes, where the hours go' },
  { icon: 'plan', n: '04', name: 'A plan and a quote', note: 'Free, and yours to keep' },
]

// Stroke icons rather than glyphs: they inherit the ink colour and stay crisp
// at any size, and four of them are cheaper inline than any icon dependency.
function Icon({ name }: { name: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      {name === 'form' && <g {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></g>}
      {name === 'reply' && <g {...p}><path d="M9 10 4 15l5 5" /><path d="M4 15h9a7 7 0 0 0 7-7V5" /></g>}
      {name === 'call' && <g {...p}><rect x="3" y="6" width="12" height="12" rx="2" /><path d="m15 11 6-4v10l-6-4z" /></g>}
      {name === 'plan' && <g {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></g>}
    </svg>
  )
}

export default function ContactFlow() {
  return (
    <div className="cflow">
      <p className="cflow-eyebrow" data-reveal="1">Let&rsquo;s make room for better work.</p>
      <h2 className="cflow-head" data-reveal="1">
        Have a bottleneck in mind?<br />
        <em>A written plan and a quote back.</em>
      </h2>

      <ol className="cflow-row" data-stagger="1">
        {STEPS.map((s) => (
          <li className="cflow-node" key={s.n}>
            <span className="cflow-ring"><Icon name={s.icon} /></span>
            <span className="cflow-num">{s.n}</span>
            <span className="cflow-name">{s.name}</span>
            <span className="cflow-note">{s.note}</span>
          </li>
        ))}
      </ol>

      <p className="cflow-foot" data-reveal="1">
        Free, yours to keep &mdash; and no call needed to find out whether it is worth doing.
      </p>
      {/* The panel this replaced carried the founder line and the email; they
          are the only two facts in it that were not said somewhere else. */}
      <p className="cflow-sign" data-reveal="1">
        Steric Tsui / Founder &middot; Toronto, Canada &middot;{' '}
        <a href="mailto:meetvectis@gmail.com">meetvectis@gmail.com</a>
      </p>
    </div>
  )
}
