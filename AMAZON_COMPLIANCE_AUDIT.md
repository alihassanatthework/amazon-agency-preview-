# Amazon Solution Provider — compliance audit

**Case:** 22593418971 — Advertising Optimization service, role access **REJECTED**
**Audited:** 27 October 2026
**Site audited:** `https://amazon-agency-preview.vercel.app` (live) and this repository

Amazon's rejection email gives **two** reasons. This document works through each
requirement in its own words, then lists additional problems found during the audit.
Those additional items are marked clearly — **Amazon did not cite them**, and they
should not be described to anyone as reasons for the rejection.

## Status key

| Mark | Meaning |
|---|---|
| **FIXED — verified locally** | Changed in this repo, confirmed in a local browser against the dev server |
| **FIXED — needs deploy to confirm** | Changed, but only provable on the live site after you deploy |
| **PASS — verified live** | Already compliant; confirmed against the live site before any changes |
| **NEEDS YOUR CONFIRMATION** | A business fact I must not invent |
| **NEEDS EXTERNAL ACCESS** | Outside this repo — Vercel dashboard or Amazon portal |

---

# Reason 1 — Accessibility and Functionality

> *"Your website's accessibility and functionality do not comply with our policies."*

## 1.1 "Be publicly accessible without requiring user login"

**Status: PASS — verified live.** No change was needed.

| Evidence | Result |
|---|---|
| All 23 public routes fetched on the live site | Every one returned **HTTP 200** with the app shell |
| Authentication code in `client/src` | **None exists** — no login page, no route guard, no token handling |
| Server-side auth | Only `app.use('/api/admin', requireAuth, …)` — `server/src/app.js:40`. Every marketing route is unauthenticated |

Nothing in this codebase can produce a login wall on a public page. **If a reviewer hit
one, the cause is outside this repo** — see *External access* below.

## 1.2 "Display complete and functional content with no 'under construction' pages or security warnings"

### 1.2a Three under-construction legal pages — **the clearest violation**

**Status: FIXED — verified locally.**

`/privacy`, `/terms` and `/cookies` all rendered the same placeholder, and all three are
linked in the footer of **every page**:

> *"This policy is being finalised with counsel and will be published here before launch."*

`/terms` and `/cookies` contained no terms or cookie content at all — just a heading over
privacy text. The source comment conceded it: *"privacy, terms and cookie policy do not
exist yet … must be supplied or drafted by counsel"* (`client/src/pages/Legal/index.tsx:8-13`).

Worse, **both forms required ticking "I agree … as described in the privacy policy"** —
consent to a document that did not exist.

**Fix** — `client/src/pages/Legal/index.tsx` rewritten to serve three distinct, real
documents. Every factual statement was derived by reading the code, not from a template:

| Statement | Derived from |
|---|---|
| Fields collected | The two form state objects — `Contact/index.tsx:24-26`, `GetStarted/index.tsx:46-53` |
| What is stored | `server/src/db/repositories/lead.repo.js` — `leads`, `lead_events`, `contact_messages`, `consent_logs` (three of which record `ip_address`; `leads` also records `user_agent`) |
| Retention | There is **no** scheduled deletion anywhere in `server/`, so "we keep it until you ask us to delete it" is the literal behaviour |
| Processors | Vercel (hosting), Resend (`client/api/_lib/notify.ts`), Google Fonts (`index.html` — discloses visitor IPs to Google) |
| Cookies | The site sets **none**; the audit form keeps a draft in `sessionStorage` under `blazon:get-started` |

`noindex` was also removed from these pages, since they now carry real content.

| Page | Before | After |
|---|---|---|
| `/privacy` | 157 words of placeholder | **644 words** |
| `/terms` | 158 words (privacy text under the wrong heading) | **248 words** of actual website terms |
| `/cookies` | 157 words (same placeholder) | **225 words** |

> **Important:** this is an accurate description of what the system does. That is not the
> same as legal advice, and it is not a substitute for review by counsel. See
> *Needs your confirmation*.

### 1.2b Both forms were dead in production — **the most serious functional defect**

**Status: FIXED — needs deploy to confirm.**

Verified live before fixing:

```
GET https://amazon-agency-preview.vercel.app/api/contact  →  404 NOT_FOUND
GET https://amazon-agency-preview.vercel.app/api/leads    →  404 NOT_FOUND
```

The bundled client posts to both (`client/src/services/api.ts:28-29`). The Express API in
`server/` is **not deployed** to Vercel, so every submission hit Vercel's 404 page, `res.json()`
threw, and the visitor saw *"Something went wrong. Please try again."*

This affected **the contact form and the "Get a free audit" wizard** — and every CTA on
every page funnels to the wizard. A reviewer testing the contact form would have failed.

**Fix** — two Vercel serverless functions in the same project, so the URLs resolve on the
same origin with no new host:

| File | Purpose |
|---|---|
| `client/api/contact.ts` | `POST /api/contact` |
| `client/api/leads.ts` | `POST /api/leads` |
| `client/api/_lib/http.ts` | Response envelope identical to the Express API |
| `client/api/_lib/validate.ts` | Field rules mirroring `server/src/validators/public.schemas.js` |
| `client/api/_lib/notify.ts` | Delivery by email, no dependencies |

`client/src/services/api.ts` is **unchanged** — the envelope matches exactly.
`client/vercel.json` needed no change; it already excludes `/api/` from the SPA rewrite.

Tested directly (the functions cannot run under `vite dev`):

| Case | Result |
|---|---|
| `GET` instead of `POST` | 405 with `Allow: POST` |
| Empty body | 422, per-field messages matching the form copy |
| Invalid email / short message / consent unticked | 422 on the right field |
| Honeypot filled | **201 success** — indistinguishable from a real submission, so a bot cannot detect it |
| Submitted in under 2 seconds | **201 success** — same |
| Valid, provider configured | 201, correct Resend call: endpoint, auth, recipients, subject, `reply_to`, readable body |
| Valid, provider **not** configured | 503 telling the visitor to phone, rather than accepting and silently dropping the lead |

> **These forms will not deliver until you set three environment variables.** See the
> checklist. Until then they fail honestly with the phone number rather than pretending.

**Carried over deliberately:** the honeypot and sub-2-second checks match
`server/src/services/lead.service.js`. **Not carried over:** the 10-minute duplicate-email
check, which needs the Postgres this deployment does not have. The Postgres lead pipeline
and admin dashboard are not part of the Vercel deployment.

### 1.2c "Manage consent" was a dead control on every page

**Status: FIXED — verified locally.**

`Footer.tsx:86` dispatched `blazon:consent-open`. **Nothing in the repo listened for it** —
clicking did nothing, on every page. Since the site genuinely sets no analytics,
advertising or tracking cookies, the honest fix was removal, and the new cookie policy says
so plainly. Dead CSS removed with it.

### 1.2d One click from `/results` to an explicitly empty page

**Status: FIXED — verified locally.**

The filter list was hand-written with six categories while only four case studies exist.
Clicking **"New to Amazon"** produced *"No case studies in this category yet."*

**Fix** — `client/src/pages/Results/index.tsx` now derives the filters from the published
studies, so a filter can never exist without content behind it. Verified: 5 filters, each
returning at least one card, empty state unreachable.

### 1.2e Copy that advertised its own incompleteness

**Status: FIXED — verified locally.**

| Where | Was | Now |
|---|---|---|
| `/team` | *"5 of 10 named so far. The rest go up as their roles and photographs are confirmed…"* | Removed |
| `/results` hero | *"…with more being written from account data we already hold."* | *"…four accounts are written up in full — the numbers, what we changed, and what it produced."* |
| `/pricing` | A package feature bullet reading literally **`Etc.`** | *"Ad account audits and one-off campaign rebuilds"* |

### 1.2f Contradictions a reviewer checking your claims would notice

**Status: PARTLY FIXED / NEEDS YOUR CONFIRMATION.**

**Fixed — the Contact page contradicted the Pricing page it linked to:**
Contact's FAQ said *"Between $750 and $3,500 a month depending on catalogue size"* while
`/pricing` says $2,250–$6,500 (ADVANCED) and $750–$5,000 (BASIC), split by advertising, not
catalogue size. Contact now states the real packages.

**Fixed — the service FAQ contradicted the pricing page:** *"there is no à la carte menu"*
appeared on all six service pages while `/pricing` sells One-Time Projects à la carte. Now
reconciled.

**Fixed — stale homepage meta description:** said *"4+ years"* (the per-specialist figure)
where the site says the company is 8+ years old. You directed the 8+ change earlier, so this
one was safe to apply.

**NOT fixed — headcount and brand counts.** These are on the **same homepage, in adjacent
sections**, and I will not guess which is true:

| Claim | Says | Also says |
|---|---|---|
| Team size | "US-based team of 9" (hero) | **"10+ Employees"** (stat band) |
| Brands | "80+ brands managed" (hero) | **"100+ Brands Currently Servicing"** (stat band) |
| Team page | — | "team of 10", `numberOfEmployees: 10` in structured data |

### 1.2g Security warnings

**Status: PASS — verified live.** No change needed.

| Check | Result |
|---|---|
| Console errors on load | **Zero** |
| Network requests | All **200/304** |
| Mixed content | **None** — every request HTTPS |
| Third-party resources | Google Fonts only; no analytics, tag manager, iframes or chat widget |
| Committed secrets | **None** — `server/.env` is correctly gitignored |
| `http://` in source | Only `w3.org` XML namespace identifiers, which are never fetched |

## 1.3 "Have all links direct to relevant, working pages"

**Status: PASS (structure) / FIXED (destinations).**

Every one of the 14 distinct internal link targets resolves to a defined route; unknown
slugs fall back to a branded 404. **No link was broken.** But three of them — the footer's
Privacy / Terms / Cookie links — led to placeholder pages, which is the likelier reading of
this finding. That is fixed in 1.2a.

Also fixed: `Contact/index.tsx:192` and `GetStarted/index.tsx:363` linked the privacy policy
with a raw `<a href>` instead of a router `Link`, forcing a full page reload **mid-form** and
discarding what the user had typed.

**Not fixed — `/getting-started` is unreachable on mobile.** It appears only in the desktop
Services dropdown, not in the mobile drawer or the footer. Not a broken link; a page with no
route to it on phones.

## 1.4 "Include high-resolution images optimized for quick loading times"

**Status: FIXED — verified locally.**

### The headline problem

`client/src/components/layout/Logo.tsx` imported a **401 KB, 4500×4615 PNG** to paint a logo
**132 px wide**, in the header *and* footer — so on every page, in the eager critical path.
It was the heaviest asset on the site by an order of magnitude.

| | Before | After |
|---|---|---|
| File | `logo-black-green.png` | `logo-mark-440.webp` (PNG fallback) |
| Transfer | **401.1 KB** | **14.9 KB** (WebP) / 37.0 KB (PNG) |
| Dimensions | 4500×4615 | 429×440 — still 3× the largest render size (140 px) |
| Reduction | — | **96%**, on every pageview |

The 4500 px master stays in `assets/logo` as the source to re-export from.

### Also fixed

- **Layout shift from the logo.** `height` was computed as `width × 205/1170` — the ratio of
  a *different, older* logo file — giving `height=23` for an image that renders 135 px tall.
  (It was **not** visually squashed: `.logo img { height: auto }` in `layout.css:25` overrode
  it. The symptom was a ~112 px layout shift, not distortion.) Now computed from the real
  ratio: `height=135`.
- **A no-op light/dark switch.** `surface === 'dark' ? full : dark` chose between two
  **byte-identical** files, and no caller ever passed anything but the default. Removed.
- **A 43 KB image bundled for a component that never rendered.** `FlameMark` was exported
  but never imported anywhere. Removed.
- **16 marquee images with no `width`, no `loading`, no `decoding`** (`ClientMarquee.tsx:64`) —
  a direct layout-shift source on the homepage. All three added, with per-logo intrinsic
  widths so the strip reserves correct space before decode.
- **`decoding="async"`** added to the testimonial logos.
- **An over-broad eager glob.** `TestimonialWall` imported all 18 client PNGs including the 8
  `-mono` variants it never reads. Now filtered, and readably so.
- **No share image.** `twitter:card` was `summary_large_image` with **no image set**, so every
  shared link previewed blank. Added `client/public/og-image.png` (1200×630, composed from
  the existing mark — no new artwork invented) and wired `og:image`, dimensions, alt and
  `twitter:image` into `Seo.tsx`.
- **Manifest was a stub.** Empty `name`/`short_name`, and `theme_color: #ffffff` contradicting
  the dark `#0B0D0A` in `index.html`. Filled in and aligned.
- **No `robots.txt` or `sitemap.xml`** — both resolved to the SPA shell. Added;
  the sitemap is generated from the real route data (22 URLs).

---

# Reason 2 — Service description

> *"Provide a clear, detailed explanation of what your organization's service entails …
> including core offerings, benefits, and expertise."*

**Status: FIXED — verified locally / NEEDS YOUR SIGN-OFF.**

### What was there

`/services/advertising-marketing` carried roughly **55 words** of unique advertising copy:
one summary sentence plus six bare labels with **no descriptions** — and not one of the 44
service items site-wide had a description.

Searching the whole site for the vocabulary Amazon named returned **nothing** outside
past-tense case studies: *keyword, targeting, bid, budget, ACOS, TACOS, search term,
negative keyword, Sponsored Products / Brands / Display*.

Three of the page's five sections were byte-identical across all six disciplines, and the
section headed **"Cadence and reporting" described account-health work** — IPI checks and
review removal — not advertising.

### What it says now

| | Before | After |
|---|---|---|
| Unique advertising copy | ~55 words | **1,064 words** on the page |
| Capability descriptions | 0 of 6 | **6 of 6** |
| Amazon's named sub-areas | 0 of 5 | **5 of 5** |

Against Amazon's own list:

| Amazon asked for | Where it now appears |
|---|---|
| Campaign analysis | *"Audit before spend"* + the "Optimize ad campaigns" description |
| Keyword / targeting | *"Rebuild the structure"* — keyword and product targeting, search-term exclusions |
| Budget / bid optimization | *"Manage to a target, weekly"* — bids and budgets against an agreed target |
| Performance monitoring | Advertising-specific Weekly / Monthly / Ongoing cadence |
| Reporting | *"Report in numbers you can check"* — spend, ACOS and TACOS against target |

Also added: a *"Know the ceiling, and say so"* step stating the $3,000/month managed limit
and the specialist handoff above it, and the 5–10%-of-gross budget guidance.

### Every claim traces to something already published

**No service, credential or result was invented.** Each statement traces to an existing case
study or published page:

| Claim | Source |
|---|---|
| Campaign and keyword restructuring | GRINDS — *"restructuring campaigns and keyword targeting"* |
| Spend moved off branded defence | Aloha Bay — *"spending against its own branded search"* |
| Contribution margin over raw ACOS | Aloha Bay — *"restructured advertising around contribution margin rather than raw ACOS"* |
| TACOS 20% → 9% on an unchanged $40,000 budget | GRINDS, stated outcome |
| Weekly PPC cadence, monthly TACOS review | GRINDS — *"weekly cadence of PPC and listing optimization, with monthly reviews of TACOS, referral fees, and FBA costs"* |
| Per-launch keyword plans | GRINDS — *"each with its own keyword and positioning plan"* |
| Efficient TACOS over broad spend | VetRx — *"campaigns structured to reach an efficient TACOS quickly"* |
| $3,000/month ceiling, specialist handoff | `Comparison.tsx:30`, `Pricing/index.tsx:163` |
| 5–10% of gross ad budget | `Pricing/index.tsx:163` |

No guaranteed outcomes are stated; the existing "months four to six" framing is kept.

**Supporting changes:** `ServiceGroup` gained optional `approach` and `cadence` fields so a
discipline can describe its own method and reporting rather than inheriting the generic
account-health cadence. Only Advertising & Marketing uses them today; the other five fall
back to the shared copy. The published typo **`BLAZONs`** → `BLAZON's` was fixed.

---

# Additional issues found — NOT cited by Amazon

Listed for completeness. **Amazon's email does not mention any of these.**

### A. Published case-study prose flagged in-repo as unverified

`client/src/data/caseStudies.ts` marks several **published** passages:

> *"Composed — not sourced from the pitch deck. Flag for client/brand review before this
> goes live."* — lines 163-165, 167, 214-216, 218

and, of the VetRx chart baseline:

> *"the one invented data point in the system"* — lines 239-249

This is live prose on your case-study pages. It is a claims-accuracy risk and worth your
review before resubmitting, but it is **not** a stated rejection reason and I have not
touched it.

### B. Business information gaps

- **No postal address** anywhere on the site. The only location signal is *"Utah Based"*.
- **No legal entity in data** — `"BLAZON LLC"` is hardcoded once in `Footer.tsx:92`;
  `site.ts` has no `legalName`, and the Schema.org blocks use `"BLAZON"`.
- **No social or external company presence** — no LinkedIn, no profiles of any kind.
- **The only published email is the founder's personal address**, which is also the contact
  for data-protection requests.

### C. Repo hygiene — no effect on the live site

~2.9 MB of orphaned assets, including one 401 KB image stored **six times** and a 1.5 MB
8487×7342 mockup, plus `client/src/assets/icons/` (72 SVGs, entirely unreferenced).

**None of this ships to the browser** — Vite only bundles what is imported — so it has zero
bearing on Amazon's requirements. I attempted removal; it was blocked because the files are
untracked and deletion would be unrecoverable. Your call. The command is in the checklist.

### D. Minor

- `npm run typecheck` at the repo root prints the `tsc` help text rather than typechecking.
  `npm run build` does run `tsc -b` correctly, so types *are* checked on build.
- `client/dist/` is a stale committed build artifact.
- `additionalCost` badges render from a field no data ever sets — dead branches.
- `icon` fields in `site.ts` and `services.ts` name files in the unreferenced icons directory.

---

# Verification performed

| Check | Result |
|---|---|
| `npm run build` (`tsc -b && vite build`) | **Passes** |
| `npm run lint` | Passes — warnings all pre-existing, none in new files |
| TypeScript across `src` **and** `api` | **Passes** — added `tsconfig.api.json` so the functions are typechecked too |
| All 23 routes, local browser | Render; **0** broken images; **0** under-construction flags |
| Results filters | 5 filters, every one returns results, empty state unreachable |
| Serverless handlers | Tested directly — method guard, validation, spam controls, delivery, unconfigured path |
| Logo payload | 401.1 KB → **14.9 KB**; `height` attribute now matches render |

**Not yet verified live.** Everything above was confirmed against the local dev server.
The live site has **not** been redeployed, so no fix in this document is confirmed in
production yet. The *pre-fix* findings in sections 1.1, 1.2b and 1.2g **were** verified
against the live site.
