# Client logos

Processed by `tools/process-client-logos.py` from the consent-form uploads in
`_Marketing/Email Campaigns/Testimonial Request/`.

Each client has two files:

- `<slug>.png` — full colour, used in testimonial cards where the logo links to
  that client's Amazon storefront. This is exactly what the consent question
  authorised.
- `<slug>-mono.png` — a single-colour `mist` knockout at 28px cap height (2x),
  for the dark marquee at 55% opacity.

## Excluded, and why

| File | Reason |
| --- | --- |
| `PSR Infographic 1.jpeg - POD.jpg` | An infographic, not a mark. The actual Power Steering Resources logo needs to be requested. **Q-09** |
| `FINAL-ALL-FRESH-LOGO - ADAM LICHT.png` | No matching testimonial row, so consent is unconfirmed. **Q-09** |

## Note on the count

The blueprint says "nine usable client logos" in §9.4, but its own table in §7.1
marks eight as `YES` and excludes those two. Eight are processed here. Raised
with the client rather than padded to nine.

## Per-file handling

| Slug | Source treatment |
| --- | --- |
| `raise-them-well` | Colour app-icon plus wordmark. Cropped to the wordmark — a flat knockout of the illustration would be an unreadable blob. |
| `rv-bug-stop` | Supplied as an ad creative, not a logo. The mark is isolated by colour keying and cropped clear of the Amazon Best Seller badge it sits beside (**Q-08** — no Amazon affiliation may be implied). |
| `ahm-investments` | White line art on a dark disc. The disc is the logo's own background plate and is knocked out; only the line art survives. |
| `pyro-putty`, `alpine-products`, `halftee` | White photographic background removed. |
| `blenditup`, `health-as-it-ought-to-be` | Already transparent; used as supplied. |
