# Architecture

## Why the code is split into `client/` and `server/`

This is a MERN application, which means two programs, not one:

- **`client/`** compiles to static files — HTML, CSS, JS — that a browser downloads
  and runs. Its dependencies (React, React Router, Vite) end up in a bundle or are
  build-time only.
- **`server/`** is a long-running Node process that listens on a port, talks to
  MongoDB and answers HTTP requests. Its dependencies (Express, Mongoose, Zod)
  must never reach the browser: shipping Mongoose to a browser would be dead
  weight at best, and a database connection string in a public bundle at worst.

They are also **deployed to different places**. The client is static output on a
CDN (Vercel). The server needs a persistent Node runtime (Render, Railway, Fly, a
container). Putting them in one package would force one build, one dependency
tree and one deploy target on two things that need none of those in common.

### The three `node_modules`

```
node_modules/          ~24  concurrently — runs both dev servers with one command
client/node_modules/   ~28  React, React Router, Vite, TypeScript
server/node_modules/   ~94  Express, Mongoose, Zod, CORS, rate limiting, tsx
```

Each `package.json` owns its own tree. That is what keeps `npm run build` in
`client/` from ever seeing Express, and what lets the API be deployed without
pulling in a front-end toolchain. The root one exists only so `npm run dev`
can start both at once; it ships nowhere.

This is a **two-package layout, not a monorepo toolchain** — there is no
Turborepo, Nx or npm workspace wiring, because two packages do not need it.
The root scripts delegate with `npm --prefix`.

## Map

```
.
├── package.json              root scripts only (dev, build, typecheck)
├── ARCHITECTURE.md
├── README.md
│
├── client/                   ── deployed as static files ──
│   ├── vercel.json           SPA rewrite: unknown paths → index.html
│   ├── vite.config.ts        dev proxy /api → localhost:4000
│   ├── public/media/         photography served as-is
│   └── src/
│       ├── main.tsx          entry: router + the stylesheet import order
│       ├── App.tsx           layout shell, routes, scroll management
│       │
│       ├── styles/           the design system, in cascade order
│       │   ├── tokens.css    colour, type, spacing, radius, shadow, motion
│       │   ├── base.css      primitives: button, link, input, card, pill
│       │   ├── motion.css    the CSS half of the motion primitives
│       │   ├── shell.css     header, drawer, footer
│       │   ├── home.css      H1–H10
│       │   └── contact.css   C1–C5
│       │
│       ├── motion/           the JS half of the motion primitives
│       ├── components/
│       │   ├── shell/        Header, Footer, BackgroundLayer
│       │   └── ui/           SectionHeader, icons
│       ├── sections/
│       │   ├── home/         one file per section, H1 … H10
│       │   └── contact/      C1 … C5 + the form schema
│       ├── pages/            HomePage, ContactPage — composition only
│       └── data/site.ts      content strings in one place
│
└── server/                   ── deployed as a Node process ──
    └── src/
        ├── index.ts          app, CORS, rate limit, health, Mongo connection
        ├── models/Lead.ts    the audit request schema
        └── routes/leads.ts   POST /api/leads
```

## How a form submission travels

```
ContactForm.tsx
  │  validateAll() — blur-time rules, runs in the browser
  ▼
POST {VITE_API_URL}/api/leads          dev: Vite proxies /api → :4000
  ▼
server/src/index.ts                    CORS → rate limit (20 / 15 min)
  ▼
routes/leads.ts                        the same rules again, via Zod
  │                                    — the client's can be bypassed
  ├─ invalid  → 400 { fieldErrors }    keyed by field name, so the form can
  │                                      mark inputs and focus the first
  ├─ no DB    → 503 + payload logged   never a false success
  └─ ok       → 201 { id }             Mongoose writes the Lead
```

The client validates for **speed of feedback**; the server validates for
**correctness**. Neither trusts the other.

## Layer rules

**Styles cascade in one direction.** `main.tsx` imports the stylesheets in a
fixed order — tokens, base, motion, shell, home, contact — and later files may
override earlier ones. That is load-bearing: `home.css` overriding `.tilt-layer`
from `motion.css` is deliberate, not accidental.

**Tokens are the only place raw values live.** No component file contains a hex
colour, a duration or an easing curve. If a value is needed that the tokens do
not have, the token layer gains it first.

**Sections own their layout, primitives own their appearance.** A section file
decides where things sit; it never restyles a button.

**Motion primitives are paired.** Every primitive has a CSS half (`motion.css`)
and a React half (`motion/`), sharing a class contract: `[data-reveal]`,
`.is-revealed`, `html.motion-on`. The hidden initial states are scoped to
`motion-on`, which is only ever added when JS runs *and* reduced motion is off —
so a browser with either missing renders the finished page rather than a blank one.

## Decisions worth knowing

**One interpolated background layer.** Section backgrounds are painted by a
single fixed gradient (`BackgroundLayer.tsx`) whose stops are the on-screen
section boundaries. Animating each section's own background produces a seam at
every boundary; interpolating one layer beneath the content does not. Sections
only go transparent once the layer has painted, so a viewport it cannot measure
falls back to per-section backgrounds.

**Two sections recompose rather than shrink.** The pinned solutions section and
the horizontal case-study track drop their pins below 768px and become stacked
cards and a native snap carousel. Scroll-driven pinning on touch fights the
platform's own scrolling.

**The API stays up without MongoDB.** It starts, serves and returns 503 with the
payload logged. The front end can be developed against it and the failure path
is exercisable without a database running.
