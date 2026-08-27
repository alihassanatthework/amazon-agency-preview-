"""
Phase 1 asset prep — client logo processing.

The supplied logos are raster files at mixed resolutions, mixed aspect ratios
and mixed backgrounds, several designed for light backgrounds. The blueprint
requires each one background-removed, knocked out to a single-colour `mist`
mark and normalised for the dark marquee. That is what this does.

Run:  /tmp/blazon-venv/bin/python tools/process-client-logos.py
"""
from PIL import Image
from collections import Counter
import os

SRC = ('/tmp/blazon/_Marketing/Email Campaigns/Testimonial Request/'
       'BLAZON Testimonial (File responses)/Company Logo (File responses)')
OUT = 'client/src/assets/clients'
MIST = (199, 201, 193)          # mist #C7C9C1
CAP_HEIGHT = 56                 # 28px cap height at 2x for retina
MAX_WIDTH = 210                 # keeps a long wordmark from dominating the row


def alpha_from_white(im):
    """Knock out a white photographic background."""
    px = im.convert('RGB').load()
    w, h = im.size
    a = Image.new('L', (w, h)); ap = a.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            d = 255 - min(r, g, b)
            ap[x, y] = 255 if d > 26 else int(d * 9.8)
    return a


def alpha_from_yellow(im):
    """Isolate a saturated yellow mark sitting on a photograph."""
    px = im.convert('RGB').load()
    w, h = im.size
    a = Image.new('L', (w, h)); ap = a.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            ap[x, y] = 255 if (min(r, g) - b) > 70 and (r + g) / 2 > 120 else 0
    return a


def despeckle(a, min_px=12):
    """Drop isolated specks left behind by colour keying."""
    w, h = a.size; ap = a.load()
    seen = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if seen[y][x] or ap[x, y] < 128:
                continue
            stack, blob = [(x, y)], []
            seen[y][x] = True
            while stack:
                cx, cy = stack.pop(); blob.append((cx, cy))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and ap[nx, ny] >= 128:
                        seen[ny][nx] = True; stack.append((nx, ny))
            if len(blob) < min_px:
                for bx, by in blob:
                    ap[bx, by] = 0
    return a


def ink_alpha(im):
    """
    Alpha of the ink alone.

    A file whose opaque area nearly fills its bounding box carries its own
    background plate — a dark disc, a coloured tile — so the ink is whatever
    deviates from that plate's modal luminance. A file whose opaque area is
    sparse is already just the glyphs, so every opaque pixel is ink.
    """
    a = im.getchannel('A')
    if a.getextrema()[0] >= 250:
        return alpha_from_white(im)

    bb = a.getbbox()
    if not bb:
        return a
    crop = im.crop(bb); ac = crop.getchannel('A')
    opaque = sum(1 for v in ac.getdata() if v > 128)
    if opaque / max(1, crop.width * crop.height) < 0.70:
        return a                                   # sparse: opaque == ink

    lum = crop.convert('L')
    vals = [l for l, av in zip(lum.getdata(), ac.getdata()) if av > 128]
    mode = Counter(v // 8 * 8 for v in vals).most_common(1)[0][0] + 4
    lp, apx = lum.load(), ac.load()
    oc = Image.new('L', crop.size); op = oc.load()
    for y in range(crop.height):
        for x in range(crop.width):
            if apx[x, y] <= 128:
                continue
            d = abs(lp[x, y] - mode)
            op[x, y] = 255 if d > 60 else int(max(0, d - 14) * 5.5)
    out = Image.new('L', im.size, 0); out.paste(oc, bb)
    return out


# Only marks whose owner answered "Yes" to the consent question. Power Steering
# Resources supplied an infographic rather than a mark, and All Fresh has no
# matching consent row — both are excluded and recorded in Q-09.
JOBS = [
    ('RTW_Logo - Emily Saunders.png',                            'raise-them-well',          'wordmark'),
    ('high_res_logo - Rod Stuart.png',                           'blenditup',                None),
    ('logo-300 - Lori Hayes.png',                                'health-as-it-ought-to-be', None),
    ('MAIN PYRO LOGO - Cheston Davis.jpg',                       'pyro-putty',               None),
    ('Alpine Innovations A logo light bkgrnd - Darren Jones.jpg', 'alpine-products',         None),
    ('Minimalist simple Initial logo - Andrew Millecam.png',     'ahm-investments',          None),
    ('HT_Amazon Logo-02 - tammara thompson.jpg',                 'halftee',                  None),
    ('rvbugstopad (1) - Duran Anderson.png',                     'rv-bug-stop',              'yellow'),
]

os.makedirs(OUT, exist_ok=True)
for filename, slug, mode in JOBS:
    im = Image.open(os.path.join(SRC, filename)).convert('RGBA')

    if mode == 'wordmark':
        w, h = im.size
        im = im.crop((0, int(h * 0.86), w, h))     # the wordmark strip only
        a = ink_alpha(im)
    elif mode == 'yellow':
        im = im.crop((392, 50, 752, 138))          # the mark, clear of the Amazon badge
        a = despeckle(alpha_from_yellow(im))
    else:
        a = ink_alpha(im)

    colour = Image.merge('RGBA', (*im.split()[:3], a))
    bb = colour.getchannel('A').getbbox()
    if bb:
        colour = colour.crop(bb)

    full = colour.copy()
    full.thumbnail((640, 640), Image.LANCZOS)
    full.save(f'{OUT}/{slug}.png')

    mono = Image.new('RGBA', colour.size, MIST + (0,))
    mono.putalpha(colour.getchannel('A'))
    w = max(1, round(mono.width * CAP_HEIGHT / mono.height))
    mono = mono.resize((w, CAP_HEIGHT), Image.LANCZOS)
    if mono.width > MAX_WIDTH:
        mono = mono.resize((MAX_WIDTH, max(1, round(mono.height * MAX_WIDTH / mono.width))),
                           Image.LANCZOS)
    mono.save(f'{OUT}/{slug}-mono.png')
    print(f'{slug:26s} colour {full.size}  mono {mono.size}')
