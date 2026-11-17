# Red Wood Farm: redesign pass (17 Nov 2026)

**Live preview:** https://redwood-farm.vercel.app (noindex; canonicals point at the GitHub address)
**QR address:** https://bhapag.github.io/redwood-farm/ (redeployed with the new design)

All content, SEO, menu data, schema and routes are unchanged. Only the visual design and the phone experience changed.

## What changed
- **Colour rhythm.** Ivory editorial sections (#F7F4EC, black text) alternate with night and deep-green sections. Green is now a real section colour for the dishes, the quote band, the hours card and the footer. On Home the order is night, ivory, green, ivory, night, green, ivory, night, then the green footer.
- **A different layout in every section.**
  1. Split hero.
  2. Editorial two-column intro with an hours and address card. This fixes the half-empty intro.
  3. Swipe dish carousel on phones, ten-tile grid on desktop.
  4. Three party set-ups, staggered on desktop.
  5. One large photo with a caption.
  6. A film strip, with a wide/narrow rhythm on phones that drifts as you scroll on desktop.
  7. A full-width quote band.
  8. Guide lists.
  9. A visit split.
- **Removed:**
  - every eyebrow label and numbered label (step numbers now sit inside the step heading)
  - every italic gold accent word
  - text over busy photos
  - the empty drawn-arch hero
  - the pinned crossfade that caused the ghosted double exposure
- **Hero:** opens straight on the real tunnel photo, sharpened, with a scrollbar artifact cropped off. The neon "Red Wood Farm" sits on solid night, so it reads clearly. Under it: a three-line headline, a one-line subline and two CTAs. On a 360 x 800 phone everything fits one screen above the action bar. On desktop the night panel is on the left and the photo on the right. The motion is a slow CSS push-in and a single neon flicker.
- **Type:**
  - Three pairings were tested side by side (`report/redesign/directions/type_*.jpg`).
  - Chosen: Gloock for headlines and Hanken Grotesk for everything else.
  - Hanken has real weights for labels, prices and buttons, so they no longer look as light as body text.
  - Bodoni's hairlines broke up at 360 px.
- **Phones:**
  - no pinning and no scroll-scrubbing (GSAP and Lenis now load only on desktop)
  - a full-screen menu sheet, with the action bar hidden while it's open
  - 17 px body text, and every tap target at least 44 px
  - portrait crops
  - a "Swipe for more" hint on the dishes
- **Menu:**
  - a sticky search bar, Veg / Non-veg filter and category chips, all 44 px
  - 17 px dish names
  - 20 px bold prices
  - a back-to-top button
- **Photos:**
  - The lawn-with-mattress shots are gone.
  - The over-saturated stage photo was replaced on Home and Parties.
  - Unused video loops were deleted.
  - Every image now carries its origin in its file metadata: real venue photo, or illustrative AI dish photo.

## Process
- **Mobile audit** (`MOBILE-AUDIT.md`): 27 problems found on 360, 390 and 412 px phones across Home, Menu, Parties, Visit and one guide.
- **Research** (`RESEARCH-UI.md`): five Awwwards restaurant and venue sites captured at 390 and 1440 px: Ballena, Studenterkilden, Qissa, Burrito Madre and Pier88. The notes say what we borrowed from each and which are anti-references.
- **Two homepage directions** rendered at 1440 and 390 px (`report/redesign/directions/`). Direction A, "Night and linen", was picked; the reasons are in `DECISIONS.md` section 14.
- **Independent design review:** the first review asked for 8 fixes, and all 8 were made. The verdict pass scored 7 resolved and 1 partial, the stage photo still on /party/, which was then swapped. `DESIGN.md` now records the built system.

## Gates (all pass, on the live sites)

| Check | Result |
|---|---|
| Lighthouse mobile, Vercel: Home | Performance 97, Accessibility 100, Best Practices 100; LCP 2.3 s |
| Menu | 100 / 100 / 100; LCP 1.4 s |
| Parties | 99 / 100 / 100 |
| Birthday guide | 100 / 100 / 100 |
| Visit | 99 / 100 / 100 |
| SEO on Vercel | 69, only because the noindex header fails "page is blocked from indexing", which is intended |
| Lighthouse mobile, GitHub Pages: Home | 97 / 100 / 100 / **SEO 100** |
| All 61 pages at 360, 390 and 412 px (live Vercel) | 0 overflow, 0 console errors |
| Desktop at 1280 and 1440 px (local build) | 0 overflow, 0 console errors |
| Menu | 187 of 187 dishes and every price live; 0 mismatches against the Excel |
| Content QA (`qa_content.py`) | Pass |
| Links, name/address/phone, JSON-LD (`qa_check.py`) | Pass |
| Sitemap URLs returning 200 | 61/61 on Vercel, 61/61 on GitHub Pages |

## Before and after
- **Home, section by section, phone 390 px:** `report/redesign/before-after-home-390.jpg`. Each pair is also saved separately as `report/redesign/sections/pair_<section>_390.jpg`.
- **Home, section by section, desktop 1440 px:** `report/redesign/before-after-home-1440.jpg` and `sections/pair_<section>_1440.jpg`.
- **Every page on three phones:** contact sheets in `report/redesign/before/` and `report/redesign/after/`, with `metrics.json`. Tap targets under 44 px went from 13 to 0 on Home, from 18 to 0 on Menu, and from 5–9 to 0 on Parties.
- **20-second phone scroll recording:** `report/redesign/mobile-scroll-20s.mp4` (iPhone 13 size, hero to footer).

## Not done, and why
- **No AI photo upscale and no video loop.** Higgsfield has 0.62 credits. The tunnel photo was cropped and sharpened locally instead. Other real photos are shown only at sizes where they hold up.
- **Cloudflare and the domain** are unchanged and still pending (DEPLOY.md).
- **Owner unknowns** still read "ask us on WhatsApp": capacity, packages, pool, parking, payment modes and heaters.
