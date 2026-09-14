'use client'

import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: '#fbfcfe', border: '1px solid #c8cbd9',
  borderRadius: 999, padding: '15px 20px', fontSize: 15, fontFamily: 'inherit', color: '#1a1740', outline: 'none',
}

export default function EmailGate({ resource }: { resource: string }) {
  const [email, setEmail] = useState('')
  const [trap, setTrap] = useState('')          // honeypot
  const [msg, setMsg] = useState('')
  const [tone, setTone] = useState<'idle' | 'error'>('idle')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (trap) return
    if (!EMAIL_RE.test(email.trim())) {
      setTone('error'); setMsg('That email address doesn’t look right.'); return
    }
    setBusy(true); setTone('idle'); setMsg('Sending…')
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), resource }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
      setSent(true)
    } catch (err) {
      setBusy(false); setTone('error')
      setMsg(`${(err as Error).message} Try again, or email us directly.`)
    }
  }

  if (sent) {
    return <p style={{ fontSize: 15, fontWeight: 600, color: '#3f7a4a', margin: 0 }}>Sent. Check your inbox for the download link.</p>
  }

  return (
    <>
      <form onSubmit={submit} noValidate style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <label style={{ position: 'absolute', left: -9999 }} aria-hidden="true">
          Leave this field empty
          <input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <input
            type="email" required autoComplete="email" placeholder="you@company.com" style={INPUT}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setMsg('') }}
          />
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: '10px 2px 0', minHeight: 18, color: tone === 'error' ? '#b4462f' : '#7b83a8' }}>{msg}</p>
        </div>
        <button type="submit" className="hv5" disabled={busy}
          style={{ flexShrink: 0, background: '#1a1740', color: '#f2f5fb', border: 'none', borderRadius: 999, padding: '16px 28px', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', opacity: busy ? .6 : 1, transition: 'transform .2s, background .2s' }}>
          Send me the link
        </button>
      </form>
      <p style={{ fontSize: 12, color: '#7b83a8', lineHeight: 1.6, margin: '14px 2px 0', maxWidth: 520 }}>
        We&rsquo;ll email you this resource and the occasional note about new ones. Unsubscribe any time. Vectis AI, Toronto, Canada.
      </p>
    </>
  )
}
