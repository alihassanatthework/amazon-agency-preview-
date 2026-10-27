# Before you resubmit — checklist

**Case:** 22593418971 — Advertising Optimization
Companion to `AMAZON_COMPLIANCE_AUDIT.md`.

Amazon's email is explicit: *"Address every issue listed below BEFORE resubmitting your
application. If you do not address these issues, we may reject future role applications."*
So a second rejection is more costly than a slow resubmission. Work top-down.

Nobody can promise approval — Amazon decides. This list covers the two reasons they gave.

---

## BLOCKERS — do not resubmit until these are done

### 1. Set the three mail variables, or both forms still fail

The functions are written and tested, but they cannot deliver without a provider. **Until
this is done, your contact form and audit wizard return an error** — the same symptom that
contributed to the rejection, just with a politer message.

In **Vercel → Project → Settings → Environment Variables**, add for Production:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your API key from resend.com |
| `LEAD_NOTIFY_TO` | Where submissions should arrive |
| `LEAD_NOTIFY_FROM` | A sender on a domain you have verified with Resend |

Resend's free tier covers this volume. `LEAD_NOTIFY_FROM` **must** be on a verified domain
or the provider rejects the send.

Prefer a different provider, or your existing SMTP? Only `client/api/_lib/notify.ts` changes
— the handlers and forms are untouched.

### 2. Deploy, then test both forms yourself

Nothing in the audit is confirmed in production until you deploy. After deploying:

- [ ] Submit the contact form with real details → confirm the email arrives
- [ ] Complete the audit wizard end to end → confirm the email arrives
- [ ] Open `/privacy`, `/terms`, `/cookies` → real content, no placeholder
- [ ] Hard-refresh `/services/advertising-marketing` directly → loads, no 404
- [ ] Check the footer → no "Manage consent" button
- [ ] On `/results`, click every filter → none shows an empty state

### 3. Confirm Vercel is not password-protecting the site

Amazon said the site must not require a login. **Nothing in the code gates any page** — I
verified all 23 routes return 200 publicly. If a reviewer hit a login wall, this is the only
remaining explanation.

- [ ] **Vercel → Settings → Deployment Protection** → confirm it is **Disabled** for
      Production (Vercel Authentication or Password Protection here will show a login screen)
- [ ] Confirm the URL you gave Amazon is the **production** domain, not a `*-git-*` or
      `*-preview` deployment — preview URLs can be protected even when production is not
- [ ] Open the submitted URL in a private window, signed out of Vercel

### 4. Decide which figures are true — ✅ RESOLVED

You designated the **stat band as authoritative**. The hero's "80+ brands managed /
US-based team of 9" now reads **100+ brands / team of 10**, and the same figures were
applied to the About, Results and Contact stat rows, the client-marquee caption and both
meta descriptions. No page contradicts the band any more.

They now come from one module (`client/src/data/figures.ts`) that the band itself also
uses, so they cannot drift apart again.

- [x] Figures reconciled sitewide
- [ ] **One thing left to confirm:** ten employees at "4+ years each" implies 40+ combined
      years, but the band says "30+ Years of Combined Amazon Experience". `30+` is a floor
      so nothing published is false — tell me if the real number is higher and I'll update it

---

## Needed for the legal pages to stand up

The new policies accurately describe what your code does. They are **not legal advice**.

- [ ] **Legal entity name** — `"BLAZON LLC"` is hardcoded in one footer line. Is that the
      registered entity?
- [ ] **Registered business address** — none exists anywhere on the site. Amazon's portal
      asks for contact details; a privacy policy normally carries one
- [ ] **Data retention** — the policy currently says you keep enquiries until asked to
      delete, because **no automated deletion exists in the code**. That is accurate. If you
      want a fixed period, say which and it can be stated — and then actually implemented
- [ ] **Privacy contact** — currently the founder's personal address. A `privacy@` alias is
      conventional and ages better
- [ ] **Other processors** — the policy lists Vercel, Resend and Google Fonts. If you use a
      CRM, email marketing or analytics not visible in this repo, it must be added
- [ ] **Counsel review** — recommended before relying on these commercially

---

## Sign off the advertising copy

The new `/services/advertising-marketing` content is drawn **only** from what your own case
studies already evidence. Every claim is traced to its source in the audit.

- [ ] Read the page and confirm each statement is true of how you actually work
- [ ] Confirm the $3,000/month managed ad-spend ceiling and specialist handoff is current
- [ ] Confirm the 5–10%-of-gross budget guidance is current
- [ ] Correct anything that overstates or understates what you do

If you run campaign types the page does not mention — Sponsored Display, DSP, Amazon
Attribution, Marketing Cloud — tell me and I will add them. **I did not list them, because
nothing on your site evidenced them.**

---

## In the Amazon portal (not the website)

The email links these directly.

- [ ] **Business Information** — `solutionproviderportal.amazon.com/account/info`. Update
      contact details and data privacy practices. The email names this explicitly
- [ ] **Service profile** — paste a detailed advertising-optimization description. The new
      service page is the source; the portal profile is **separate** and is also assessed
- [ ] **Resubmit** — `solutionproviderportal.amazon.com`. **Do not reply to the email or
      reopen the case**; Amazon requires a new submission
- [ ] Review the four policy pages Amazon linked (incident management, PII retention,
      network protection, credential management). They were listed as resources, **not** as
      rejection reasons, but they apply if you integrate with SP-API

---

## Worth doing, not blocking

- [ ] **Team photos.** Five people currently show initials because
      `client/src/assets/team/` is empty. Drop in `blake-gale.jpg` etc. (256×256 minimum)
      and they appear automatically — the code is already correct and optimized. Jantzen
      Russell has no photo on record anywhere
- [ ] **Review the flagged case-study prose.** Your repo marks several published passages
      *"Composed — not sourced from the pitch deck"*, and one VetRx data point as
      *"the one invented data point in the system"*. Amazon did not raise it; it is still a
      claims-accuracy risk. See audit §A
- [x] ~~**`/getting-started` is unreachable on mobile**~~ — fixed; it is in the drawer now
- [ ] **Add a business address and a company profile link** (LinkedIn or similar). The site
      has no verifiable external presence, which reviewers commonly look for
- [ ] **Submit the sitemap** at `https://blazonpros.com/sitemap.xml` to Search Console
- [ ] **Canonical domain.** The site's canonical and schema URLs point at
      `blazonpros.com`, but it is served from `vercel.app`. If `blazonpros.com` is the real
      domain, point it at this project; if not, the canonical URLs are wrong

### Optional cleanup — zero effect on Amazon

~2.9 MB of orphaned assets. None of it ships to the browser. I tried to remove it and was
blocked, because the files are untracked and deletion would be unrecoverable. If you want
them gone, from the repo root:

```bash
rm -rf client/src/assets/logo/backup client/src/styles/base.css.bak
rm -f client/src/assets/logo/*.bak client/src/assets/logo/logo-full.svg.backup \
      client/src/assets/logo/logo-mockup-hires.png client/src/assets/logo/logo-horizontal.jpg \
      client/src/assets/logo/logo-hires-square.png client/src/assets/logo/logo-square-hires.png \
      client/src/assets/logo/logo-square-icon.png
```

Keep `logo-black-green.png` (the master the optimized version is exported from) and
`logo-mark-440.png` / `.webp` (in use).

---

## What changed in the site

| File | Why |
|---|---|
| `client/src/pages/Legal/index.tsx` | Three real documents replacing one placeholder |
| `client/api/contact.ts`, `client/api/leads.ts` | Working form endpoints |
| `client/api/_lib/*.ts` | Envelope, validation, email delivery |
| `client/tsconfig.api.json` | So the functions are typechecked by the build |
| `client/src/data/services.ts` | Advertising descriptions, method and cadence; typo fix |
| `client/src/pages/ServiceDetail/index.tsx` | Renders the method; cadence now per-discipline |
| `client/src/components/layout/Logo.tsx` | 401 KB → 14.9 KB; correct ratio; dead export removed |
| `client/src/components/layout/Footer.tsx` | Dead "Manage consent" control removed |
| `client/src/pages/Results/index.tsx` | Filters derived from data; lead copy |
| `client/src/pages/Team/index.tsx` | "5 of 10 named so far" removed |
| `client/src/pages/Contact/index.tsx` | Price answer reconciled; router `Link` |
| `client/src/pages/GetStarted/index.tsx` | Router `Link` so the form is not wiped |
| `client/src/pages/Pricing/index.tsx` | `Etc.` bullet replaced |
| `client/src/pages/Home/index.tsx`, `client/index.html` | Stale "4+ years" corrected |
| `client/src/components/common/Seo.tsx` | `og:image` / `twitter:image` |
| `client/src/components/common/TestimonialWall.tsx` | Narrower glob; `decoding` |
| `client/src/pages/Home/sections/ClientMarquee.tsx` | `width`, `loading`, `decoding` |
| `client/public/og-image.png`, `robots.txt`, `sitemap.xml` | Were missing |
| `client/public/site.webmanifest` | Empty name; contradictory theme colour |
| `client/src/styles/pages.css`, `layout.css` | Styles for the new sections |
| `client/src/assets/logo/logo-mark-440.{png,webp}` | The optimized mark |
| `client/src/components/layout/Header.tsx` | `/getting-started` added to the mobile drawer |
| `package.json`, `client/package.json` | `npm run typecheck` could never fail; now it can |
