# Amazon Growth Agency — Homepage & Contact Page

A MERN build of the *Homepage and Contact Page Roadmap* specification: two pages
on a unified white + amber-orange visual system, with a full design-token layer,
seven reusable motion primitives, and a first-class reduced-motion rendering path.

- **Client** — Vite + React 19 + TypeScript, React Router
- **Server** — Express + Mongoose (MongoDB), Zod validation

## Getting started

```bash
npm run install:all
```

Copy the server environment file and point it at a MongoDB instance:

```bash
cp server/.env.example server/.env
```

Run the client and API together:

```bash
npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` to the API on
`http://localhost:4000`. The API starts without MongoDB so the front end can be
developed against it, but submissions then return 503 and log the payload rather
than reporting a false success.

Other scripts: `npm run build`, `npm run typecheck`, `npm run lint`.

## Structure

```
client/src
  styles/tokens.css     Phase 01 — colour, type, spacing, radius, shadow, motion tokens
  styles/base.css       Phase 02 — primitives: button, link, input, card, pill, eyebrow
  styles/motion.css     Phase 03 — the CSS half of the motion primitives
  styles/shell.css      Phase 04 — header states, mobile drawer, footer
  styles/home.css       H1–H10
  styles/contact.css    C1–C5
  motion/               Reveal, RevealGroup, MaskWipe, LineDraw, WordRise, CountUp,
                        useReveal, useParallax, useReducedMotion, useMediaQuery
  components/shell/     Header, Footer, BackgroundLayer
  components/ui/        SectionHeader, icons
  sections/home/        H1 Hero … H10 ContactCta, plus the mobile sticky CTA
  sections/contact/     C1 ContactHero … C5 ContactFaq, form schema
  pages/                HomePage, ContactPage

server/src
  index.ts              App, CORS, rate limiting, health check, Mongo connection
  models/Lead.ts        Audit request schema
  routes/leads.ts       POST /api/leads with server-side validation
```

## How the harder pieces work

**Reduced motion is a rendering path, not a fallback.** The hidden initial
states live behind `html.motion-on`, which is only ever added when JavaScript
runs *and* `prefers-reduced-motion` is unset. With motion off, nothing is hidden
and both pages render complete and well-composed.

**Two sections recompose rather than shrink.** H4 (pinned solutions) and H7
(horizontal case studies) drop their pins below 768px and become stacked cards
and a native snap carousel. Scroll-driven pinning on touch fights the platform's
native scroll.

**Section boundaries crossfade on one shared layer.** `BackgroundLayer` paints a
fixed gradient whose stops are the on-screen section boundaries, softened over a
per-boundary overlap. Animating each section's own background produces a visible
seam; interpolating one layer beneath the content does not. Sections only go
transparent once the layer has painted, so a viewport it cannot measure falls
back to per-section backgrounds.

**Count-up reserves its own width.** The final value renders as an inert spacer
stacked beneath the animating one, so there is zero layout shift and no
measurement pass.

## Rules this build holds to

- Orange at three fixed weights: **600 fills actions, 800 writes text, 500 draws
  graphics.** No orange headlines; Amber 500 never carries text below 24px.
- No duration or easing outside the token table, and no raw hex in component code.
- Transform and opacity only — nothing animates a layout property.
- Reveals fire once and never replay on upward scroll.
- Every form field has a persistent visible label, validation runs on blur rather
  than on keystroke, errors are announced through a live region, and focus moves
  to the first invalid field.

## Deploying

The client is a static Vite build; the API is a separate Node service.

**Client on Vercel** — import the repo and set:

| Setting | Value |
| --- | --- |
| Root Directory | `client` |
| Framework Preset | **Vite** (not Create React App) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

`client/vercel.json` rewrites unknown paths to `index.html`, without which a
direct load of `/contact` returns 404 — React Router owns that route on the
client, so the server has to hand it the shell.

**API** — Vercel's static output cannot run Express, so deploy `server/` to a
Node host (Render, Railway, Fly, a container) and set `VITE_API_URL` in the
Vercel project to that origin. Left unset, the form posts to the same origin
and will 404 in production. Set `CLIENT_ORIGIN` on the API to the deployed
client origin so CORS is not left open.

## Known gaps

- MongoDB was not running in the environment this was built in, so the persisted
  path (`201` + stored document) is untested end to end; validation, the failure
  path and the 503 recovery path were verified against the running API.
- Photography is stock, and the testimonial quote, client names and metrics are
  placeholders. Replace both with real client assets and verified figures before
  this goes live — a real face attached to an invented quote and attribution is
  not something to ship.
- The mobile contact hero lands at 67vh rather than the roadmap's 60vh target.
  The requirement behind that number is met: the form card and its first input
  both sit above the fold at 375×812.
