# BLAZON — Amazon account management & growth

Implementation of the *BLAZON Master Implementation Blueprint*. Dark obsidian
foundation, logo-derived lime accent, editorial luxury.

**Stack (fixed):** React 18 + Vite · Node.js + Express · PostgreSQL · JWT auth

---

## Running it

```bash
npm run install:all
```

**Database** — PostgreSQL must be running.

```bash
createdb blazon_dev
cd server
cp .env.example .env          # then fill in the two JWT secrets
npm run migrate               # 24 tables, 23 triggers, clean on empty
npm run seed                  # content from the _Marketing archive
npm run seed:admin            # first admin; there is no public registration
```

**Both servers**

```bash
npm run dev                   # client on :5173, API on :4000
```

The client proxies `/api` to the API in development. In production set
`VITE_API_URL` on the client and `CLIENT_URL` on the API.

---

## What is built

| Phase | Status |
| --- | --- |
| 1 · Tokens and asset prep | **Done** |
| 2 · Primitives and motion | **Done** |
| 3 · Database | **Done** |
| 4 · Backend read + write endpoints | **Done** |
| 5 · Auth | **Done** |
| 6 · Lead pipeline | **Done** |
| 7 · Homepage | **Done** |
| 8 · Remaining pages | **Done** |
| 9 · Motion pass | **Done** |
| 10 · Admin panel | API done; **UI not built** |
| 11 · Integration (prerender, sitemap, consent, analytics) | **Partial** — per-route SEO and JSON-LD done |
| 12 · QA and production | Ongoing |

### Not yet built

- **Admin panel UI.** Every endpoint exists and is verified (`/api/admin/*` —
  dashboard, leads with filter/search/sort/paginate, lead detail with event
  timeline, status updates, CSV export, messages, content listing, audit log,
  settings). There are no React screens in front of them yet.
- **Prerendering.** The blueprint calls this the one genuine SEO weakness of a
  Vite SPA (§19.3). Per-route metadata, canonicals, OG and Schema.org are all
  applied client-side, but crawlers would be better served by prerendered HTML.
- **Cookie consent banner and analytics.** The footer control and the
  `POST /api/consent` endpoint exist; the overlay and GA4 injection do not.
- **Media upload.** `media_assets` and the schema are in place; the upload route
  with magic-number validation is not.
- **Content is currently rendered from typed modules in `client/src/data/`,
  not fetched from the API.** Both carry identical content — the seed and the
  modules come from the same source documents — but the admin panel will only
  be useful once the pages read from `/api`.

---

## Structure

```
client/src
  styles/tokens.css     blueprint §04–06 in one file — no hardcoded values after this
  styles/base.css       primitives, every state
  styles/motion.css     the CSS half of the seven reveal patterns
  styles/layout.css     header, dropdowns, drawer, footer
  styles/pages.css      section and page styles
  motion/               Reveal, RevealGroup, EmberWipe, LineDraw, WordRise,
                        Counter, useDrift — each reduced-motion aware
  components/layout/    Section, SectionHeader, PageHero, Header, Footer,
                        PublicLayout (route wipe), Logo
  components/common/    CtaSection, TestimonialWall, FaqAccordion, Seo,
                        EmptyState, StickyCta
  data/                 site, services (36 items), testimonials (12), articles
  pages/                Home (13 sections) + 14 routes

server/src
  config/env.js         validated at boot; the process refuses to start if invalid
  db/migrations/        001_init.sql — 20 tables
  db/seeds/             content.data.js, seed_content.js, seed_admin.js
  db/repositories/      SQL lives only here
  services/             plain arguments in, plain data out; never touch req/res
  routes/               public, auth, admin
  middleware/           auth, validate, error
```

---

## Things worth knowing

**Dark is the foundation because of contrast, not taste.** The logo green
`#8AB04B` measures 7.80:1 on near-black and 2.33:1 on off-white. On a light
site the brand's own accent could not legally carry text. `Section` takes a
`surface` prop that rewrites the colour tokens, so one component set serves
both — on light surfaces the accent steps down to `green-700` for fills and
`green-800` for text automatically.

**Reduced motion is a rendering path, not a fallback.** Hidden initial states
are scoped to `html.motion-on`, added only when JS runs *and*
`prefers-reduced-motion` is unset. Both pages render complete without either.

**No lead is ever lost.** The lead commits to PostgreSQL with its first event
in one transaction, before any notification is attempted. With SMTP
unconfigured the lead still persists and surfaces on the dashboard as
`notify_status='failed'`. Verified by running exactly that.

**Discrepancies between the blueprint and the source archive are recorded, not
resolved silently.** See [BLAZON-FINDINGS.md](BLAZON-FINDINGS.md) — most
importantly the service count, which the blueprint prints as 38 in shipping
headline copy while the source document lists 36.
