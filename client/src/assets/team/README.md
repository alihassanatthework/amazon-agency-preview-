# Team headshots

Drop headshots in here named `<slug>.jpg` (or `.png` / `.webp`), where the slug
matches the entry in `client/src/data/team.ts`:

| File                   | Person           |
| ---------------------- | ---------------- |
| `blake-gale.webp`      | Blake Gale       |
| `gyle.webp`            | Gyle             |
| `james.webp`           | James            |
| `lordan.webp`          | Lordan           |
| `shirley.webp`         | Shirley          |
| `trevar-gale.webp`     | Trevar Gale      |

They are picked up automatically — no code change. A member with no file here
renders their initials instead, never a stock portrait.

## What to supply

Rendered at 128×128 in a circular mask, so **256×256 minimum** for a 2× display;
square source, subject centred. The four on the deck's "Point of Contact" slide
share a brick backdrop and consistent lighting — keep that.

**Ask the client for the originals.** The deck copies are already downscaled and
circularly cropped, so re-extracting them caps quality at whatever the slide
holds; that is fine for the 128px circle here but will not survive a move to the
larger 4:5 portrait card, which needs roughly 640×800.
