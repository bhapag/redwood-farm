# Mobile audit: before and after the redesign (17 Nov 2026)

The **before** findings are first. The **after** results, measured on the same devices and pages, are in the last section.

## How it was run
- **Tool:** Playwright, `scripts/mobile-shots.cjs`.
- **Devices:**
  - Galaxy S20 / Redmi size: 360 x 800
  - iPhone 13: 390 x 844
  - Pixel 7: 412 x 915
- **Pages:** Home, Menu, Parties, Visit, and one guide (`/party/birthday-party-venues-ludhiana/`).
- **Capture:** each page was scrolled one screen at a time (85% of the viewport), with a screenshot at every stop.
- **Contact sheets:** `report/redesign/before/sheet_<device>_<page>.jpg`.
- **Metrics:** `metrics.json` in the same folder records, for every page and device:
  - sideways overflow
  - tap targets under 44 px
  - text under 14 px
  - console errors

## What already holds
- No sideways overflow on any page or device, and no console errors.
- The bottom action bar (Menu, Call, Directions, WhatsApp) is always visible.
- The menu already has a sticky search bar, Veg / Non-veg filter chips, and horizontal category chips.

## Problems, by page

### Everywhere
1. **Monotone:** every page is about 95% near-black. White and green never carry a section.
2. **Eyebrow labels** above almost every heading ("01 / Family restaurant first", "Signature dishes", "Google reviews", "Visit", "Real set-ups at Red Wood Farm"). They are 12.8 px uppercase red text, which is hard to read and banned by BRAND.md.
3. **Italic-accent headlines:** "What to order *first*", "Everything we cook, *with prices*", "Birthday, kitty and family parties on the *lawn*", "Four messages, *no forms*", "Guides from the *Red Wood Farm* team".
4. **Type:** Bodoni Moda hairlines break up at 360 px on dark photos. The body grotesk is 400/500 only, so labels and buttons have no weight. The meta, labels and action-bar text are 12 to 13.6 px.
5. **Tap targets under 44 px:**
   - header links: Menu 40 px tall, Visit 31 px wide
   - the brand link: 30 px tall
   - "See all" links: 23 px
   - hub links: 33 px
   - breadcrumbs: 22 px
   - menu category chips: 36 px
   - the intro "WhatsApp 096467 13555" link: 20 px
6. **Page end:** body padding keeps the last content clear of the action bar, but the footer's link lists run 20 px apart, which is too tight to tap.
7. **No menu sheet:** on phones the header shows Menu, Parties and Visit only. Guides, About and FAQ can only be reached from the footer.

### Home
8. **Hero:**
   - It opens on an empty drawn arch over a dark field (frame #0). The real tunnel only appears after scrolling 240svh.
   - The neon "Red Wood Farm" sits over the brightest lights and blurs into them (frame #2).
   - The second CTA, "Plan a party", is cut off behind the action bar on 360 x 800 (frame #0).
   - The "Scroll to walk through the lights" hint is 12.5 px.
9. **Intro:** a 1.6 rem serif paragraph runs nine lines and fills more than a screen. On desktop the right half is empty.
10. **Pinned story** (three chapters over one pinned photo):
    - Text sits on busy photos (the tandoor, the string lights, the balloon arch).
    - The photos crossfade, so two images show at once as a ghosted double exposure (frames #4 to #7; on desktop too).
    - Three screens of pinning on a phone feels like being stuck.
11. **Signature dishes:**
    - The heading is followed by a big empty gap before the cards (frame #8).
    - About 1.1 cards per view, with no swipe hint.
    - Prices are 15 px gold on black.
12. **"Walk in through the lights":** the overlapping photo collage crops the palm photo awkwardly. The small fairy-tree photo is 45vw, so it's tiny.
13. **"The lawn by night":** a full-bleed photo that includes the lawn mattress. It looks cheap at full width, and the heading sits on the photo.
14. **Guides block:** a long list of 12 small links, 33 px tap targets, with the "See all" links at 23 px.
15. **Reviews:** a marquee of quotes clipped at both edges ("s, fresh, and full of", "Awsom"). It's unreadable while it moves.
16. **Visit:** a decent split, but there's no map, and the hours are buried.

### Menu
17. **Sticky header stack:** the search bar, filter chips and category chips stack at the top. Under them, the category heading ("Soups") shows through as a ghost (frame #1).
18. **Small text:**
    - dish names: 14.4 px
    - prices: about 14.4 px
    - Half / Full labels: 12.8 px
    - descriptions: 13.6 px
19. **Category chips** are 36 px tall, and the active chip is marked by underline only.
20. **No back-to-top button** on a page of 187 dishes.
21. The intro paragraph pushes the search below the first screen.

### Parties
22. **Hero:** the heading sits on a busy red-curtain photo.
23. **Numbered labels** on cards ("01", "02") and on the steps.
24. **Party guide list:** 17 items, each with a number, a title and a summary, with no grouping. That's 9 screens of the same pattern.
25. **Enquiry form:** good fields, but the inputs are 44 px with 13 px labels, and the native date control looks off-brand.

### Visit and the guide template
26. **Visit:** headings over photos again; route cards are fine.
27. **Guide:**
    - The breadcrumb is 22 px tall.
    - The "In short" box sits on black with a small label.
    - Prose is 16 px with long lines on a dark ground (fine).
    - The related list has small text.
    - It's comfortable to read, but the whole page is dark.

## Jank
- The home hero, the story and the dish strip all pin on phones. The scroll stalls for three screens at a time, and the Lenis smoothing fights touch scrolling.
- The `requestIdleCallback` start means reveals can be late on slow phones, so content appears to pop in.

## Fix direction (applied in the redesign)
- **Layouts:** phones get their own layouts:
  - no pinning and no scroll-scrubbing
  - stacked blocks with simple reveals
  - text never on a busy photo
  - portrait crops
- **Colour:** ivory editorial sections and deep-green sections alternate with night ones.
- **Type:**
  - body 17 px on phones
  - labels in a weighted grotesk at 14 px or more
  - every tap target at 44 px or more
- **Navigation:**
  - a menu sheet
  - the action bar hides while the sheet is open
  - the page end is padded clear of the bar
- **Menu page:**
  - sticky chips at 44 px
  - 17 px dish names and prices
  - a back-to-top button


---

## After: measured on the finished build (17 Nov 2026, evening)

**Devices:** Galaxy S20 / Redmi size (360 x 800), Pixel 7 (412 x 915) and iPhone 13 (390 x 844).
**Pages:** Home, Menu, Parties, Visit and the birthday guide.
**Evidence:**
- `report/redesign/after/sheet_<device>_<page>.jpg`
- `report/redesign/after/metrics.json`
- `report/redesign/mobile-checks.json` (from `scripts/mobile-checks.cjs`)

### The brief's phone rules, checked

| Rule | Result on all 3 phones |
|---|---|
| Hero fits one screen, both CTAs visible above the action bar | Pass. Measured: both CTA boxes sit inside the viewport, above the bar. |
| Headline at most 3 lines, no word left alone on a line | Pass: 3 lines ("A garden family / restaurant and / party lawn"), with a non-breaking space between "restaurant" and "and" |
| Neon "Red Wood Farm" on one line | Pass. It scales with the hero panel width (container units) and is checked from 360 to 2560 px. |
| No pinned or scroll-scrubbed sections on phones | Pass. The only sticky or fixed items are the header, action bar, menu bar and back-to-top. GSAP and Lenis do not load on phones. |
| Text never on a busy photo | Pass. No heading or paragraph box overlaps an image box. |
| Portrait crops | Pass: occasion photos 4:5, visit photo 1:1 |
| Swipe carousel with snap and a hint, at most two cards per view | Pass: x-mandatory snap, 1.72 cards per view, "Swipe for more" hint |
| Menu: sticky search, Veg / Non-veg filter, 14 category chips, large prices, back-to-top | Pass: the bar is sticky, chips and filter buttons are 44 px tall, prices are 18.4–20 px bold, back-to-top is there |
| Menu sheet; the action bar hides while it is open | Pass (native dialog; `html.sheet-open` hides the bar) |
| The action bar never covers content | Pass. At the page end, the footer's last line sits above the bar on every page. |
| No ghosted double images | Pass. No image or video is partly transparent at any scroll position: the pinned crossfade was removed, and reveals are transform-only. |
| Review band | One row on phones holding all 22 quoted reviews. A tap pauses it; under reduced motion it becomes a static swipe row. |

### Before and after numbers

| Page (each phone) | Tap targets under 44 px | Text under 14 px | Overflow | Console errors |
|---|---|---|---|---|
| Home | 13 → **0** | 17 → **0** | none → none | 0 → 0 |
| Menu | 18 → **0** | 10 → **0** | none → none | 0 → 0 |
| Parties | 5–9 → **0** | 12 → **0** | none → none | 0 → 0 |
| Visit | 11 → **0** | 7 → **0** | none → none | 0 → 0 |
| Guide | 6–7 → **0** | 7 → **0** | none → none | 0 → 0 |

### Before-list items, resolved
1–7, Everywhere:
- **1:** ivory, green and night rhythm.
- **2, 3:** eyebrows and italic accents removed.
- **4:** Gloock and Hanken Grotesk, body 17 px, labels 14 px or more.
- **5, 6:** every tap target and footer link at least 44 px.
- **7:** full menu sheet.

8–16, Home:
- **8:** hero rebuilt as above.
- **9:** intro is a split with the hours card.
- **10:** the pinned story is gone.
- **11:** dish carousel with a hint; prices 19 px bold.
- **12:** collage replaced by one large photo with a caption.
- **13:** the mattress photo is dropped.
- **14:** guide links are 52 px rows.
- **15:** the clipped marquee is replaced by the review band (cards, readable, pausable).
- **16:** the visit split keeps the hours visible.

17–21, Menu:
- **17:** opaque sticky bar with a shadow, so headings no longer show through underneath.
- **18:** larger names and prices.
- **19:** 44 px chips; the active chip is filled green.
- **20:** back-to-top button.
- **21:** search is visible on the first screen.

22–25, Parties:
- **22:** hero photo above, text on a solid panel.
- **23:** numbered labels removed; step numbers sit inline in the step heading.
- **24:** guide list as one clean list with arrows.
- **25:** form inputs are 50 px with 15 px labels.

26–27, Visit and guide:
- **26:** Visit heading on paper; the map opens on tap.
- **27:** breadcrumbs 44 px; the "In short" box is a green panel with a real heading; prose on ivory.

**Jank:** nothing pins and nothing smooth-scrolls on phones; reveals are short transform-only moves that never hide content.
