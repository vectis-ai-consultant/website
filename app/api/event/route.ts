import { ipHash, json, sql } from '@/lib/api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/event  { kind: 'read', resource }
export async function POST(req: Request) {
  try {
    const { kind, resource } = await req.json()
    if (kind !== 'read' || !resource) return json({ error: 'bad request' }, 400)
    await sql`INSERT INTO events (kind, resource, ip_hash)
              VALUES ('read', ${String(resource).slice(0, 80)}, ${await ipHash(req)})`
    return json({ ok: true })
  } catch (err) {
    console.error(err)
    return json({ error: 'Something went wrong. Try again shortly.' }, 500)
  }
}
