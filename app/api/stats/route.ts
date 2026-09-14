import { json, sql } from '@/lib/api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/stats — counts, behind the admin bearer token
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return json({ error: 'unauthorized' }, 401)
  }
  try {
    const events = await sql`SELECT resource, kind, COUNT(*)::int AS n FROM events
                             GROUP BY resource, kind ORDER BY resource, kind`
    const leads = await sql`SELECT resource, COUNT(DISTINCT email)::int AS emails FROM leads
                            GROUP BY resource`
    return json({ events, leads })
  } catch (err) {
    console.error(err)
    return json({ error: 'Something went wrong. Try again shortly.' }, 500)
  }
}
