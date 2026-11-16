"""Colour-grade real venue photos into the site palette (night green, warm gold).
Real photos only: grading changes colour and contrast, never content."""
import sys, numpy as np
from PIL import Image, ImageFilter
import colorsys

SRC = r"C:/Users/harmy/Downloads/Redwood-Farm/gbp-photos/"
OUT = "src/assets/venue/"

def grade(path, out, vignette=0.35, sat=0.78, warm=1.0):
    im = Image.open(SRC + path).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    # hue-selective desaturation of magenta/purple/pink (event drapes, LED uplights)
    hsv = np.asarray(im.convert("HSV")).astype(np.float32) / 255.0
    h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
    mag = np.clip(1 - np.abs(((h - 300 + 180) % 360) - 180) / 70, 0, 1)  # peak at 300deg
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]
    k = (sat * (1 - 0.75 * mag))[..., None]
    a = lum + (a - lum) * k
    # contrast curve (soft S), crush blacks slightly
    a = np.clip((a - 0.04) / 0.96, 0, 1)
    a = a * a * (3 - 2 * a) * 0.55 + a * 0.45
    # split tone: shadows to night green, highlights to fairy gold
    sh = np.array([0.043, 0.075, 0.055]); hi = np.array([1.0, 0.86, 0.60])
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]
    ws = np.clip(1 - lum * 2.2, 0, 1) * 0.55
    wh = np.clip((lum - 0.55) * 2.0, 0, 1) * 0.22 * warm
    a = a * (1 - ws) + sh * ws
    a = a * (1 - wh) + (a * hi) * wh + hi * wh * 0.05
    # vignette
    H, W = a.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 1.414
    a = a * (1 - vignette * np.clip(r - 0.25, 0, 1)[..., None] ** 1.6 * 1.6)
    out_im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    out_im = out_im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    out_im.save(OUT + out, quality=92)
    print(out, out_im.size)

JOBS = [
 ("2-fairy-light-tunnel/06_light_tunnel.jpg", "tunnel.jpg"),
 ("2-fairy-light-tunnel/07_lit_garden_path_night.jpg", "garden-path-night.jpg"),
 ("2-fairy-light-tunnel/08_lit_palms_path_dusk.jpg", "palms-dusk.jpg"),
 ("2-fairy-light-tunnel/09_fairy_lit_tree_night.jpg", "fairy-tree.jpg"),
 ("2-fairy-light-tunnel/10_canopy_lights.jpg", "canopy.jpg"),
 ("2-fairy-light-tunnel/11_garden_lights_purple.jpg", "blossom-path.jpg"),
 ("3-lawn-by-night/12_lawn_tables_night.jpg", "lawn-tables.jpg"),
 ("3-lawn-by-night/13_lawn_seating_night.jpg", "lawn-seating.jpg"),
 ("3-lawn-by-night/14_lawn_string_lights_lounge.jpg", "string-lounge.jpg"),
 ("3-lawn-by-night/15_lawn_string_lights_wide.jpg", "string-wide.jpg"),
 ("3-lawn-by-night/16_tent_dining_night.jpg", "tent-dining.jpg"),
 ("4-seating/17_lawn_table_under_palm.jpg", "palm-table.jpg"),
 ("4-seating/18_daytime_lounge_seating.jpg", "day-lounge.jpg"),
 ("4-seating/19_daytime_long_tables.jpg", "day-long-tables.jpg"),
 ("1-exterior-gate/01_entrance_green_arch.jpg", "entrance-arch.jpg"),
 ("1-exterior-gate/02_redwood_arch.jpg", "name-arch.jpg"),
 ("1-exterior-gate/04_garden_path_day.jpg", "garden-path-day.jpg"),
 ("5-food/27_buffet_live_counter.jpg", "buffet-lawn.jpg"),
 ("6-events/28_birthday_setup.jpg", "birthday.jpg"),
 ("6-events/36_21st_birthday_balloons.jpg", "birthday-arch.jpg"),
 ("6-events/34_kite_theme_backdrop.jpg", "kitty-backdrop.jpg"),
 ("6-events/35_mehndi_stage.jpg", "family-function.jpg"),
 ("6-events/31_function_lawn_night.jpg", "function-night.jpg"),
 ("6-events/33_entry_gate_pink.jpg", "event-gate.jpg"),
 ("6-events/29_party_hall_setup.jpg", "party-setup.jpg"),
]
for s, o in JOBS: grade(s, o)
