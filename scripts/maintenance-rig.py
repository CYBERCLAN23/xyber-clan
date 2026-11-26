#!/usr/bin/env python3
"""
Maintenance rig: cuts the Frame 64 renders into animatable layers.

    python3 scripts/maintenance-rig.py <Frame 64.svg> [out_dir] [rig_json]

Reads the three renders embedded in the design SVG and writes, to
public/brand/maintenance/ (AVIF + WebP, several widths for the big layers):

  Moshi (builder render)
    moshi-body   Moshi without the hammer arm and without his eyes
                 (the skin under the eyes and behind the arm root is rebuilt)
    moshi-arm    hammer + fist + forearm, rotates at the shoulder
    moshi-eye-l / moshi-eye-r   the eyes, squashed for blinks
  Crane render
    crane        crane + browser window with an empty page
    crane-sign   the </> sign on its hook (swings)
    win-*        every block of the page (bars, hero, sun, cards, button,
                 small bar) on its own, so the page can rearrange itself
  Tape
    tape         the caution tape, red matting fringe removed

and rig.json (default src/pages/maintenance/rig.json): every layer's box and
pivot in its render's pixel space, plus how each render maps onto the frame.

Only needs numpy + Pillow (with AVIF support).
"""
import base64
import json
import re
import sys
from collections import OrderedDict
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

VERSION = 'v2'

# Where each render sits in the 2428 x 1261 frame: frame = origin + px * scale.
PLACEMENT = {
    'moshi': {'x': 1013.94, 'y': 194.46, 'sx': 0.46880, 'sy': 0.46933},
    'crane': {'x': 1579.89, 'y': 74.0, 'sx': 0.61908, 'sy': 0.61907},
}

# ── Moshi (render pixels, 1199 x 1312) ──────────────────────────────
ARM_POLYGON = [(444, 80), (444, 330), (372, 345), (366, 500), (352, 560), (360, 620),
               (368, 680), (368, 700), (200, 745), (105, 745), (100, 330), (140, 80)]
ARM_PIVOT = (300, 700)          # shoulder, under the vest armhole
ARM_ROOT_KEEP = 520             # below this row the body keeps its own copy of the arm's skin
ARM_ROOT_X = 300                # the vest trim starts right of this column
EYE_BOXES = {'l': (625, 355, 712, 488), 'r': (783, 413, 862, 550)}
SKIN_SHIFT = {'l': 72, 'r': -70}  # where clean skin of the same height is, for rebuilding under the eyes

# ── Crane render (render pixels, 1225 x 1284) ───────────────────────
SIGN_BOX = (462, 238, 780, 545)
SIGN_PIVOT = (620, 238)
PANEL = (110, 648, 757, 1205)   # inside of the browser page
WIN_ITEMS = OrderedDict([
    ('bar1', (170, 699, 655, 740)),
    ('bar2', (170, 753, 510, 793)),
    ('hero', (160, 810, 728, 985)),
    ('card1', (163, 1009, 329, 1093)),
    ('card2', (360, 1009, 533, 1092)),
    ('card3', (560, 1007, 725, 1090)),
    ('button', (190, 1112, 347, 1167)),
    ('small', (381, 1125, 480, 1147)),
])
SUN_BOX = (638, 825, 713, 900)
ITEM_PAD = 12                   # each block keeps this much of its own soft shadow
HOLE_PAD = 22                   # ...and the empty page is cleared this far around it

WIDTHS = {'moshi-body': [360, 560, 800, 1036], 'crane': [420, 700, 1127], 'tape': [900, 1400, 1774]}


def images_from_svg(path: Path):
    s = path.read_text()
    out = {}
    for m in re.finditer(r'<image id="(image\d)_[^"]*"[^>]*base64,([A-Za-z0-9+/=]+)"', s):
        out[m.group(1)] = Image.open(BytesIO(base64.b64decode(m.group(2)))).convert('RGBA')
    return out


def poly_mask(size, pts):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return np.array(m) > 0


def dilate(mask, px):
    im = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(px * 2 + 1))
    return np.array(im) > 0


def feather(mask, px):
    im = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(px))
    return np.array(im).astype(float) / 255


def diffuse(rgb, hole, iters=400):
    """Fill `hole` from its surroundings (Jacobi diffusion on the hole's bounding box)."""
    ys, xs = np.nonzero(hole)
    if not len(ys):
        return rgb
    y0, y1, x0, x1 = max(ys.min() - 2, 0), ys.max() + 3, max(xs.min() - 2, 0), xs.max() + 3
    sub = rgb[y0:y1, x0:x1].astype(float)
    h = hole[y0:y1, x0:x1]
    known = ~h
    sub[h] = sub[known].mean(axis=0)
    for _ in range(iters):
        avg = (np.roll(sub, 1, 0) + np.roll(sub, -1, 0) + np.roll(sub, 1, 1) + np.roll(sub, -1, 1)) / 4
        sub[h] = avg[h]
    out = rgb.copy()
    out[y0:y1, x0:x1] = sub
    return out


class Writer:
    def __init__(self, out: Path):
        self.out = out
        self.rig = {'version': VERSION, 'placement': PLACEMENT, 'layers': {}}

    def save(self, rgba: np.ndarray, name: str, group: str, box=None, pivot=None, widths=None):
        a = rgba[..., 3]
        if box is None:
            ys, xs = np.nonzero(a > 0)
            box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
        x0, y0, x1, y1 = (int(v) for v in box)
        img = Image.fromarray(rgba[y0:y1, x0:x1].clip(0, 255).astype(np.uint8))
        # Big layers come in a few widths; small ones in full and half size.
        widths = widths or ([img.width // 2, img.width] if img.width >= 120 else [img.width])
        files = []
        for w in widths:
            im = img if w >= img.width else img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
            base = f'{name}-{VERSION}-{im.width}'
            im.save(self.out / f'{base}.avif', 'AVIF', quality=58, speed=4)
            im.save(self.out / f'{base}.webp', 'WEBP', quality=80, method=6)
            files.append(im.width)
        entry = {'group': group, 'box': [x0, y0, x1 - x0, y1 - y0], 'widths': files}
        if pivot:
            entry['pivot'] = [float(v) for v in pivot]
        self.rig['layers'][name] = entry
        print(f'{name:14s} box {entry["box"]} widths {files}')


def rig_moshi(src: Image.Image, w: Writer):
    a = np.array(src).astype(float)
    H, W = a.shape[:2]
    rgb, al = a[..., :3], a[..., 3]
    lum = rgb @ [0.299, 0.587, 0.114]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    yy, xx = np.mgrid[0:H, 0:W]
    al = np.where(al < 10, 0, al)

    # Arm: the polygon minus the vest (orange panel and its dark trim) near the shoulder.
    arm = poly_mask((W, H), ARM_POLYGON) & (al > 0)
    trim = (lum < 60) & (((yy > 470) & (xx > 330)) | (yy > 690))      # the vest's black edging
    orange = (r > 200) & (g < 170) & (b < 90) & (((yy > 470) & (xx > ARM_ROOT_X)) | (yy > 650))  # below the hammer's cap
    vest = trim | orange
    arm &= ~dilate(vest, 2)
    # The body keeps its own copy of the arm's skin near the shoulder (never the
    # hammer), so a swing shows more arm instead of a hole.
    skin = b > r + 25
    keep_root = arm & skin & (yy >= ARM_ROOT_KEEP)
    keep_fade = np.clip((yy - ARM_ROOT_KEEP) / 50, 0, 1)  # its top edge fades in

    arm_a = np.where(arm, al, 0)
    cut_fade = np.clip((745 - yy) / 26, 0, 1)  # soften the straight cut across the arm root
    arm_a = arm_a * np.where(yy > 700, cut_fade, 1)
    w.save(np.dstack([rgb, arm_a]), 'moshi-arm', 'moshi', pivot=ARM_PIVOT)

    body_rgb = rgb.copy()
    body_a = np.where(arm & ~keep_root, 0, np.where(keep_root, al * keep_fade, al))

    # Eyes: lift them off, rebuild the skin underneath from clean skin beside them.
    for k, (x0, y0, x1, y1) in EYE_BOXES.items():
        region = np.zeros((H, W), bool)
        region[y0:y1, x0:x1] = True
        eye = region & (lum < 115) & (al > 0)
        eye_m = dilate(eye, 5) & region
        eye_a = feather(dilate(eye, 3), 1.2) * 255
        eye_a = np.where(region, np.minimum(eye_a, al), 0)
        ys, xs = np.nonzero(eye_m)
        cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
        w.save(np.dstack([rgb, eye_a]), f'moshi-eye-{k}', 'moshi', pivot=(round(cx, 1), round(cy, 1)))

        shift = SKIN_SHIFT[k]
        src_patch = np.roll(rgb, -shift, axis=1)
        ring = dilate(eye_m, 6) & ~eye_m
        ring_src = np.roll(ring, shift, axis=1)
        offset = rgb[ring].mean(axis=0) - rgb[ring_src].mean(axis=0)
        patched = src_patch + offset
        blend = feather(eye_m, 2.5)[..., None]
        body_rgb = body_rgb * (1 - blend) + patched * blend

    w.save(np.dstack([body_rgb, body_a]), 'moshi-body', 'moshi', box=(131, 66, 1167, 1248), widths=WIDTHS['moshi-body'])


def rig_crane(src: Image.Image, w: Writer):
    a = np.array(src).astype(float)
    H, W = a.shape[:2]
    rgb, al = a[..., :3], np.where(a[..., 3] < 10, 0, a[..., 3])
    yy, xx = np.mgrid[0:H, 0:W]

    # Sign on its hook.
    x0, y0, x1, y1 = SIGN_BOX
    sign = np.zeros((H, W), bool)
    sign[y0:y1, x0:x1] = True
    w.save(np.dstack([rgb, np.where(sign, al, 0)]), 'crane-sign', 'crane', pivot=SIGN_PIVOT)
    base_a = np.where(sign, 0, al)

    # Page background: the empty page, rebuilt under the blocks.
    px0, py0, px1, py1 = PANEL
    panel = (xx >= px0) & (xx < px1) & (yy >= py0) & (yy < py1)
    blocks = np.zeros((H, W), bool)
    for (bx0, by0, bx1, by1) in WIN_ITEMS.values():
        blocks[by0 - HOLE_PAD:by1 + HOLE_PAD, bx0 - HOLE_PAD:bx1 + HOLE_PAD] = True
    lum = rgb @ [0.299, 0.587, 0.114]
    sample = panel & ~blocks & (lum > 215)
    feats = lambda x, y: np.stack([np.ones_like(x, dtype=float), x, y, x ** 2, y ** 2, x * y], -1)
    X = feats(xx[sample].astype(float), yy[sample].astype(float))
    coef = [np.linalg.lstsq(X, rgb[sample][:, c], rcond=None)[0] for c in range(3)]
    F = feats(xx.astype(float), yy.astype(float))
    page = np.stack([F @ k for k in coef], -1)
    # The fit is only the broad shading: diffuse what it misses (the real page's
    # local shading) in from around each hole, at quarter size since it is smooth.
    known = panel & ~blocks
    resid = np.where(known[..., None], rgb - page, 0.0)
    q = 4
    sub = resid[py0:py1:q, px0:px1:q].copy()
    kn = known[py0:py1:q, px0:px1:q]
    for _ in range(1500):
        avg = (np.roll(sub, 1, 0) + np.roll(sub, -1, 0) + np.roll(sub, 1, 1) + np.roll(sub, -1, 1)) / 4
        sub = np.where(kn[..., None], sub, avg)
    up = np.array([np.array(Image.fromarray(sub[..., c].astype(np.float32)).resize((px1 - px0, py1 - py0), Image.BILINEAR)) for c in range(3)])
    page[py0:py1, px0:px1] += np.moveaxis(up, 0, -1)

    base_rgb = rgb.copy()
    hole = blocks & panel
    base_rgb[hole] = page[hole]
    w.save(np.dstack([base_rgb, base_a]), 'crane', 'crane', box=(79, 12, 1206, 1218), widths=WIDTHS['crane'])

    # Each block, unmixed from the page so it composites cleanly anywhere on it.
    def block(rgb_src, bx):
        bx0, by0, bx1, by1 = bx
        m = np.zeros((H, W), bool)
        m[by0 - ITEM_PAD:by1 + ITEM_PAD, bx0 - ITEM_PAD:bx1 + ITEM_PAD] = True
        for other in WIN_ITEMS.values():  # never carry a neighbour's edge or shadow along
            if other != bx:
                ox0, oy0, ox1, oy1 = other
                m[oy0 - 8:oy1 + 8, ox0 - 8:ox1 + 8] = False
        d = np.abs(rgb_src - page).max(axis=-1)
        alpha = np.clip((d - 6) / 30, 0, 1) * m  # ignore the faintest shadow, it streaks when a block stretches
        safe = np.maximum(alpha, 1e-3)[..., None]
        col = (rgb_src - (1 - alpha[..., None]) * page) / safe
        return np.dstack([np.clip(col, 0, 255), alpha * 255]), (bx0 - ITEM_PAD, by0 - ITEM_PAD, bx1 + ITEM_PAD, by1 + ITEM_PAD)

    # The sun comes off the hero so it can travel across the sky.
    sx0, sy0, sx1, sy1 = SUN_BOX
    sun_region = np.zeros((H, W), bool)
    sun_region[sy0:sy1, sx0:sx1] = True
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    sun = sun_region & (r > 180) & (b < 140)
    sun_m = dilate(sun, 7) & sun_region  # the sun and its soft shadow
    sun_a = feather(dilate(sun, 1), 1.0) * 255 * sun_region
    w.save(np.dstack([rgb, sun_a]), 'win-sun', 'crane', box=(sx0, sy0, sx1, sy1))
    hero_rgb = diffuse(rgb, sun_m)

    for name, bx in WIN_ITEMS.items():
        rgba, box = block(hero_rgb if name == 'hero' else rgb, bx)
        w.save(rgba, f'win-{name}', 'crane', box=box)


def rig_tape(src: Image.Image, w: Writer):
    t = np.array(src).astype(float)
    r, g, b, al = t[..., 0], t[..., 1], t[..., 2], t[..., 3]
    fringe = (r > 110) & (g < 0.55 * r) & (b < 0.55 * r)
    al = np.where(fringe | (al < 12), 0, al)
    w.save(np.dstack([t[..., :3], al]), 'tape', 'tape', widths=WIDTHS['tape'])


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    root = Path(__file__).resolve().parent.parent
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else root / 'public/brand/maintenance'
    rig_path = Path(sys.argv[3]) if len(sys.argv) > 3 else root / 'src/pages/maintenance/rig.json'
    out.mkdir(parents=True, exist_ok=True)
    imgs = images_from_svg(Path(sys.argv[1]))
    w = Writer(out)
    rig_moshi(imgs['image1'], w)
    rig_crane(imgs['image2'], w)
    rig_tape(imgs['image0'], w)
    rig_path.write_text(json.dumps(w.rig, indent=2) + '\n')
    print('rig ->', rig_path)


if __name__ == '__main__':
    main()
