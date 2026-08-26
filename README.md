# Amazon Growth Agency — Homepage & Contact Page

Build of the *Homepage and Contact Page Roadmap* specification: two pages on a unified
white + amber-orange visual system, with a full token layer, motion primitives and a
first-class reduced-motion rendering path.

## Structure

```
index.html            Homepage (H0–H11)
contact.html          Contact page (C0–C6)
assets/css/tokens.css Phase 01 — colour, type, spacing, radius, shadow, motion tokens
assets/css/base.css   Phase 02 — primitives (button, link, input, card, pill, section header)
assets/css/home.css   Homepage section styles
assets/css/contact.css Contact page section styles
assets/js/motion.js   Phase 03 — rise, rise-stagger, mask-wipe, line-draw, word-rise,
                      count-up, parallax-soft
assets/js/shell.js    Phase 04 — header states, mobile drawer, footer accordions
assets/js/home.js     H4 pin, H7 horizontal scroll, H10 magnetic CTA, marquee
assets/js/contact.js  C2 form validation + confirmation state, C5 accordion
```

## Running

No build step. Serve the directory statically:

```bash
python3 -m http.server 4173
```

## Rules this build holds to

- Orange at three fixed weights: **600 fills actions, 800 writes text, 500 draws graphics.**
- No animation uses a duration or easing outside the token table.
- Nothing animates a layout property — transform and opacity only.
- Reveals fire once and never replay on upward scroll.
- Both pages render complete and well-composed with all motion disabled.
