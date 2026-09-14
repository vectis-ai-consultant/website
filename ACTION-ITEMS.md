# Vectis AI — Client site: action items

Implementation of `Vectis AI -Client-.dc.html` is complete and verified.
These are the decisions I made on your behalf, plus the things only you can resolve.

## 1. Links that go nowhere (need real destinations)

These were placeholders in the artboard. I carried them over as-is rather than
inventing URLs.

| Where | Current target | Needs |
|---|---|---|
| ~~Contact card / CTA banner — "Book a discovery call"~~ | `#contact` | **Done** — the contact panel now books on Cal.com (`NEXT_PUBLIC_CAL_LINK`) and asks the questions after |
| Nav / footer — "Free resources" | `Free Resources.dc.html` | That page does not exist here |
| Top bar — "Recruiter" | `Steric%20Tsui%20-Recruiter-.dc.html?intro=1` | That page does not exist here |
| Services — "Case study↗" | `#contact` | Real case-study page, or drop the arrow |

Only the **Client** artboard was implemented. The sibling artboards (Recruiter,
Free Resources, Portfolio Gate, v1/v2 variants) were not built — say the word and
I'll do them the same way.

## 2. Contact details — confirm these are the ones you want public

- Email: `meetvectis@gmail.com` (changed 2026-09-08 from a `.edu` address; still not
  on a `@vectis` domain, which would read better again)
- LinkedIn: `linkedin.com/in/steric-tsui`
- GitHub: `github.com/stericishere`

## 3. Third-party requests at page load (no offline fallback)

The page is static but not self-contained. It fetches at runtime from:

- `unpkg.com` — three.js 0.160.0, dynamically imported by the hero scene
- `cdn.simpleicons.org` — the tool logos, in both the hero and the tools grid

`www.google.com/s2/favicons` was **removed** (2026-09-03). It supplied the OpenAI,
Higgsfield, Codex and Slack marks in the hero, but that host sends no
`access-control-allow-origin`, and the hero draws marks into a canvas used as a WebGL
texture — which requires `crossOrigin="anonymous"`, or the canvas taints and the
texture cannot be uploaded. Those four images therefore *never* loaded and always fell
back to a giant single letter ("O", "S", "C").

Those marks are now **self-hosted** in `assets/logos/tools/` — same origin, so neither
CORS nor tainting applies, and they work offline:

| File | Used for | Source |
|---|---|---|
| `openai.svg` | OpenAI | simple-icons v11.14.0, brand colour baked in |
| `slack-color.svg` | Slack | vectorlogo.zone, real four-colour mark |
| `instagram-color.svg` | Instagram | vectorlogo.zone, real gradient mark |
| `tiktok-color.svg` | TikTok | vectorlogo.zone, real cyan/red mark |
| `shopify-color.svg` | Shopify | vectorlogo.zone, real two-green bag |
| `salesforce.svg` | Salesforce (tools grid) | simple-icons v11.14.0, `#00a1e0` baked in |
| `lark.png` | Lark | Wikimedia Commons "Lark Suite logo 2022", 792px |

Lark has no mark on simple-icons or vectorlogo.zone, and larksuite.com exposes only a
48px favicon — too soft at the size the hero draws marks — hence Wikimedia.

## 4b. The hero tool line-up (decided with you 2026-09-03)

Eight tiles in a 4 / 3 / 1 pyramid, replacing the design's ten:

```
            Lark                 the market-specific signal
     Instagram TikTok Shopify    where the client's customers arrive
  OpenAI Claude Gemini Slack     the AI layer + the team's workspace
```

**Dropped**: PostgreSQL and Cloudflare (infrastructure — invisible to an SME owner),
Codex (a duplicate OpenAI mark, and a developer tool the buyer never touches),
Higgsfield (a good tool, but a brand the buyer has never heard of, and recognition is
the entire mechanism of a logo wall), Notion, n8n.

The reasoning: the hero previously advertised *the tools Vectis builds with*, while the
copy below it promises *"the CRM your team lives in… no migration, no new logins"* —
i.e. the tools the client already uses. Those are two different pitches at two different
buyers. The line-up above commits to the second one, which is what the rest of the page
already sells.

**Still open**: the tools grid in §01 "How it works" still lists Postgres, Cloudflare,
Supabase and similar. That is arguably right — it is the depth section, read by someone
who already wants detail — but if you want the whole page to speak only to owners, that
grid is the next thing to revisit.

Current simple-icons no longer ships the OpenAI, Slack, Salesforce or Pipedrive marks —
they were withdrawn on trademark request — which is why v11.14.0 is pinned as the source.
Three names have no mark on any source and stay as wordmark chips: **Pipedrive**,
**Llama**, **Custom**.

Codex was dropped from the hero, so the duplicate-OpenAI-tile problem is gone.

If you want zero third-party calls (privacy, GDPR, or offline demos), I can vendor
all of these locally. Pinning three.js locally is worth doing regardless — an unpkg
outage currently means no hero animation.

## 4. Things I added that were not in the design

- **A responsive layer.** The artboard is a fixed 1440x900 desktop frame with no
  mobile design. I added breakpoints at 1040 / 720 / 560px. Verified at 390px:
  no horizontal overflow, panel grids stack to one column, nav wraps, h1 drops to
  34px. This is my layout judgment, not yours — review it on a real phone.
- **Keyboard access on the service tabs.** The design used plain `div onClick`,
  which no keyboard or screen reader can reach. I added
  `role="button" tabindex="0" aria-pressed` plus Enter/Space handling, and
  `aria-label`s on the hero dots and home button.
- **Tool marks are app-icon tiles** (2026-09-03, your call). In the hero the tools were
  flat transparent planes; they are now extruded rounded-square tiles with a bevelled
  edge, a lit face and real shadows. In the tools grid the marks were monochrome glyphs
  behind a grayscale filter at 55% opacity; they are now raised tiles in full brand
  colour that lift on hover. Every brand that has a published mark now shows it; the
  ones the CDN no longer carries are self-hosted — see §3.
- **The hero scene was brightened** (2026-09-03, your call): tone-mapping exposure
  1.05 → 1.22, hemisphere light 1.4 → 1.95 with a warmer bounce colour, sun 2.2 → 2.5,
  a new shadowless fill light from the camera side, contact-shadow opacity 0.12 → 0.085,
  and the fulcrum, lever, tile edge and tile face all lightened. Say the word if you
  want it pushed further — exposure is the single dial.
- **Five extra scroll effects** (2026-09-03, your call), all guarded by
  `prefers-reduced-motion`:
  1. the serif section numerals drift against the scroll;
  2. the giant footer wordmark slides horizontally as it passes;
  3. the nav pill lights the section you are currently in;
  4. the tool marquees speed up with scroll velocity and coast back down;
  5. the two big section headlines land word by word.

  These use the `translate` property, never `transform` — the reveal animations own
  `transform`, and an inline one would beat the stylesheet and stop them animating
  (the same inline-style trap as the two bugs above).

## 5. Notes

- `support.js` was **not** shipped. It is the Claude Design canvas editor runtime
  ("GENERATED … do not edit"), needs `window.React`, and has no role on a live site.
  All of its behaviour was reimplemented in `main.js`.
- The intro overlay is preserved but gated behind `?intro=1`, exactly as the design
  had it. A normal load shows no intro.

## 6. Not yet done

- No favicon set beyond the lambda PNG; no OG/Twitter card image.
- No analytics, no form backend (the contact card is links only, no form).
- Not deployed. It is a plain static folder — drop it on Netlify / Vercel / Cloudflare
  Pages as-is.
