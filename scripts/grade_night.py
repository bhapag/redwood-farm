"""One warm night grade for every photo on the site (redesign-night, 18 Nov 2026).

Real photos only: the grade changes colour, contrast and crop, never content.
Venue photos are graded from the untouched originals in Downloads/Redwood-Farm/gbp-photos.
Food photos (owner-approved Higgsfield images) are graded from design/raw-food.
Writes into src/assets/venue and src/assets/food under the same file names, so every page,
guide and share card picks up the grade without import changes. Re-run any time:
    python scripts/grade_night.py
"""
import numpy as np
from PIL import Image, ImageFilter

RAW = "C:/Users/harmy/Downloads/Redwood-Farm/gbp-photos/"
VENUE = "src/assets/venue/"
FOOD_RAW = "design/raw-food/"
FOOD = "src/assets/food/"

# Night palette anchors: forest-black shadows, fairy-light gold highlights.
SHADOW = np.array([0.035, 0.058, 0.045])
GOLD = np.array([1.0, 0.84, 0.56])


def lum(a):
    return (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]


def grade(im, warm=1.0, shadow=0.55, sat=0.82, expo=1.0, vignette=0.32, magenta=0.75, soften=0.0):
    im = im.convert("RGB")
    if soften:
        im = im.filter(ImageFilter.GaussianBlur(soften))
    a = np.asarray(im).astype(np.float32) / 255.0 * expo
    # tame magenta/purple LED uplights and drapes (they fight the green-gold palette)
    h = np.asarray(im.convert("HSV")).astype(np.float32)[..., 0] / 255.0 * 360
    mag = np.clip(1 - np.abs(((h - 300 + 180) % 360) - 180) / 70, 0, 1)
    k = (sat * (1 - magenta * mag))[..., None]
    L = lum(a)
    a = L + (a - L) * k
    # soft S-curve with a slightly lifted floor (night, not crushed black)
    a = np.clip((a - 0.03) / 0.97, 0, 1)
    a = a * a * (3 - 2 * a) * 0.5 + a * 0.5
    # split tone: shadows toward forest-black, highlights toward warm gold
    L = lum(a)
    ws = np.clip(1 - L * 2.4, 0, 1) * shadow
    wh = np.clip((L - 0.45) * 1.8, 0, 1) * 0.26 * warm
    a = a * (1 - ws) + SHADOW * ws
    a = a * (1 - wh) + (a * GOLD) * wh + GOLD * wh * 0.04
    # gentle overall warmth (fairy light)
    a = a * np.array([1.0 + 0.03 * warm, 1.0, 1.0 - 0.06 * warm])
    if vignette:
        H, W = a.shape[:2]
        yy, xx = np.mgrid[0:H, 0:W]
        r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 1.414
        a = a * (1 - vignette * np.clip(r - 0.25, 0, 1)[..., None] ** 1.6 * 1.6)
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=2))


NIGHT = dict()
DAY = dict(expo=0.84, warm=1.5, shadow=0.45, sat=0.8, vignette=0.42)  # daytime shots pulled toward evening

VENUE_JOBS = [
    ("2-fairy-light-tunnel/06_light_tunnel.jpg", "tunnel.jpg", NIGHT, None),
    ("2-fairy-light-tunnel/06_light_tunnel.jpg", "tunnel-hero.jpg", NIGHT, (0, 0, 1518, 864)),
    ("2-fairy-light-tunnel/07_lit_garden_path_night.jpg", "garden-path-night.jpg", NIGHT, None),
    ("2-fairy-light-tunnel/07_lit_garden_path_night.jpg", "hero-path-portrait.jpg", dict(soften=0.5), (220, 0, 1320, 1376)),
    ("2-fairy-light-tunnel/07_lit_garden_path_night.jpg", "hero-path-landscape.jpg", dict(soften=0.5), (0, 248, 1376, 1280)),
    ("2-fairy-light-tunnel/08_lit_palms_path_dusk.jpg", "palms-dusk.jpg", NIGHT, None),
    ("2-fairy-light-tunnel/09_fairy_lit_tree_night.jpg", "fairy-tree.jpg", NIGHT, None),
    ("2-fairy-light-tunnel/10_canopy_lights.jpg", "canopy.jpg", NIGHT, None),
    ("2-fairy-light-tunnel/11_garden_lights_purple.jpg", "blossom-path.jpg", NIGHT, None),
    ("3-lawn-by-night/12_lawn_tables_night.jpg", "lawn-tables.jpg", NIGHT, None),
    ("3-lawn-by-night/13_lawn_seating_night.jpg", "lawn-seating.jpg", NIGHT, None),
    ("3-lawn-by-night/14_lawn_string_lights_lounge.jpg", "string-lounge.jpg", NIGHT, None),
    ("3-lawn-by-night/15_lawn_string_lights_wide.jpg", "string-wide.jpg", NIGHT, None),
    ("3-lawn-by-night/16_tent_dining_night.jpg", "tent-dining.jpg", NIGHT, None),
    ("4-seating/17_lawn_table_under_palm.jpg", "palm-table.jpg", NIGHT, None),
    ("4-seating/18_daytime_lounge_seating.jpg", "day-lounge.jpg", DAY, None),
    ("4-seating/19_daytime_long_tables.jpg", "day-long-tables.jpg", DAY, None),
    ("1-exterior-gate/01_entrance_green_arch.jpg", "entrance-arch.jpg", DAY, None),
    ("1-exterior-gate/02_redwood_arch.jpg", "name-arch.jpg", DAY, None),
    ("1-exterior-gate/04_garden_path_day.jpg", "garden-path-day.jpg", DAY, None),
    ("5-food/27_buffet_live_counter.jpg", "buffet-lawn.jpg", NIGHT, None),
    ("6-events/28_birthday_setup.jpg", "birthday.jpg", NIGHT, None),
    ("6-events/36_21st_birthday_balloons.jpg", "birthday-arch.jpg", NIGHT, None),
    ("6-events/35_mehndi_stage.jpg", "family-function.jpg", DAY, None),
    ("6-events/31_function_lawn_night.jpg", "function-night.jpg", NIGHT, None),
    ("6-events/33_entry_gate_pink.jpg", "event-gate.jpg", NIGHT, None),
    ("6-events/29_party_hall_setup.jpg", "party-setup.jpg", NIGHT, None),
]

FOOD_GRADE = dict(warm=0.8, shadow=0.35, sat=0.92, vignette=0.18, magenta=0.3)

if __name__ == "__main__":
    import os
    for src, out, kw, box in VENUE_JOBS:
        im = Image.open(RAW + src)
        if box:
            im = im.crop(box)
        g = grade(im, **kw)
        g.save(VENUE + out, quality=92)
        print("venue", out, g.size)
    for f in sorted(os.listdir(FOOD_RAW)):
        if f.endswith(".jpg"):
            g = grade(Image.open(FOOD_RAW + f), **FOOD_GRADE)
            g.save(FOOD + f, quality=92)
            print("food", f, g.size)
