'use client'

import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import EnquiryForm, { type Booking } from './EnquiryForm'

// Two steps, in the order a call actually happens: pick the slot first, then
// answer the questions the call would otherwise be spent on. Booking is not a
// gate — the left-hand column promises an answer without a call, so step one
// can always be skipped.
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'vectis-ai/30min'

// The V2 event carries the booking reference; only the older one carries who
// booked. Both fire for the same booking, so the pieces are merged as they
// arrive rather than waiting for either one in particular.
const attendee = (payload: unknown) => {
  const a = (payload as { booking?: { attendees?: { name?: string; email?: string }[] } })?.booking?.attendees?.[0]
  return { name: a?.name ?? '', email: a?.email ?? '' }
}

export default function BookingFlow() {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [details, setDetails] = useState(false)

  useEffect(() => {
    let live = true
    ;(async () => {
      const cal = await getCalApi()
      if (!live) return
      // The embed is pinned to the light theme below, but the type wants both.
      const brand = { 'cal-brand': '#3a4fae' }
      cal('ui', { cssVarsPerTheme: { light: brand, dark: brand } })
      cal('on', {
        action: 'bookingSuccessfulV2',
        callback: (e) => {
          const d = e.detail.data
          setBooking((b) => ({ ...b, uid: d.uid ?? '', startTime: d.startTime ?? '' }))
          setDetails(true)
        },
      })
      cal('on', {
        action: 'bookingSuccessful',
        callback: (e) => {
          const who = attendee(e.detail.data)
          setBooking((b) => ({ uid: '', startTime: '', ...b, ...who }))
          setDetails(true)
        },
      })
    })()
    return () => { live = false }
  }, [])

  if (details) {
    return (
      <>
        <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.015em', margin: '0 0 8px' }}>
          {booking ? 'Your slot is held.' : 'Start a conversation.'}
        </h3>
        {booking
          ? <p style={{ fontSize: 14, color: '#4a4f70', margin: '0 0 28px', lineHeight: 1.6 }}>
              {when(booking.startTime)} &mdash; a confirmation is on its way to your inbox.
            </p>
          : <p style={{ fontSize: 14, color: '#4a4f70', margin: '0 0 28px', lineHeight: 1.6 }}>
              No technical brief needed. Just tell me what is taking up the time.
            </p>}
        {/* The two Cal.com events arrive as separate messages, so the attendee
            can land a tick after the form has mounted — and an uncontrolled
            input ignores a changed defaultValue. Keying on the address remounts
            it once, whichever order they come in. */}
        <EnquiryForm key={booking?.email ?? ''} booking={booking} />
      </>
    )
  }

  return (
    <>
      <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.015em', margin: '0 0 8px' }}>Pick a time.</h3>
      <p style={{ fontSize: 14, color: '#4a4f70', margin: '0 0 20px', lineHeight: 1.6 }}>
        Thirty minutes, on your calendar. The questions come after — nothing to prepare.
      </p>
      {/* The embed is an iframe: if it is blocked or slow, the link underneath
          still books, and the button still reaches the questions. */}
      {/* No fixed height: the embed sizes itself to the month grid, which is a
          different height on a phone than in this column. */}
      <Cal calLink={CAL_LINK} config={{ layout: 'month_view', theme: 'light' }}
        style={{ width: '100%', borderRadius: 12 }} />
      <p style={{ fontSize: 13, color: '#7b83a8', margin: '18px 0 0', lineHeight: 1.7 }}>
        Calendar not loading? <a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer" style={{ color: '#4a4f70', borderBottom: '1px solid #cdd8ee' }}>Book on cal.com</a>.<br />
        <button type="button" onClick={() => setDetails(true)}
          style={{ font: 'inherit', fontSize: 13, color: '#4a4f70', background: 'none', border: 0, borderBottom: '1px solid #cdd8ee', padding: 0, cursor: 'pointer' }}>
          Rather not book a call? Send your details instead &#8594;
        </button>
      </p>
    </>
  )
}

// Shown back in the visitor's own timezone, because that is the one they chose
// the slot in.
function when(iso: string) {
  const d = new Date(iso)
  if (!iso || Number.isNaN(d.getTime())) return 'Booked'
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(d)
}
