import { RESOURCES, ipHash, readToken, sql } from '@/lib/api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/download?t=... — verifies the signed link, records it, streams the file
export async function GET(req: Request) {
  const claim = await readToken(new URL(req.url).searchParams.get('t'))
  if (!claim) return new Response('This link is invalid or has expired.', { status: 403 })

  const meta = RESOURCES[claim.resource]
  if (!meta) return new Response('File not found.', { status: 404 })

  const src = process.env[meta.urlEnv]
  if (!src) {
    console.error(`${meta.urlEnv} is not set`)
    return new Response('This file is not available yet.', { status: 503 })
  }

  const upstream = await fetch(src, { cache: 'no-store' })
  if (!upstream.ok || !upstream.body) return new Response('File not found.', { status: 404 })

  try {
    await sql`INSERT INTO events (kind, resource, ip_hash)
              VALUES ('download', ${claim.resource}, ${await ipHash(req)})`
  } catch (e) { console.error('download not recorded', e) }

  return new Response(upstream.body, {
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/octet-stream',
      'content-disposition': `attachment; filename="${meta.file}"`,
      'cache-control': 'private, no-store',
    },
  })
}
