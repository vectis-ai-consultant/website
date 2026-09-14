# Free-resource gate — deploy

Static site runs on Cloudflare Pages; this Worker answers `/api/*` on the same
hostname, so the browser never makes a cross-origin request.

## One-time setup

```bash
npm i -g wrangler && wrangler login

wrangler d1 create vectis-resources          # paste database_id into wrangler.toml
wrangler d1 execute vectis-resources --remote --file=schema.sql
wrangler r2 bucket create vectis-resources

wrangler secret put RESEND_API_KEY           # resend.com, after verifying the sending domain
wrangler secret put TOKEN_SECRET             # openssl rand -hex 32
wrangler secret put ADMIN_TOKEN              # openssl rand -hex 32
```

Set `SITE_ORIGIN` and `FROM_EMAIL` in `wrangler.toml`, uncomment `routes`, then:

```bash
wrangler deploy
```

Finally set `window.VECTIS_API = ''` for production in `../config.js` (it already
resolves to same-origin off localhost).

## Adding a resource

1. Upload the file: `wrangler r2 object put vectis-resources/<key> --file=<path> --remote`
2. Add an entry to `RESOURCES` in `src/index.js` (`key` = the R2 object name)
3. Point the card at `post.html?p=<slug>` and put `<div data-gate="<slug>"></div>` in the post

## Reading the numbers

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://vectis.ai/api/stats
```

`events.kind` is `read` (opened the post), `unlock` (gave an email) or `download`
(actually fetched the file). `leads` counts distinct addresses per resource.

## Known gaps

- **No bot protection yet.** The form has a honeypot and a 5/hour per-IP limit, but a
  determined script gets through. Add Cloudflare Turnstile before promoting the page.
- **Delivery is a single point of failure.** If Resend is down the lead is stored but
  the email never arrives. Consider also revealing the link on-page after submit.
- **No unsubscribe endpoint.** CASL requires a working one before sending anything
  beyond the requested resource. Replies are monitored; that is the current mechanism.
