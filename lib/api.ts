import { neon } from '@neondatabase/serverless'

// One row per gated resource. `urlEnv` names the env var holding its Blob URL —
// the URL is never sent to the browser, so the signed link stays the only way in.
export const RESOURCES: Record<string, { name: string; file: string; urlEnv: string }> = {
  'poster-ad-batch': {
    name: 'Poster ad batch maker',
    file: 'poster-ad-batch.zip',
    urlEnv: 'RESOURCE_POSTER_AD_BATCH_URL',
  },
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const LINK_TTL_S = 7 * 24 * 60 * 60
export const RATE_LIMIT = { max: 5, windowMin: 60 }

// neon() validates the connection string the moment it is called, so it cannot run
// at module scope: `next build` evaluates these routes to collect page data, long
// before any env var exists. Connect on the first query instead.
type Sql = <T = Record<string, unknown>>(s: TemplateStringsArray, ...v: unknown[]) => Promise<T[]>

let client: Sql | null = null
export const sql: Sql = (strings, ...values) => {
  if (!client) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not set')
    client = neon(url) as unknown as Sql
  }
  return client(strings, ...values)
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

const enc = new TextEncoder()

const b64url = {
  enc: (bytes: ArrayBuffer | Uint8Array) =>
    Buffer.from(bytes as ArrayBuffer).toString('base64url'),
  dec: (s: string) => new Uint8Array(Buffer.from(s, 'base64url')),
}

async function sign(secret: string, payload: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64url.enc(await crypto.subtle.sign('HMAC', key, enc.encode(payload)))
}

// Constant-time compare — a fast-exit compare here leaks the signature byte by byte.
const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// IPs are hashed with the token secret so the table holds no raw addresses.
// Vercel puts the client address first in x-forwarded-for.
export async function ipHash(req: Request) {
  const fwd = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
  const ip = fwd || req.headers.get('x-real-ip') || ''
  return (await sha256Hex(`${ip}|${process.env.TOKEN_SECRET ?? ''}`)).slice(0, 32)
}

export async function makeToken(resource: string, email: string) {
  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_S
  const payload = `${resource}|${email}|${exp}`
  return `${b64url.enc(enc.encode(payload))}.${await sign(process.env.TOKEN_SECRET ?? '', payload)}`
}

export async function readToken(token: string | null) {
  const [body, sig] = String(token ?? '').split('.')
  if (!body || !sig) return null
  const payload = new TextDecoder().decode(b64url.dec(body))
  if (!timingSafeEqual(sig, await sign(process.env.TOKEN_SECRET ?? '', payload))) return null
  const [resource, email, exp] = payload.split('|')
  if (!resource || !exp || Number(exp) < Math.floor(Date.now() / 1000)) return null
  return { resource, email }
}

export const cut = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n)

export async function resend(payload: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`)
}
