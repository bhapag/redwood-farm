# Red Wood Farm: final redesign pass and review band (17 Nov 2026)

**Live:** https://bhapag.github.io/redwood-farm/ (the GitHub Pages QR address). Deployed with `deploy-gh.sh`; the latest site commit is `a752ad6`. The Vercel preview stays frozen at its earlier build.

## What changed in this pass
1. **The neon name sits on one line at every width.** "Red Wood Farm" now sizes from the hero panel's own width (`clamp(2.4rem, 15cqi, 6rem)`, `white-space: nowrap`). I measured it from 360 to 2560 px: one line every time, with no overflow.
2. **No empty sections.**
   - **Cause:** desktop headlines used a masked line reveal that stayed hidden until a scroll trigger fired. When the trigger was late or missed, part of the dishes section rendered as an empty green band.
   - **Fix:** that reveal is removed, so no content waits on an animation. Reveals are now a short slide only and never hide content. Report captures pre-load every lazy image.
3. **Review band** (details below): on Home between the dishes and the parties, and a shorter version on Parties and Visit. It replaces the old static quote block.
4. **Bug found and fixed:**
   - **Problem:** the menu's Main Course section used `id="main"`, the same id as the page's `<main>`. The "Main Course" chip and the Home dish links therefore jumped to the top of the menu.
   - **Fix:** the section is now `#main-course`.
   - **Check:** no page on the site has a duplicate id.

## Review band
- **Source:** Red Wood Farm's real Google reviews: the export (`data_google_reviews_with_text.tsv`), plus a fresh read of the live Google Maps listing in Chrome, sorted by newest, on 17 Nov 2026. There are no newer text reviews than the export; the newest is still from about 3 months ago.
- **Live numbers re-checked:** **4.2 ★ from 72 Google reviews** on 17 Nov 2026. Not rounded.
- **Quoted reviews: 22.**
  - 25 reviews on Google have text.
  - 3 are left out, each for a stated reason:
    - one is about an airport, posted on this listing by mistake
    - one is unrelated ("Marshall aid")
    - one was written in Italian, and Google shows only a machine translation
  - The other 47 of the 72 are star-only. They count in the rating, and no text was invented for them.
- **Every review with text is used, including the critical 1- and 2-star ones.** No selection for praise.
- **Quoting:**
  - first name and last initial, exactly as shown on Google (for example "RAHUL G.", "gurvinder k.")
  - star rating
  - "Google review"
  - month and year: Google gives only relative dates, so reviews it shows as "N years ago" carry the year alone
  - text exactly as written, spelling included
- **Shortened with "…" only, no rewording:**
  - Jaya S. (long)
  - Gurveer S. (long)
  - RAHUL G.: one sentence naming a drinks party was cut, because the site has no drinks wording until the owner confirms a licence
- **Design:**
  - **Motion:** a slow marquee of cards, two rows moving in opposite directions on desktop and one row with all 22 on phones.
  - **Pausing:** hover pauses it, and so does a tap on a phone. Under prefers-reduced-motion it becomes a static swipeable row with the duplicate cards removed.
  - **Header:** "4.2 ★ from 72 Google reviews", "Read all reviews on Google", and "Leave a review" (https://g.page/r/CakEoMnNjUF5EBE/review).
- **Accessibility:**
  - The cards are list items in a `<ul>`.
  - The duplicate copy used for the loop is `aria-hidden`.
  - Stars carry an "N out of 5 stars" label.
  - Lighthouse accessibility is 100, including colour contrast.
- **No Review or AggregateRating schema.** It's plain HTML only, and I checked the live page for both.
- **Placement:**
  - Home: all 22 reviews.
  - Parties and Visit: the newest 10, one row.

## Mobile pass (Galaxy S20 / Redmi 360 x 800, Pixel 7, iPhone 13)
`MOBILE-AUDIT.md` now holds the before and after findings. Every rule passes on all three phones and five pages (Home, Menu, Parties, Visit, a guide), measured by `scripts/mobile-checks.cjs`:
- **Hero:**
  - fits one screen, with both buttons above the bottom bar
  - headline is 3 lines
  - neon name on one line
- **Text never on a photo:** no heading or paragraph overlaps an image.
- **No pinned sections on phones:** only the header, bottom bar, menu bar and back-to-top are fixed or sticky.
- **Swipe carousel:** snap scrolling, 1.72 cards per view, with a "Swipe for more" hint.
- **Menu:**
  - sticky search, Veg / Non-veg filter and 14 category chips, all 44 px tall
  - prices 18–20 px bold
  - back-to-top button
- **The bottom bar never covers content:** the footer's last line clears it at the page end.
- **No ghosted double images:** no image is ever partly transparent.
- **Before → after on every phone:**
  - tap targets under 44 px: 13 → 0 (Home), 18 → 0 (Menu), 5–11 → 0 (other pages)
  - text under 14 px: 7–17 → 0

## Gates (final build, live where marked)

| Gate | Result |
|---|---|
| Lighthouse mobile, **live** GitHub Pages | Home 98 / 100 / 100 / 100 (LCP 2.2 s, CLS 0.011) |
| | Menu 100 / 100 / 100 / 100 |
| | Parties 99 / 100 / 100 / 100 |
| | Visit 99 / 100 / 100 / 100 |
| | Birthday guide 100 / 100 / 100 / 100 |
| Phone sweep, **live**, all 61 pages at 360, 390 and 412 px | 0 overflow, 0 console errors |
| Desktop sweep, local build, 1280 and 1440 px | 0 overflow, 0 console errors |
| Menu, **live** | 187 of 187 dishes and every price; 0 mismatches against the Excel |
| Content QA (`qa_content.py`) | PASS |
| Links, name/address/phone, JSON-LD (`qa_check.py`) | PASS |
| Sitemap URLs, **live**, cache-busted | 61 of 61 return 200. One URL gave a one-off GitHub 503, then returned 200 on three retries. |
| Redirects, **live** | /parties/ → /party/, /notes/ → /guides/ |
| Duplicate ids, all pages | 0 |

## Screenshots (captured from the live site)
All are in `report/final/`. The fixed header and bottom bar are hidden in section captures so nothing is stamped over a section.
- **Home, every section, 1440 px:** `SHEET-home-1440.jpg`. Single sections are in `home/*_1440.jpg`: hero, intro, dishes, review band, occasions, evening and film strip, guides, visit, footer.
- **Home, every section, 390 px:** `SHEET-home-390.jpg` and `home/*_390.jpg`.
- **Home first screen with the header and bottom bar:** `first-screen/home-first-screen-360x800.jpg`, `-390x844.jpg` and `-412x915.jpg`.
- **Parties, 390 px:** `SHEET-parties-390.jpg` and `parties-390/*`.
- **Menu, 390 px:** `SHEET-menu-390.jpg` and `menu-390/*` (heading, sticky bar, soups, appetizers, tandoori, main course, breads, dessert, footer note).
- **Visit, 390 px:** `visit-390/*`.
- **Review band, 1440 and 390 px:** `SHEET-review-band.jpg`; single captures are `home/04-rv_1440.jpg` and `home/04-rv_390.jpg`.
