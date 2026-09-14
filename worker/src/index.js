// Vectis AI — free-resource gate.
//   POST /api/unlock    { email, resource }  -> records the lead, emails a signed link
//   GET  /api/download?t=...                 -> verifies the link, records it, streams the file
//   POST /api/event     { kind, resource }   -> records a read
//   GET  /api/stats                          -> counts (admin bearer token)

const RESOURCES = {
  'poster-ad-batch': { key: 'poster-ad-batch.zip', name: 'Poster ad batch maker' }
  // add one entry per gated resource; `key` is the object name in R2
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LINK_TTL_S = 7 * 24 * 60 * 60;   // 7 days
const RATE_LIMIT = { max: 5, windowMin: 60 };

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra }
  });

const b64url = {
  enc: (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
};

const hmacKey = (secret) => crypto.subtle.importKey(
  'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
);

async function sign(secret, payload) {
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), new TextEncoder().encode(payload));
  return b64url.enc(sig);
}

// Constant-time compare — a fast-exit compare here leaks the signature byte by byte.
const timingSafeEqual = (a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// IPs are hashed with the token secret so the table holds no raw addresses.
const ipHash = (req, secret) =>
  sha256Hex((req.headers.get('cf-connecting-ip') || '') + '|' + secret).then(h => h.slice(0, 32));

async function makeToken(env, resource, email) {
  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_S;
  const payload = `${resource}|${email}|${exp}`;
  return b64url.enc(new TextEncoder().encode(payload)) + '.' + await sign(env.TOKEN_SECRET, payload);
}

async function readToken(env, token) {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  const payload = new TextDecoder().decode(b64url.dec(body));
  if (!timingSafeEqual(sig, await sign(env.TOKEN_SECRET, payload))) return null;
  const [resource, email, exp] = payload.split('|');
  if (!resource || !exp || Number(exp) < Math.floor(Date.now() / 1000)) return null;
  return { resource, email };
}

async function sendEmail(env, to, resource, link) {
  const meta = RESOURCES[resource];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to,
      subject: `Your download: ${meta.name}`,
      text: `Here's the ${meta.name} you asked for.\n\n${link}\n\n`
          + `The link works for 7 days. Reply to this email if you hit any trouble — a person reads it.\n\n`
          + `— Vectis AI, Toronto\nYou got this because you requested it at ${env.SITE_ORIGIN}. `
          + `Reply "unsubscribe" and we'll take you off.`
    })
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: {
        'access-control-allow-origin': env.SITE_ORIGIN,
        'access-control-allow-headers': 'content-type',
        'access-control-allow-methods': 'POST, GET, OPTIONS'
      }});
    }
    const cors = { 'access-control-allow-origin': env.SITE_ORIGIN };

    try {
      // ---- record a read -------------------------------------------------
      if (path === '/api/event' && request.method === 'POST') {
        const { kind, resource } = await request.json();
        if (kind !== 'read' || !resource) return json({ error: 'bad request' }, 400, cors);
        await env.DB.prepare('INSERT INTO events (kind, resource, ip_hash) VALUES (?1, ?2, ?3)')
          .bind('read', String(resource).slice(0, 80), await ipHash(request, env.TOKEN_SECRET)).run();
        return json({ ok: true }, 200, cors);
      }

      // ---- email gate ----------------------------------------------------
      if (path === '/api/unlock' && request.method === 'POST') {
        const { email, resource } = await request.json();
        if (!EMAIL_RE.test(email || '')) return json({ error: 'Invalid email address.' }, 400, cors);
        if (!RESOURCES[resource])        return json({ error: 'Unknown resource.' }, 404, cors);

        const ip = await ipHash(request, env.TOKEN_SECRET);
        const { count } = await env.DB
          .prepare(`SELECT COUNT(*) AS count FROM events
                    WHERE kind='unlock' AND ip_hash=?1 AND created_at > datetime('now', ?2)`)
          .bind(ip, `-${RATE_LIMIT.windowMin} minutes`).first();
        if (count >= RATE_LIMIT.max) return json({ error: 'Too many requests. Try again later.' }, 429, cors);

        const clean = String(email).trim().toLowerCase();
        await env.DB.batch([
          env.DB.prepare(`INSERT INTO leads (email, resource, ip_hash, user_agent) VALUES (?1,?2,?3,?4)
                          ON CONFLICT(email, resource) DO NOTHING`)
            .bind(clean, resource, ip, (request.headers.get('user-agent') || '').slice(0, 300)),
          env.DB.prepare('INSERT INTO events (kind, resource, ip_hash) VALUES (?1,?2,?3)')
            .bind('unlock', resource, ip)
        ]);

        const link = `${env.SITE_ORIGIN}/api/download?t=${await makeToken(env, resource, clean)}`;
        await sendEmail(env, clean, resource, link);
        return json({ ok: true }, 200, cors);
      }


      // ---- discovery-call enquiry -----------------------------------------
      if (path === '/api/enquiry' && request.method === 'POST') {
        const b = await request.json();
        const need = ['company', 'name', 'message'];
        for (const f of need) if (!String(b[f] || '').trim()) return json({ error: `Missing ${f}.` }, 400, cors);
        if (!EMAIL_RE.test(b.email || '')) return json({ error: 'Invalid email address.' }, 400, cors);

        const ip = await ipHash(request, env.TOKEN_SECRET);
        const { count } = await env.DB
          .prepare(`SELECT COUNT(*) AS count FROM enquiries
                    WHERE ip_hash=?1 AND created_at > datetime('now', ?2)`)
          .bind(ip, `-${RATE_LIMIT.windowMin} minutes`).first();
        if (count >= RATE_LIMIT.max) return json({ error: 'Too many requests. Try again later.' }, 429, cors);

        const cut = (v, n) => String(v || '').trim().slice(0, n);
        const interests = Array.isArray(b.interests) ? b.interests.slice(0, 10).map(x => cut(x, 60)) : [];
        await env.DB.prepare(
          `INSERT INTO enquiries (company, name, email, team_size, interests, timeline, budget, message, ip_hash)
           VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)`
        ).bind(
          cut(b.company, 160), cut(b.name, 120), cut(b.email, 200).toLowerCase(),
          cut(b.team_size, 40), JSON.stringify(interests), cut(b.timeline, 60),
          cut(b.budget, 60), cut(b.message, 4000), ip
        ).run();

        // Notify, but never fail the submission on it — the row is already saved.
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
            body: JSON.stringify({
              from: env.FROM_EMAIL, to: env.NOTIFY_EMAIL, reply_to: cut(b.email, 200),
              subject: `Discovery call: ${cut(b.company, 80)}`,
              text: [`Company:   ${b.company}`, `Name:      ${b.name}`, `Email:     ${b.email}`,
                     `Team size: ${b.team_size || '—'}`, `Interests: ${interests.join(', ') || '—'}`,
                     `Timeline:  ${b.timeline || '—'}`, `Budget:    ${b.budget || '—'}`,
                     '', b.message].join('\n')
            })
          });
        } catch (e) { console.error('notify failed', e); }

        return json({ ok: true }, 200, cors);
      }

      // ---- gated download ------------------------------------------------
      if (path === '/api/download' && request.method === 'GET') {
        const claim = await readToken(env, url.searchParams.get('t'));
        if (!claim) return new Response('This link is invalid or has expired.', { status: 403 });

        const meta = RESOURCES[claim.resource];
        const obj = await env.FILES.get(meta.key);
        if (!obj) return new Response('File not found.', { status: 404 });

        await env.DB.prepare('INSERT INTO events (kind, resource, ip_hash) VALUES (?1,?2,?3)')
          .bind('download', claim.resource, await ipHash(request, env.TOKEN_SECRET)).run();

        return new Response(obj.body, { headers: {
          'content-type': obj.httpMetadata?.contentType || 'application/octet-stream',
          'content-disposition': `attachment; filename="${meta.key}"`,
          'cache-control': 'private, no-store'
        }});
      }

      // ---- counts ---------------------------------------------------------
      if (path === '/api/stats' && request.method === 'GET') {
        if (request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`)
          return json({ error: 'unauthorized' }, 401, cors);
        const { results } = await env.DB.prepare(
          `SELECT resource, kind, COUNT(*) AS n FROM events GROUP BY resource, kind ORDER BY resource, kind`
        ).all();
        const { results: leads } = await env.DB.prepare(
          `SELECT resource, COUNT(DISTINCT email) AS emails FROM leads GROUP BY resource`
        ).all();
        return json({ events: results, leads }, 200, cors);
      }

      return json({ error: 'not found' }, 404, cors);
    } catch (err) {
      console.error(err);
      return json({ error: 'Something went wrong. Try again shortly.' }, 500, cors);
    }
  }
};
