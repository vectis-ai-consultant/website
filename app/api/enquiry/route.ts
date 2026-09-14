import { EMAIL_RE, RATE_LIMIT, cut, ipHash, json, resend, sql } from '@/lib/api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/enquiry — the discovery-call qualification form
export async function POST(req: Request) {
  try {
    const b = await req.json()
    for (const f of ['company', 'name', 'message']) {
      if (!cut(b[f], 1)) return json({ error: `Missing ${f}.` }, 400)
    }
    if (!EMAIL_RE.test(b.email ?? '')) return json({ error: 'Invalid email address.' }, 400)

    const ip = await ipHash(req)
    const [{ count }] = await sql<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM enquiries
      WHERE ip_hash = ${ip}
        AND created_at > now() - (${RATE_LIMIT.windowMin} || ' minutes')::interval`
    if (count >= RATE_LIMIT.max) return json({ error: 'Too many requests. Try again later.' }, 429)

    const interests = Array.isArray(b.interests) ? b.interests.slice(0, 10).map((x: unknown) => cut(x, 60)) : []
    // The reference Cal.com hands back when a slot is taken, so the answers and
    // the calendar entry can be matched up. Deliberately unverified: it is a
    // label on our own row, never an authorisation for anything.
    const uid = cut(b.booking_uid, 80) || null
    const startedAt = Date.parse(b.booking_start ?? '')
    const start = Number.isNaN(startedAt) ? null : new Date(startedAt).toISOString()
    await sql`
      INSERT INTO enquiries (company, name, email, team_size, interests, timeline, budget, message, ip_hash,
                             booking_uid, booking_start)
      VALUES (${cut(b.company, 160)}, ${cut(b.name, 120)}, ${cut(b.email, 200).toLowerCase()},
              ${cut(b.team_size, 40)}, ${JSON.stringify(interests)}, ${cut(b.timeline, 60)},
              ${cut(b.budget, 60)}, ${cut(b.message, 4000)}, ${ip}, ${uid}, ${start})`

    // Notify, but never fail the submission on it — the row is already saved.
    try {
      await resend({
        from: process.env.FROM_EMAIL,
        to: process.env.NOTIFY_EMAIL,
        reply_to: cut(b.email, 200),
        subject: `${uid ? 'Booked call' : 'Discovery call'}: ${cut(b.company, 80)}`,
        text: [
          `Company:   ${b.company}`, `Name:      ${b.name}`, `Email:     ${b.email}`,
          `Team size: ${b.team_size || '—'}`, `Interests: ${interests.join(', ') || '—'}`,
          `Timeline:  ${b.timeline || '—'}`, `Budget:    ${b.budget || '—'}`,
          ...(uid ? [`When:      ${start ?? '—'}`, `Booking:   https://cal.com/booking/${uid}`] : []),
          '', b.message,
        ].join('\n'),
      })
    } catch (e) { console.error('notify failed', e) }

    return json({ ok: true })
  } catch (err) {
    console.error(err)
    return json({ error: 'Something went wrong. Try again shortly.' }, 500)
  }
}
