#!/usr/bin/env python3
"""
Moshi rig: turns the Moshi render into animatable, transparent layers.

    python3 scripts/moshi-rig.py <moshi.svg|moshi.png> [out_dir] [rig_module]

Input is the mascot render (an SVG wrapping a base64 PNG, or the PNG itself).
Output (default public/brand/moshi/):
    moshi.webp         the untouched render, background removed (reference)
    body.webp          Moshi without the waving arm; the buddy is removed and the flank it hid rebuilt
    arm.webp           the waving arm (pivots at the shoulder)
    hand.webp          forearm + hand that rested on the buddy (props go between it and the body)
    vest.webp          hi-vis vest painted with the render's shading, cuffs hide the arm joint
    rig.json           layer boxes + pivots, in the source image's pixel space
Also copies rig.json to src/brand/moshi-rig.json (default rig_module) so the app can import it.

Only needs numpy + Pillow.
"""
import base64
import json
import re
import sys
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

# Shoulder cut for the waving arm, in source pixels (928 x 1152 render).
ARM_POLYGON = [(90, 380), (238, 380), (240, 470), (230, 508), (218, 532), (205, 560), (195, 586), (90, 588)]
SHOULDER_CUT = ((230, 508), (195, 586))  # the joint line between arm and body
ARM_PIVOT = (212, 547)  # middle of the joint line
# Hi-vis vest (render pixels): neckline V tip, top, hem, right limit (where the other arm starts).
VEST_NECK = (420, 640)
VEST_TOP = 545
VEST_HEM = 848
VEST_RIGHT = 597  # the other arm starts here...
VEST_RIGHT_UNTIL = 660  # ...down to this row
VEST_STRIPES = [(700, 716), (772, 788)]
VEST_COLOR = (255, 122, 26)
STRIPE_COLOR = (236, 240, 242)
TRIM_COLOR = (214, 92, 16)
CUFF_R = 17
CUFFS = [SHOULDER_CUT, ((594, 584), (600, 650))]
BUDDY_REGION = (520, 610)  # buddy lives right of x and below y
FLOOR_Y = 880  # below this the studio floor (reflections, contact shadows) starts
MIRROR_X = 393  # Moshi's vertical axis (between the flanks at shoulder height), for rebuilding the hidden flank
SEAM_BLEND = 26  # px over which the rebuilt flank blends into the visible edge
AO_STRIP = 14  # px of ball-shadowed flank replaced as well
RIGHT_LEG_X = 515  # nothing of Moshi's on the floor right of this


def load(path: Path) -> Image.Image:
    data = path.read_bytes()
    if path.suffix.lower() == ".svg":
        m = re.search(rb"data:image/(?:png|jpeg|webp);base64,([A-Za-z0-9+/=]+)", data)
        if not m:
            sys.exit("No embedded raster image found in the SVG.")
        data = base64.b64decode(m.group(1))
    return Image.open(BytesIO(data)).convert("RGBA")


def flood_background(bg_like: np.ndarray) -> np.ndarray:
    """Background = bg-like pixels connected to the image border."""
    h, w = bg_like.shape
    img = Image.fromarray(np.where(bg_like, 255, 0).astype(np.uint8)).copy()
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    seeds += [(x, 0) for x in range(0, w, 50)] + [(x, h - 1) for x in range(0, w, 50)]
    for seed in seeds:
        if img.getpixel(seed) == 255:
            ImageDraw.floodfill(img, seed, 128)
    return np.array(img) == 128


def largest_from(mask: np.ndarray, seed) -> np.ndarray:
    img = Image.fromarray(np.where(mask, 255, 0).astype(np.uint8)).copy()
    ImageDraw.floodfill(img, seed, 128)
    return np.array(img) == 128


def fill_holes(mask: np.ndarray) -> np.ndarray:
    inv = Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).copy()
    ImageDraw.floodfill(inv, (0, 0), 128)
    return np.array(inv) != 128


def dilate(mask: np.ndarray, px: int) -> np.ndarray:
    img = Image.fromarray(np.where(mask, 255, 0).astype(np.uint8)).filter(ImageFilter.MaxFilter(px * 2 + 1))
    return np.array(img) > 0


def save_layer(rgb: np.ndarray, alpha: np.ndarray, out: Path, name: str, rig: dict, pad: int = 2):
    ys, xs = np.nonzero(alpha > 0.01)
    x0, y0 = max(xs.min() - pad, 0), max(ys.min() - pad, 0)
    x1, y1 = min(xs.max() + pad + 1, alpha.shape[1]), min(ys.max() + pad + 1, alpha.shape[0])
    rgba = np.dstack([rgb[y0:y1, x0:x1], (alpha[y0:y1, x0:x1] * 255).round()]).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(out / f"{name}.webp", "WEBP", quality=90, method=6)
    rig[name] = {"x": int(x0), "y": int(y0), "w": int(x1 - x0), "h": int(y1 - y0)}


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    out = Path(sys.argv[2] if len(sys.argv) > 2 else "public/brand/moshi")
    out.mkdir(parents=True, exist_ok=True)

    im = load(src)
    px = np.asarray(im).astype(np.float32)
    rgb = px[..., :3]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    sat = rgb.max(-1) - rgb.min(-1)
    lum = 0.299 * r + 0.587 * g + 0.114 * b

    h, w = lum.shape
    yy, xx = np.mgrid[0:h, 0:w]

    # 1. Background: studio grey connected to the border, plus the floor (tinted reflection and
    #    dark contact shadows) and any enclosed bright grey pocket (the gap between the legs).
    #    Moshi's grey eyes are dark and enclosed by the body, so none of these rules reach them.
    floor = (yy > FLOOR_Y) & (((sat < 34) & (lum > 140)) | ((sat < 22) & (lum < 60)))
    background = flood_background(((sat < 26) & (lum > 120)) | floor) | ((sat < 26) & (lum > 200))
    fg = ~background

    # Soft edge: in a thin band around the cut, alpha follows saturation; inside, fully opaque.
    edge = fg & dilate(background, 2)
    alpha = np.where(fg, 1.0, 0.0)
    alpha[edge] = np.clip((sat[edge] - 10) / 45.0, 0, 1)
    bg_col = np.median(rgb[background], axis=0)
    # Un-mix the grey background from semi-transparent edge pixels (kills the halo).
    a = np.maximum(alpha[..., None], 1e-3)
    clean = np.where(alpha[..., None] > 0, np.clip((rgb - (1 - a) * bg_col) / a, 0, 255), rgb)

    # 2. Buddy: navy (green barely above red) vs Moshi's cyan (green well above red).
    region = (xx > BUDDY_REGION[0]) & (yy > BUDDY_REGION[1])
    cand = fg & region & ((g - r) < 45)
    ys, xs = np.nonzero(cand)
    seed = (int(np.median(xs)), int(np.median(ys)))
    buddy = fill_holes(largest_from(cand, seed)) & fg
    # Fit a circle (least squares) to the buddy's outline where it meets the background,
    # i.e. the part not hidden behind Moshi.
    rim = buddy & dilate(background, 1) & (yy < FLOOR_Y + 40)
    ry, rx = np.nonzero(rim)
    A = np.column_stack([rx, ry, np.ones_like(rx)]).astype(np.float64)
    sol, *_ = np.linalg.lstsq(A, -(rx.astype(np.float64) ** 2 + ry.astype(np.float64) ** 2), rcond=None)
    cx, cy = -sol[0] / 2, -sol[1] / 2
    rad = float(np.sqrt(cx ** 2 + cy ** 2 - sol[2]))
    dist2 = (xx - cx) ** 2 + (yy - cy) ** 2
    circle = dist2 <= rad ** 2
    buddy &= circle  # the buddy is removed from the scene; its circle tells us what it covered

    # 3. Waving arm: polygon cut at the shoulder.
    poly = Image.new("L", (w, h), 0)
    ImageDraw.Draw(poly).polygon(ARM_POLYGON, fill=255)
    arm = fg & (np.array(poly) > 0) & ~buddy
    arm_alpha = np.where(arm, alpha, 0.0)

    body = fg & ~buddy & ~arm
    body_alpha = np.where(body, alpha, 0.0)
    # Anything inside the buddy's circle that isn't Moshi's cyan (dark contact shading) belongs to the buddy.
    body_alpha[(dist2 <= (rad + 16) ** 2) & ((g - r) < 45)] = 0.0

    # 4. Hand: the forearm and hand that rested on the buddy. Kept as its own layer so props
    #    (or the buddy) can sit between it and the body.
    hand = body & (dist2 <= (rad + 3) ** 2) & (yy < cy - rad * 0.55) & ((g - r) >= 45)
    hand_alpha = np.where(hand, alpha, 0.0)

    # 5. The buddy hid Moshi's lower right flank, which the render never drew. Rebuild it by
    #    mirroring the left flank (real clay shading and edge), blended into the visible edge.
    body_rgb = clean.copy()
    src_x = np.clip(np.round(2 * MIRROR_X - xx).astype(int), 0, w - 1)
    visible = body_alpha > 0.5
    zone = body[yy, src_x] & ~visible & (dist2 <= (rad + 16) ** 2) & (yy > cy - rad - 4) & (yy < FLOOR_Y + 10)
    # The render also darkened the visible flank right next to the ball (its contact shadow):
    # replace that strip too so the seam starts on clean, evenly lit clay.
    zone |= visible & ~hand & (dist2 <= (rad + 16 + AO_STRIP) ** 2) & (yy > cy - rad * 0.55) & (yy < FLOOR_Y + 10)
    for y in np.unique(np.nonzero(zone)[0]):
        xs = np.nonzero(zone[y])[0]
        seam = xs.min() - 1
        edge_px = clean[y, max(seam - 2, 0)]
        t = np.clip((xs - seam) / SEAM_BLEND, 0, 1)[:, None]
        body_rgb[y, xs] = (1 - t) * edge_px + t * clean[y, src_x[y, xs]]
        body_alpha[y, xs] = alpha[y, src_x[y, xs]]
    body |= zone
    # The buddy's contact shadow on the floor, right of Moshi's feet, goes too.
    body_alpha[(yy > FLOOR_Y) & (xx > RIGHT_LEG_X)] = 0.0
    lum = 0.299 * body_rgb[..., 0] + 0.587 * body_rgb[..., 1] + 0.114 * body_rgb[..., 2]

    # 6. Hi-vis vest: recolour the torso with the render's own shading (so it reads as painted on
    #    the clay), plus cuffs at the arm holes. The left cuff is drawn above the swinging arm and
    #    hides the shoulder joint at any angle.
    shade = np.clip(lum / np.median(lum[body & (yy > 560) & (yy < 840)]), 0.55, 1.2)[..., None]
    neck = np.maximum(VEST_TOP, VEST_NECK[1] - 1.4 * np.abs(xx - VEST_NECK[0]))
    vest = (body_alpha > 0.05) & ~hand & (yy >= neck) & (yy <= VEST_HEM) & ((xx < VEST_RIGHT) | (yy > VEST_RIGHT_UNTIL))
    vest_rgb = np.array(VEST_COLOR, float) * shade
    stripes = np.zeros_like(vest)
    for y0, y1 in VEST_STRIPES:
        stripes |= (yy >= y0) & (yy < y1)
    vest_rgb[stripes] = (np.array(STRIPE_COLOR, float) * shade)[stripes]
    trim = vest & ((yy - neck < 7) | (VEST_HEM - yy < 7))
    vest_rgb[trim] = (np.array(TRIM_COLOR, float) * shade)[trim]
    vest_alpha = np.where(vest, alpha, 0.0)
    cuff_shade = np.where(fg[..., None], shade, 0.95)
    for (ax, ay), (bx, by) in CUFFS:
        vx, vy = bx - ax, by - ay
        t = np.clip(((xx - ax) * vx + (yy - ay) * vy) / (vx * vx + vy * vy), -0.1, 1.1)
        dist = np.hypot(xx - (ax + t * vx), yy - (ay + t * vy))
        cuff = (dist <= CUFF_R + 1) & ~buddy
        vest_rgb[cuff] = (np.array(TRIM_COLOR, float) * cuff_shade)[cuff]
        vest_alpha[cuff] = np.maximum(vest_alpha[cuff], np.clip(CUFF_R + 0.5 - dist[cuff], 0, 1))
    vest_rgb = np.clip(vest_rgb, 0, 255)

    rig = {"source": {"w": w, "h": h}}
    save_layer(clean, alpha, out, "moshi", rig)
    save_layer(body_rgb, body_alpha, out, "body", rig)
    save_layer(clean, arm_alpha, out, "arm", rig)
    save_layer(clean, hand_alpha, out, "hand", rig)
    save_layer(vest_rgb, vest_alpha, out, "vest", rig)
    legs = np.nonzero(body_alpha[FLOOR_Y + 20:FLOOR_Y + 60] > 0.5)[1]
    feet_x = int(np.median(legs))  # middle between the legs
    rig["pivots"] = {
        "arm": {"x": ARM_PIVOT[0], "y": ARM_PIVOT[1]},
        "feet": {"x": feet_x, "y": int(rig["body"]["y"] + rig["body"]["h"])},
    }
    rig["buddyCircle"] = {"cx": round(float(cx), 1), "cy": round(float(cy), 1), "r": round(float(rad), 1)}
    text = json.dumps(rig, indent=2) + "\n"
    (out / "rig.json").write_text(text)
    module = Path(sys.argv[3] if len(sys.argv) > 3 else "src/brand/moshi-rig.json")
    module.parent.mkdir(parents=True, exist_ok=True)
    module.write_text(text)
    print(json.dumps(rig, indent=2))


if __name__ == "__main__":
    main()
