# Mobile audit: before the redesign (17 Nov 2026)

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
