# HIGGSFIELD-PLAN: Red Wood Farm website (17 Nov 2026)

## Credit check (00:45 IST)
- Balance: **0.62 credits**, Lite plan. The free unlimited allowance showed "available: false".
- Preferences: auto_create_project = false.
- One image on the cheapest suitable model costs more than 0.62 credits, so **no new Higgsfield jobs were run**.
- Nothing was bought: no spending without Harman's approval.

## What the site uses instead

| Asset | Source | AI or real | Where |
|---|---|---|---|
| 11 dish photos (paneer tikka, tandoori chicken, dal makhni, butter chicken, kadhai paneer, non-veg biryani, hakka noodles, mutton rogan josh, paneer jalebi with rabri, non-veg platter, veg sizzler) | Higgsfield, made earlier for the printed menu (`design/menu-print/photos`) | AI (Higgsfield) | Home "What to order first" strip, menu category photos, dish-name hover preview |
| 4 dish photos (tandoor glow, paneer on the grill, seekh kebab, naan basket) | Higgsfield, made earlier (`design/menu-v2/photos/raw`) | AI (Higgsfield) | Tandoor glow: Home story chapter 1. Naan: menu Breads |
| Every venue, lawn, tunnel, gate, seating and event photo | Red Wood Farm's own Facebook and Instagram photos (`gbp-photos/`) | Real. Colour-graded only (`scripts/grade.py`): magenta and pink uplights pulled down, shadows to night green, highlights to warm gold, light vignette. Content unchanged. | All venue imagery on every page |
| Lawn loop video (10 s) | Real photo 15 "string lights wide", slow ffmpeg push-in with a soft brightness breathe | Real photo, animated locally | Home story chapter 2 |
| Tunnel loop video (10 s) | Real photo 06 "light tunnel", the same treatment | Real photo, animated locally | Home hero end state (desktop only, loads after the first scroll) |
| Light-tunnel walk | Drawn live on a canvas in code (arches of warm dots in one-point perspective plus a red carpet) | Code, not AI | Home hero, scrubbed by scroll, then cross-fades into the real tunnel photo |
| Social share images (5) | Real or Higgsfield photo plus the neon name and a headline, rendered with Playwright | Mixed | og-home / menu / party / visit / notes |

Rules kept: no generated venue, no generated people, no events that didn't happen.

## Style bible (for when credits are added)
- **Lens and camera:** 50 mm, f/2, eye level for dishes on the table; 85 mm for close-ups. Shallow depth of field.
- **Light:** warm low-key night light, one key from the upper left like a hanging bulb. Fairy-light bokeh in the background, warm white #FFF1C9. No flash, no blown highlights.
- **Grade:** blacks near #0B0F0C with a green cast, highlights warm towards #F2CF83, saturation slightly reduced, no magenta.
- **Surfaces:** dark weathered wood, hammered copper and brass, deep green linen napkin (#1D3A2B), white ceramic only where the real restaurant uses it.
- **Look reference:** use `design/menu-print/photos/butter_chicken.jpg` as the reference image for every new food image, so everything matches the existing set.

## If credits are added: exact jobs, in order
1. **Upscale the 11 menu-print dishes to 4K** (`upscale_image`), so the full-bleed sizes stay sharp. They plug in at `src/assets/food/`.
2. **Cut-outs** (`remove_background`) of paneer tikka, tandoori chicken and dal makhni, for floating-plate parallax layers on the Home "What to order first" title.
3. **Missing dishes, from the real menu only:** Chilli Paneer, Malai Champ, Butter Naan basket, Gulab Jamun. Model `gpt_image_2_6` (high quality, 2k) with the reference image above, prompt pattern: "{dish} as served at a North Indian garden restaurant, on a hammered copper or dark wood surface, deep green linen napkin, warm low-key night light with soft fairy-light bokeh behind, 50 mm, f/2, photoreal, no text, no hands".
4. **Video, image-to-video from the REAL photos only** (`seedance_2_5`, 6 to 8 s, seamless loop, camera locked or slow push-in; prompt: "the fairy lights twinkle gently, leaves move slightly in a light breeze, nothing else changes, no people"):
   - `gbp-photos/2-fairy-light-tunnel/06_light_tunnel.jpg` replaces `public/media/tunnel-loop.*`
   - `gbp-photos/3-lawn-by-night/15_lawn_string_lights_wide.jpg` replaces `public/media/lawn-loop.*`
5. **Steam loop** over the tandoor-glow image (image-to-video from `menu-v2/photos/raw/n07_tandoor_glow_cover.png`) for Home story chapter 1.
6. **Quality gate:** reject warped cutlery, melted food, text, extra hands or plastic sheen. Log each kept asset here (prompt, model, job id, where used).

Estimated cost for steps 1 to 5: check `get_cost: true` per job before running. It needs a top-up, which is Harman's call.

## Motion pass check (17 Nov 2026, 19:30 IST)
- **Balance: 0.62 credits** (Lite plan), unchanged. No job was run and nothing was bought.
- **Skipped**, ready to run when credits are added:
  1. **Hero loop.** Image-to-video from the REAL tunnel photo (`src/assets/venue/tunnel-hero.jpg`), 6 to 8 s, seamless. Prompt: "the fairy lights twinkle gently, a slow push-in along the red carpet, nothing else changes, no people". Formats: 9:16 for phones (under 2 MB) and 16:9 for desktop, plus a poster frame. Plays muted and inline.
  2. **Three food loops** from the existing menu photos:
     - steam rising over dal makhni (`dal_makhni.jpg`)
     - sizzle on the tandoori platter (`nonveg_platter.jpg`)
     - a slow pour of butter gravy (`butter_chicken.jpg`)
     
     Each 4 to 6 s and looping, for the dishes section as video blocks.
  3. **Venue upscales.** Upscale every real venue photo used large (tunnel, palm-table, entrance-arch, function-night, birthday-arch, day-lounge), with no added people or objects.
- **Until then:**
  - the hero moves through a CSS push-in on the real photo, React Bits Particles (fairy lights) and ShinyText on the neon name
  - the food stays as stills in the swipe stack
