'use client'

import { useState } from 'react'

// Discovery-call qualification form. Asks for what the first call would otherwise
// be spent collecting: identity, scope, timeline, budget — then the problem.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const SERVICES = ['AI agents & automation', 'AI video generation',
                  'Chatbots & LLM integration', 'Corporate AI training', 'Not sure yet']
const TEAM     = ['Just me', '2–10', '11–50', '51–200', '200+']
const TIMELINE = ['Just exploring', 'Next month', 'This quarter', 'Already scoped']
const BUDGET   = ['Not sure yet', 'Under $5k', '$5k – $15k', '$15k – $50k', '$50k+']

// White on the card's #fbfcff, so a field reads as a field before you click it.
const F: React.CSSProperties = {
  // backgroundColor, not background: the shorthand would wipe the select arrow
  // that home.css paints as a background-image.
  fontFamily: 'inherit', fontSize: 15, color: '#1a1740', backgroundColor: '#fff',
  border: '1px solid #c0c6dc', borderRadius: 10, padding: '13px 15px',
  width: '100%', boxSizing: 'border-box',
}
const L: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#4a4f70', margin: '0 0 8px' }
const REQ = <span style={{ color: '#3a4fae' }}>*</span>

// Selected chips invert. Colour alone would fail WCAG 1.4.1, so each chip also
// swaps + for ✓, and the native checkbox stays in the DOM — hidden from sight,
// not from assistive tech.
const CHIP = (on: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14,
  borderRadius: 999, padding: '10px 16px', cursor: 'pointer',
  color: on ? '#f2f5fb' : '#343061',
  background: on ? '#1a1740' : '#fff',
  border: `1px solid ${on ? '#1a1740' : '#c0c6dc'}`,
  transition: 'background .15s, color .15s, border-color .15s',
})
const HIDDEN: React.CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
}

// What BookingFlow hands over once a slot is taken: the reference to store
// alongside the answers, plus whoever Cal.com already asked for.
export type Booking = { uid: string; startTime: string; name?: string; email?: string }

export default function EnquiryForm({ booking }: { booking?: Booking | null }) {
  const [interests, setInterests] = useState<string[]>([])
  const [trap, setTrap] = useState('')            // honeypot
  const [msg, setMsg] = useState('')
  const [tone, setTone] = useState<'idle' | 'error'>('idle')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const say = (t: string, bad = false) => { setMsg(t); setTone(bad ? 'error' : 'idle') }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (trap) return
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const payload = {
      company: get('company'), name: get('name'), email: get('email'),
      team_size: get('team_size'), timeline: get('timeline'), budget: get('budget'),
      message: get('message'), interests,
      booking_uid: booking?.uid ?? '', booking_start: booking?.startTime ?? '',
    }
    if (!payload.company || !payload.name) return say('Company and name are required.', true)
    if (!EMAIL_RE.test(payload.email)) return say('That email address doesn’t look right.', true)
    if (!payload.message) return say('Tell me briefly where growth is getting stuck.', true)

    setBusy(true); say('Sending…')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
      setSent(true)
    } catch (err) {
      setBusy(false); say((err as Error).message, true)
    }
  }

  if (sent) {
    return (
      <div role="status">
        <p style={{ fontSize: 17, fontWeight: 600, color: '#3f7a4a', margin: '0 0 8px' }}>Got it — thanks.</p>
        <p style={{ fontSize: 15, color: '#4a4f70', margin: 0, lineHeight: 1.7 }}>
          {booking
            ? 'These go straight into the notes for our call, so we can start from what you actually need rather than from scratch.'
            : 'I\u2019ll reply within one business day, and if I don\u2019t think I can help I\u2019ll say so rather than book the call.'}
        </p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      {/* Only once a slot is taken: it says why there is still a form. It lives
          here rather than in the panel heading so it leaves with the fields. */}
      {booking && (
        <p style={{ gridColumn: '1/-1', fontSize: 14, color: '#4a4f70', margin: '0 0 4px', lineHeight: 1.6 }}>
          These are what the call would otherwise start with &mdash; answer them now and we can skip that part.
        </p>
      )}

      <label style={HIDDEN} aria-hidden="true">
        Leave empty
        <input name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </label>

      <div><label htmlFor="q-company" style={L}>Company {REQ}</label><input id="q-company" name="company" style={F} autoComplete="organization" /></div>
      <div><label htmlFor="q-name" style={L}>Your name {REQ}</label><input id="q-name" name="name" style={F} autoComplete="name" defaultValue={booking?.name ?? ''} /></div>
      <div><label htmlFor="q-email" style={L}>Email {REQ}</label><input id="q-email" name="email" type="email" style={F} autoComplete="email" defaultValue={booking?.email ?? ''} /></div>
      <div>
        <label htmlFor="q-team" style={L}>Team size</label>
        <select id="q-team" name="team_size" style={F} defaultValue=""><option value="">How many people?</option>{TEAM.map((o) => <option key={o} value={o}>{o}</option>)}</select>
      </div>

      <fieldset style={{ gridColumn: '1/-1', border: 0, margin: 0, padding: 0, minInlineSize: 0 }}>
        <legend style={{ ...L, padding: 0 }}>What are you looking at?</legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SERVICES.map((s) => {
            const on = interests.includes(s)
            return (
              <label key={s} className="chip" style={CHIP(on)}>
                <input type="checkbox" name="interests" value={s} style={HIDDEN} checked={on}
                  onChange={(e) => setInterests((prev) => e.target.checked ? [...prev, s] : prev.filter((x) => x !== s))} />
                <span aria-hidden="true" style={{ fontSize: 12, opacity: on ? 1 : .4 }}>{on ? '✓' : '+'}</span>
                {s}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="q-timeline" style={L}>Timeline</label>
        <select id="q-timeline" name="timeline" style={F} defaultValue=""><option value="">When would you start?</option>{TIMELINE.map((o) => <option key={o} value={o}>{o}</option>)}</select>
      </div>
      <div>
        <label htmlFor="q-budget" style={L}>Budget (CAD)</label>
        <select id="q-budget" name="budget" style={F} defaultValue=""><option value="">Rough range</option>{BUDGET.map((o) => <option key={o} value={o}>{o}</option>)}</select>
      </div>

      <div style={{ gridColumn: '1/-1' }}>
        <label htmlFor="q-message" style={L}>What would you do more of, if it didn&rsquo;t cost more to do? {REQ}</label>
        <p id="q-message-hint" style={{ fontSize: 13, color: '#7b83a8', margin: '0 0 10px', lineHeight: 1.55 }}>
          More leads, faster follow-up, more content — whatever is capped right now by the hours your team has.
        </p>
        <textarea id="q-message" name="message" rows={4} aria-describedby="q-message-hint" style={{ ...F, resize: 'vertical' }}
          placeholder="e.g. we could handle twice the leads but nobody follows up past day one · quotes take a day, so people go elsewhere · we only post when I make time for it" />
      </div>

      <div style={{ gridColumn: '1/-1' }}>
        <button type="submit" disabled={busy}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1740', color: '#f2f5fb', border: 'none', borderRadius: 10, padding: '19px 24px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', opacity: busy ? .6 : 1 }}>
          {booking ? 'Send my details' : 'Request a discovery call'}
          <span aria-hidden="true">&#8599;</span>
        </button>
        <p role="alert" style={{ fontSize: 13, margin: '14px 0 0', color: tone === 'error' ? '#b4462f' : '#4a4f70' }}>{msg}</p>
      </div>
    </form>
  )
}
