import { EMAIL_RE, RATE_LIMIT, RESOURCES, ipHash, json, makeToken, resend, sql } from '@/lib/api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/unlock  { email, resource } -> records the lead, emails a signed link
export async function POST(req: Request) {
  try {
    const { email, resource } = await req.json()
    if (!EMAIL_RE.test(email ?? '')) return json({ error: 'Invalid email address.' }, 400)
    const meta = RESOURCES[resource]
    if (!meta) return json({ error: 'Unknown resource.' }, 404)

    const ip = await ipHash(req)
    const [{ count }] = await sql<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM events
      WHERE kind = 'unlock' AND ip_hash = ${ip}
        AND created_at > now() - (${RATE_LIMIT.windowMin} || ' minutes')::interval`
    if (count >= RATE_LIMIT.max) return json({ error: 'Too many requests. Try again later.' }, 429)

    const clean = String(email).trim().toLowerCase()
    const ua = (req.headers.get('user-agent') ?? '').slice(0, 300)
    await sql`INSERT INTO leads (email, resource, ip_hash, user_agent)
              VALUES (${clean}, ${resource}, ${ip}, ${ua})
              ON CONFLICT (email, resource) DO NOTHING`
    await sql`INSERT INTO events (kind, resource, ip_hash) VALUES ('unlock', ${resource}, ${ip})`

    const link = `${process.env.SITE_ORIGIN}/api/download?t=${await makeToken(resource, clean)}`
    await resend({
      from: process.env.FROM_EMAIL,
      to: clean,
      subject: `Your download: ${meta.name}`,
      text:
        `Here's the ${meta.name} you asked for.\n\n${link}\n\n` +
        `The link works for 7 days. Reply to this email if you hit any trouble — a person reads it.\n\n` +
        `— Vectis AI, Toronto\nYou got this because you requested it at ${process.env.SITE_ORIGIN}. ` +
        `Reply "unsubscribe" and we'll take you off.`,
    })
    return json({ ok: true })
  } catch (err) {
    console.error(err)
    return json({ error: 'Something went wrong. Try again shortly.' }, 500)
  }
}
