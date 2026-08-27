# BLAZON — findings against the blueprint

Recorded rather than silently resolved, per §1.3: *"Flag, do not invent."*
Q-01 … Q-10 are the blueprint's own open questions in §22. Q-11 onward are
discrepancies found while checking the blueprint against the source archive.

---

## Q-11 — The service count is 36, not 38 · **BLOCKS PUBLISHED COPY**

The blueprint states **38 services** in three places, two of which are copy that
would ship:

- §7.2 — "Seven service groups containing 38 individual services"
- §9.7 (H5 lead) — "38 services across seven disciplines"
- §10.1 (/services hero) — **"38 services. One account team."**

`Our services.docx` contains **36**:

| Group | Items |
| --- | ---: |
| Amazon Account Management & Strategy | 5 |
| Product Listing & Optimization | 7 |
| Advertising & Marketing | 6 |
| Sales Optimization & Growth | 6 |
| Operations, Logistics & Compliance | 5 |
| Data Analytics & Reporting | 4 |
| International Expansion & Growth | 3 |
| **Total** | **36** |

**Handled:** the seed carries all 36 verbatim and asserts the count on every
run, so the number cannot drift. All published copy derives the figure from
`SELECT count(*) FROM service_items` rather than hardcoding it. Under §1.3
*"Never publish an unverified number"*, 38 must not appear until BLAZON either
supplies two more services or confirms the figure.

---

## Q-06 — **RESOLVED from source.** Model 2 pricing is not truncated

The blueprint records the "Operating an Amazon Store" flat fees as cut off
mid-cell. In the copy supplied in this archive every cell is legible, and
Model 2 mirrors Model 1's after-3-months structure exactly:

| Store size | SKUs | Model 1 first 3 months | Then, or Model 2 |
| --- | --- | --- | --- |
| Extra Small | 1–5 | $750/mo | $500/mo + 5% — or — $1,500/mo |
| Small | 10–25 | $1,000/mo | $500/mo + 5% — or — $1,500/mo |
| Medium | 26–100 | $1,500/mo | $750/mo + 5% — or — $1,875/mo |
| Large | 101–250 | $2,000/mo | $750/mo + 5% — or — $2,500/mo |
| Extra Large | 251–500 | $2,500/mo | $1,250/mo + 5% — or — $3,125/mo |
| Custom | 500+ | Call for a quote | Call for a quote |

Model 1's 5% is of **gross monthly sales**; Model 2's is of **gross sales above
your average monthly sales**. All twelve tiers are seeded. Still worth a final
read-through by BLAZON before publishing — published pricing errors are
contractually awkward.

Note the source's own gap: tiers jump from "1–5 SKUs" to "10–25". **6–9 SKUs
are unpriced.** The calculator must not silently mis-tier them.

---

## Q-12 — Marquee logo count: 8 usable, not 9

§9.4 says "the nine usable client logos". The blueprint's own table in §7.1
marks eight `YES` and excludes two (Power Steering Resources supplied an
infographic; All Fresh has no consent row). Eight are processed. Not padded.

---

## Q-13 — Alpine's trading name is ambiguous

The consent sheet's *Company Name* cell reads "Darren Jones" — the respondent's
own name. The supplied logo is **Alpine Innovations**; the contact email is
`@alpineproducts.com`. Seeded as **Alpine Products** from the verifiable domain.
Confirm the trading name before launch.

---

## Q-14 — RV Bug Stop supplied an ad creative, not a logo

The file is a 1200×630 advertisement. The mark sits over a photograph **beside
an "Amazon Best Seller" badge**. It has been colour-keyed out and cropped clear
of that badge — under Q-08 no Amazon endorsement may be implied. Quality is
acceptable but the original logo file should be requested.

---

## Verified — no action needed

Every figure in the stat band and the pricing/terms copy was checked against
`Slides/Sales Deck.pptx` and matches: 4+ years, 80+ brands, 9 employees all
with 4+ years' experience, 1 yr 7 mo lifecycle, results at months 4–6, live in
about a month, $750–$3,500/mo plus 5% above average monthly gross, 3-month
lock-in then month-to-month, ad management to $3,000/mo, ad budget 5–10% of
monthly gross. The brand colour ladders in `Logos/Brand Colors.docx` match
§04 exactly.

The deck writes the hero answer line as "All of them!"; the blueprint sets it
as "All of them." The blueprint's rendering is used, as a deliberate design call.
