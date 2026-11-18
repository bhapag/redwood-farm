---
name: Red Wood Farm
description: Garden family restaurant and party lawn; one warm night world built on the real lit garden, with a single paper surface for priced lists.
colors:
  night: "#090c0a"
  night-raised: "#0e1411"
  forest: "#102219"
  forest-raised: "#17301f"
  fairy-gold: "#e8c27c"
  fairy-gold-light: "#f4d9a6"
  ivory: "#f2ebdc"
  ivory-mute: "#bdb6a5"
  menu-paper: "#efe6d3"
  menu-paper-deep: "#e3d8c1"
  paper-ink: "#1b1813"
  paper-mute: "#5c5446"
  paper-accent: "#8b5a14"
  veg-on-paper: "#2f8a3c"
  nonveg-on-paper: "#a8402c"
  veg-on-night: "#5cc46a"
  nonveg-on-night: "#e0795c"
  neon-white: "#fff8ea"
typography:
  display:
    fontFamily: "'Gilda Display', 'Didot', 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(2.35rem, 1.5rem + 3.9vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Gilda Display', 'Didot', 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(2.2rem, 1.5rem + 3.2vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.01em"
  headline-sm:
    fontFamily: "'Gilda Display', 'Didot', 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(1.95rem, 1.45rem + 2.1vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.06
  title:
    fontFamily: "'Gilda Display', 'Didot', 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(1.4rem, 1.2rem + 0.8vw, 1.9rem)"
    fontWeight: 400
    lineHeight: 1.1
  body:
    fontFamily: "'Hanken Grotesk Variable', 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "'Hanken Grotesk Variable', 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Hanken Grotesk Variable', 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "0.02em"
  price:
    fontFamily: "'Hanken Grotesk Variable', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "'tnum'"
  neon-name:
    fontFamily: "'Yellowtail', cursive"
    fontSize: "clamp(2.3rem, 10.5vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 1.05
rounded:
  photo: "4px"
  field: "8px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 5vw, 72px)"
  section: "clamp(60px, 9vw, 128px)"
  max: "1360px"
  head: "64px"
  bar: "64px"
components:
  button-primary:
    backgroundColor: "{colors.fairy-gold}"
    textColor: "{colors.night}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.fairy-gold-light}"
    textColor: "{colors.night}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  button-on-paper:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.menu-paper}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  action-bar:
    backgroundColor: "{colors.night}"
    textColor: "{colors.ivory}"
    height: "64px"
  action-bar-book:
    backgroundColor: "{colors.fairy-gold}"
    textColor: "{colors.night}"
  menu-chip:
    backgroundColor: "#ffffff"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  menu-chip-active:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.menu-paper}"
  menu-category-active:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
  menu-search:
    backgroundColor: "#ffffff"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "48px"
  review-card:
    backgroundColor: "rgb(9 12 10 / 0.35)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.photo}"
    padding: "22px"
  field-night:
    backgroundColor: "rgb(9 12 10 / 0.55)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.field}"
    padding: "10px 14px"
    height: "50px"
---

# Design System: Red Wood Farm

## Overview

**Creative North Star: "Arriving at the Garden at 8 PM"**

The whole site stands on the real lit garden. Every page is night: near-black and deep forest grounds, ivory text, and a single warm light source, the fairy-light gold of the strings and the tunnel. Photographs are not boxed into a light page; they run edge to edge as the ground itself, graded once with the same warm night treatment, and copy sits on the dark end of a readable gradient. The mood is calm, warm and cinematic, never gimmicky.

There is exactly one light surface: menu paper, the colour of a printed menu card, used only where guests read prices. Moving from the night into the paper menu is the one deliberate tonal shift in the system. Type is a quiet high-contrast serif (Gilda Display) for headlines over a plain, sturdy grotesk (Hanken Grotesk) for everything else; the neon script appears once, as the name in the Home hero.

Density is phone-first and generous: big type, 44px+ targets, swipe rows instead of cramped grids on phones, and a fixed action bar so Menu, Call, Directions and Book a table are always one tap away. Motion is slow and soft (fades, a slight rise, gentle parallax inside photos) and is removed entirely under reduced motion. Nothing pins or hijacks the scroll.

**Key Characteristics:**
- One night palette; one paper surface for priced lists only.
- Full-bleed, warm-graded real venue photos with readable gradients.
- Gilda Display headlines, Hanken Grotesk text, Yellowtail neon once.
- Gold pill buttons; ivory ghost pills as the second action.
- Swipe rows on phones, grids on desktop.
- Fixed phone action bar with WhatsApp booking in gold.
- Quiet motion, fully disabled under reduced motion; no pinned sections.

## Colors

A night garden lit by one warm source: forest-black grounds, ivory text, fairy-light gold for every action and price, and one sheet of menu paper.

### Primary
- **Fairy-Light Gold** (`fairy-gold`): the only accent on night. Primary buttons, prices on night, focus rings, text selection, the nav underline, action-bar icons, footer column heads, fact terms, star ratings, accordion plus marks, swipe hints. **Light Gold** (`fairy-gold-light`) is its hover state only.

### Neutral
- **Night** (`night`): the page ground, the solid header, the action bar, and every photo gradient (as `rgb(9 12 10 / a)`).
- **Night Raised** (`night-raised`): the alternate night section tone and the placeholder behind images while they load.
- **Deep Forest** (`forest`): the green night tone for review bands, the footer, the phone menu sheet, the guide "In short" and CTA blocks, the menu footer note, and the active menu category chip.
- **Forest Raised** (`forest-raised`): scrollbar thumb only.
- **Ivory** (`ivory`): all text on night. Over photos it drops to 82 to 86% opacity for sub-copy.
- **Ivory Mute** (`ivory-mute`): secondary text on night (meta, captions, descriptions). On forest the mute warms to `#c3c4b0`.

### Menu paper (the one light surface)
- **Menu Paper** (`menu-paper`) and **Paper Deep** (`menu-paper-deep`): the ground of the priced menu list and its image placeholders.
- **Paper Ink** (`paper-ink`): text, prices and the solid button on paper.
- **Paper Mute** (`paper-mute`): descriptions and half-portion prices.
- **Paper Accent** (`paper-accent`): a darkened gold for subgroup heads on paper, where light gold would fail contrast.
- **Veg / Non-veg marks**: green and red-brown on paper (`veg-on-paper`, `nonveg-on-paper`); brighter versions on night (`veg-on-night`, `nonveg-on-night`). The non-veg mark is a triangle, so meaning never rests on colour alone.

### Named Rules
**The One Light Source Rule.** On night, gold is the only colour that is not black, green or ivory. A second accent hue never enters a night section.

**The One Sheet of Paper Rule.** The light paper tone appears only under a priced list (the menu). Every other section, including guides, parties and visit, stays on night or forest.

## Typography

**Display Font:** Gilda Display (with Didot, Bodoni 72, Georgia)
**Body Font:** Hanken Grotesk Variable (with Segoe UI, system-ui)
**Script Font:** Yellowtail, for the neon name only

**Character:** A refined, slightly theatrical serif at a single weight (400) for every heading, set tight (line-height 1.02 to 1.06, -0.01em), over a plain grotesk that carries menus, prices and buttons at 400 to 700.

### Hierarchy
- **Display** (400, `--t-hero`, 1.02): the Home hero h1 only.
- **Headline** (400, `--t-1`, 1.06): section h2s and inner-page hero h1s, usually capped at 12 to 16ch.
- **Headline Small** (400, `--t-2`): review band, footer, menu category heads, party panel titles.
- **Title** (400, `--t-3`): card and prose subheads; serif accordion and spoke-list rows sit near it (1.2 to 1.55rem).
- **Body** (400, `--t-body`, 1.6): running text, capped at 65ch; ledes at 1.125 to 1.375rem, 44ch.
- **Small** (400, 0.9375rem): captions, meta, dish lines.
- **Label** (650, 0.875rem, +0.02em, sentence case): form labels, fact terms, footer column heads, swipe hints. Never uppercase, never above a heading.
- **Price** (700, 1.15 to 1.25rem, tabular figures): every rupee figure, gold on night and ink on paper.
- **Neon Name** (Yellowtail 400, near-white with a warm three-layer glow): once.

### Named Rules
**The One Neon Rule.** The Yellowtail neon name appears once on the whole site: above the Home hero h1. Over the Home hero the header hides its wordmark, so the name is never set twice in one viewport.

**The Single Weight Serif Rule.** Headings are always Gilda Display 400: never bold, never italic, with no highlighted word inside a headline.

## Layout

A full-width night page with a centred content column of `min(100% - 2 * gutter, 1360px)`; gutters scale from 20px to 72px and section padding from 60px to 128px. One breakpoint does the real work: **900px**. Below it the site is a single column with swipe rows, the fixed 64px action bar and a full-screen menu sheet; from 900px the desktop nav appears, the action bar is removed, and rows become 3 or 4 column grids.

Heroes are full-bleed photos: Home at `100svh` minus the action bar on phones (full `100svh` on desktop); inner pages at 74svh (84svh desktop); the menu at 62 to 70svh; the tunnel band at 78 to 92svh. On phones the copy sits at the bottom on a dark lower gradient; on desktop it moves to the left on a horizontal gradient.

Swipe rows (dishes, party panels, the garden strip, and reviews under reduced motion) use scroll-snap with the gutter as scroll padding, hide the scrollbar, and carry a gold "Swipe for more" hint that fades once the row is used. Split sections are 1fr / 1fr or 7fr / 5fr on desktop and stack on phones.

### Named Rules
**The Ground Not Frame Rule.** Signature venue photos are the section's ground (full-bleed with copy on them), not a picture in a box. Small photos in rows and galleries may be framed, at a 4px corner.

**The Never Pinned Rule.** No section pins, stacks or scroll-jacks. Sticky is allowed only for tools: the menu search and category bar, and side columns on desktop (guide sidebar, menu category photo, spoke-list heading).

## Elevation & Depth

The system is flat. Depth comes from photographs and gradients, not shadows: tone shifts between night, night raised and forest, 1px hairlines in ivory at 8 to 16% opacity, and dark gradient overlays that pull text off the image. Shadows appear only as state or on floating utilities.

### Shadow Vocabulary
- **Gold hover glow** (`box-shadow: 0 10px 26px -14px rgb(232 194 124 / 0.6)`): under a button on hover, removed on press.
- **Menu bar lift** (`box-shadow: 0 10px 24px -18px rgb(22 21 15 / 0.35)`): under the sticky menu toolbar on paper.
- **Floating control** (`box-shadow: 0 10px 24px -10px rgb(0 0 0 / 0.5)`): the menu's back-to-top pill.
- **Neon glow** (`text-shadow: 0 0 1px #fff8ea, 0 0 10px rgb(255 214 150 / 0.55), 0 0 28px rgb(232 194 124 / 0.35)`): the neon name only.

### Named Rules
**The Readable Gradient Rule.** Text never sits on a raw photo. Every full-bleed photo carries a night gradient that reaches 0.85 to 0.97 opacity behind the copy (bottom on phones, left on desktop), plus a light top wash under the header.

## Shapes

Two shapes do almost everything: the pill (999px) for every button, chip, search field, menu toggle and floating control, and a near-square 4px corner for photos, cards and panels. Form fields on night use 8px. Circles appear only for the monogram and the accordion plus mark. Hairlines are 1px; the menu subgroup rule is 1.5px ink.

## Components

### Buttons
Warm, solid and calm: a lit pill, not a slab.
- **Shape:** full pill (999px), 52px tall (44px in the header nav), 26px side padding, Hanken 650 at 1rem, 19px icon with a 10px gap.
- **Primary:** fairy gold with night text. Hover lifts 1px, shifts to light gold and adds the gold glow; press drops 1px and removes it.
- **Ghost:** transparent, ivory text, ivory border at 55%. Hover brightens the border and adds a 6% ivory wash. On paper the border is ink at 40%.
- **On paper:** the primary inverts to paper ink with paper text.
- **Pairing:** gold first (Book a table, Directions, Ask about a party), ghost second (See the menu, Call). On the Home hero the pair sits in a 2-column grid on phones.
- **Text link:** 650 weight, gold underline, and a gold arrow that slides 4px on hover.

### Chips (menu only)
- **Style:** white pill, ink text, 1.5px hairline border, 44px tall.
- **State:** diet toggles fill with ink when pressed; the current category chip fills with deep forest and ivory text.

### Cards / Containers
- **Party panel:** a full-bleed photo card (4px corner, up to 72svh tall on phones), title and line on a bottom gradient, gold WhatsApp button inside. 86vw swipe cards on phones, 3 or 4 across on desktop.
- **Dish card:** 4:5 photo (5:4 on desktop), serif name, veg mark and gold price, one muted line. The photo scales 4% on hover.
- **Review card:** 340px max, 22px padding, translucent night fill with a hairline border, gold stars, the quote in Gilda at 1.0625 to 1.125rem, the name in bold and "Google review, date" in mute.
- **Forest block:** guide "In short", guide CTA and the menu footer note sit on deep forest with a 4px corner.

### Inputs / Fields
- **Night form (party enquiry):** 50px, 8px corner, ivory border at 28% on a 55% night fill, ivory text; focus is a 2px gold outline.
- **Menu search:** a white 48px pill with a 1.5px hairline; focus is a 2px ink outline.

### Navigation
- **Header:** fixed, 64px, transparent over a hero, turning solid night at 94% with a hairline once scrolled; it hides on scroll down. Links are Hanken 500 in ivory at 86%, with a 1px gold underline that wipes in on hover and marks the current page. The nav booking link is a smaller gold pill.
- **Phone menu:** a pill "Menu" button opens a full-screen forest sheet: Gilda links at 1.8rem with gold arrows, smaller utility links, and a two-button footer (gold plus ghost). The action bar hides while the sheet is open.

### Phone Action Bar (signature)
Fixed to the bottom below 900px, 64px plus the safe area, solid night with a hairline. Four cells: Menu, Call and Directions (gold icon over a 0.8125rem label) and a wider gold Book a table cell with the WhatsApp icon. The body pads its bottom so nothing hides under it.

### Review Band (signature)
A slow marquee of real Google quotes (two opposing rows on desktop, one on phones), edge-masked, paused on hover, focus or a tap. Under reduced motion it becomes a static snap row with duplicates removed. Its header shows the rating as a large serif number with a gold star and the date it was checked.

### Veg Marks
A 15px square outline with a dot (veg) or a triangle (non-veg), in the night or paper colour pair, always with an accessible label.

## Do's and Don'ts

### Do:
- **Do** keep every section on night, night raised or deep forest; use menu paper only under a priced list.
- **Do** run signature venue photos full-bleed, graded with the shared warm night grade (`scripts/grade_night.py`), with a readable night gradient behind any copy.
- **Do** use only real venue photos for the venue; food photos are the owner-approved images, graded the same way.
- **Do** make the main action a gold pill and the second an ivory ghost pill; booking goes through WhatsApp.
- **Do** use swipe rows with a "Swipe for more" hint on phones and grids from 900px.
- **Do** keep the phone action bar (Menu, Call, Directions, gold Book a table) on every page below 900px.
- **Do** set every price in Hanken 700 with tabular figures: gold on night, ink on paper.
- **Do** respect `prefers-reduced-motion`: content visible by default, all animation and parallax removed, the review band static.
- **Do** keep tap targets at 44px or more and contrast at WCAG AA.
- **Do** show only exact 4 and 5 star Google quotes in the review band, copied with Google's spelling, alongside the rating and the date it was checked.

### Don't:
- **Don't** set the Yellowtail neon name anywhere except the Home hero.
- **Don't** bring back a light page with alternating ivory, green and night bands; there is one paper surface, for prices.
- **Don't** pin, stack or scroll-jack sections.
- **Don't** add a second accent colour on night.
- **Don't** add eyebrow or kicker labels above headings, or highlight a single word in a headline.
- **Don't** write "Images are for representation only" or any similar line.
- **Don't** use bar or liquor wording, or any Hindi or Punjabi text; the site is English only.
- **Don't** use stock or AI images of the venue, fake people, fake reviews, or invented awards and numbers.
- **Don't** add Review or AggregateRating schema to the review band.
- **Don't** set text directly on a photo without its gradient.
