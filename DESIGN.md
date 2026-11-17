---
name: Red Wood Farm
description: Garden family restaurant and party lawn; the real light tunnel and neon name on night, then a calm ivory page broken by green and night events.
colors:
  ivory-paper: "#f7f4ec"
  ivory-paper-deep: "#ece6d6"
  ink: "#16150f"
  ink-mute: "#57564d"
  lawn-green: "#1d3a2b"
  lawn-green-deep: "#13281d"
  green-mist: "#c9d8cd"
  night: "#0b0f0c"
  night-raised: "#141a16"
  cream-mute: "#c8c4b6"
  lamp-gold: "#f2cf83"
  redwood: "#8b2e22"
  redwood-bright: "#a8402c"
  veg-green: "#2f8a3c"
  veg-green-on-dark: "#5cc46a"
  nonveg-on-dark: "#e0795c"
  neon-white: "#effff5"
typography:
  hero:
    fontFamily: "Gloock, 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(2.1rem, 1.2rem + 4.2vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.012em"
  display:
    fontFamily: "Gloock, 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(2.2rem, 1.5rem + 3.4vw, 4.8rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Gloock, 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(1.9rem, 1.4rem + 2.2vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Gloock, 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(1.4rem, 1.2rem + 0.9vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.04
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
    letterSpacing: "0.01em"
  price:
    fontFamily: "'Hanken Grotesk Variable', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "tnum"
  neon-name:
    fontFamily: "Yellowtail, cursive"
    fontSize: "clamp(3rem, 13vw, 6.6rem)"
    fontWeight: 400
    lineHeight: 1.05
rounded:
  mark: "2px"
  frame: "6px"
  field: "8px"
  card: "10px"
  pill: "999px"
spacing:
  gutter: "clamp(18px, 4.5vw, 64px)"
  max: "1320px"
  section: "clamp(64px, 10vw, 140px)"
  header: "64px"
  actionbar: "64px"
  tap-min: "44px"
components:
  button-solid-paper:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "50px"
  button-solid-dark:
    backgroundColor: "{colors.ivory-paper}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "50px"
  button-book:
    backgroundColor: "{colors.redwood}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "50px"
  button-book-hover:
    backgroundColor: "{colors.redwood-bright}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "50px"
  chip-category-active:
    backgroundColor: "{colors.lawn-green}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  input-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 14px"
    height: "50px"
  input-search:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "48px"
  card-info:
    backgroundColor: "{colors.lawn-green}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.card}"
    padding: "clamp(22px, 3vw, 36px)"
  actionbar:
    backgroundColor: "{colors.night}"
    textColor: "{colors.ivory-paper}"
    height: "64px"
  menu-sheet:
    backgroundColor: "{colors.lawn-green-deep}"
    textColor: "{colors.ivory-paper}"
  back-to-top:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "0 18px 0 14px"
    height: "48px"
---

# Design System: Red Wood Farm

## Overview

**Creative North Star: "The Lit Lawn"**

The site opens the way the venue does after dark: solid night, the green neon name, the real fairy-light tunnel. Then it settles into a calm ivory page, and the evening returns in bands of deep lawn green and night. Each section picks one of three tones and sets every colour inside it from that tone, so a component works anywhere without its own dark-mode logic.

Density is editorial and phone first. Big Gloock headlines and short Hanken Grotesk paragraphs, thin 1 px rules instead of boxes, real photos in lightly rounded frames, and pill buttons. Every section on a page uses a different composition. The venue photos are the proof, so they are only shown at sizes where they hold up, and text never sits on top of them.

**Key Characteristics:**
- Three section tones (paper, night, green) that set colour through local custom properties.
- Gloock serif at 400 for every headline; Hanken Grotesk 400 to 700 for UI; Yellowtail only for the neon name.
- Thin rules (1 px at 14 to 20% of the text colour) divide lists, FAQs and fact tables.
- Pill buttons, 6 px photo frames, 10 px cards.
- WhatsApp, Call, Directions and Menu are always one tap away on phones.

## Colors

A warm ivory page, near-black ink, and a deep lawn green and night that carry the evening. Gold and redwood are the two accents, and each has one job.

### Primary
- **Redwood** (redwood): booking only. Filled "Book on WhatsApp" buttons, the WhatsApp cell of the action bar, and the paper tone's link underline and accent. Hovers to **Redwood Bright** (redwood-bright).

### Secondary
- **Lawn Green** (lawn-green): the green tone's ground, the active menu category chip and the scrollbar thumb. **Lawn Green Deep** (lawn-green-deep) grounds the footer and the phone menu sheet. **Green Mist** (green-mist) is muted text on green.

### Tertiary
- **Lamp Gold** (lamp-gold): the accent on night and green only. It colours prices, link underlines, nav underlines, step numbers, the rating figure and text selection.

### Neutral
- **Ivory Paper** (ivory-paper): the page ground, and also the text colour on night and green (as cream). **Ivory Paper Deep** (ivory-paper-deep) fills empty photo frames on paper.
- **Ink** (ink): body text and solid buttons on paper. **Ink Mute** (ink-mute) is secondary text on paper.
- **Night** (night): the hero, the night tone, the solid header and the action bar. **Night Raised** (night-raised) fills empty frames on dark tones. **Cream Mute** (cream-mute) is muted text on night.
- **Veg marks**: veg green (veg-green) on paper and veg-green-on-dark on dark; non-veg uses redwood-bright on paper and nonveg-on-dark on dark. The bright veg green is also the "open now" dot.

### Named Rules
**The Gold After Dark Rule.** Gold appears only on night or green. On paper, the same accent role is redwood.

**The Redwood Means Book Rule.** A filled redwood button always starts a booking (WhatsApp). Other actions use the tone's solid or ghost button.

**The One Tone Rule.** Every section carries exactly one of `.tone-paper`, `.tone-night` or `.tone-green`, which sets `--bg`, `--fg`, `--mute`, `--line`, `--accent`, `--price`, `--btn-bg` and `--btn-fg`. Components read those variables and never hard-code a tone.

### Tones and when to use each
- **Paper**: reading. The intro, occasions, guides, party types, gallery, menu body and guide prose.
- **Night**: the venue after dark. The hero, the evening photo and film strip, visit, the party enquiry and FAQ bands.
- **Green**: events and facts. The dish carousel, the quote band, party steps, directions, the hours card, the guide "short answer" and the call-to-action boxes.
- On Home the bands alternate night, paper, green, paper, night, green, paper, night, so no two neighbours share a tone.

## Typography

**Display Font:** Gloock (with Bodoni 72, Georgia)
**Body Font:** Hanken Grotesk Variable (with Segoe UI, system-ui)
**Script:** Yellowtail, for the neon name only

**Character:** a high-contrast display serif set large and plain, beside a friendly grotesk that handles prices, labels and buttons. The script appears once, as the sign.

### Hierarchy
- **Hero** (400, `--t-hero`, 1.04): the Home h1 on phones. On desktop the hero h1 is set to clamp(2.8rem, 1rem + 3.2vw, 4.4rem) to fit the 5fr panel.
- **Display** (400, `--t-1`, 1.04): section h2 on Home, and the page h1 on Menu, Party, Visit and hub pages. Max width 14 to 16ch.
- **Headline** (400, `--t-2`, 1.04): secondary section heads (visit, film strip, spoke lists, menu categories, footer).
- **Title** (400, `--t-3`, 1.04): card and occasion heads, FAQ and guide-prose h2. Smaller serif items (dish names 1.3rem, FAQ questions clamp(1.15rem, 1rem + 0.5vw, 1.45rem), sheet links 1.75rem) sit between title and body.
- **Body** (400, `--t-body`, 1.6): 17 px floor on phones, 18 px max, 65ch measure. The lede runs clamp(1.125rem, 1rem + 0.5vw, 1.375rem) at 42ch.
- **Small** (400, `--t-small`): captions, dish lines, meta.
- **Label** (650, `--t-label`, 1.3): field labels, definition-list terms, the open-now chip, footer column heads. It always names the data next to it; it is never placed above a headline.
- **Price** (700, 1.2 to 1.25rem, tabular figures): every price.

### Named Rules
**The Plain Headline Rule.** Headlines are sentence case, Gloock 400, with no italic, no highlighted or recoloured word, and no eyebrow or numbered label above. `h1 em` renders upright in the inherited colour. A sequence number may sit inline in a step heading (the party steps).

**The One Sign Rule.** Yellowtail with the neon glow appears once, as the name in the Home hero. It is decorative (`aria-hidden`), and the h1 carries the name for screen readers.

## Layout

A single centred column, `min(100% - 2 * gutter, 1320px)`, with a fluid gutter of clamp(18px, 4.5vw, 64px). Sections pad clamp(64px, 10vw, 140px) top and bottom. Everything stacks on phones; the desktop layouts start at 900px.

Asymmetric splits do most of the work:
- **Hero, 5fr / 7fr**: night panel (min 420px) left, the tunnel photo right, at full viewport height. On phones the panel stacks above the photo, which fills the rest of the screen above the action bar (min 30svh). The two CTAs sit side by side in a 1fr 1fr grid.
- **Editorial 7fr / 5fr**: the intro with the hours card, the occasions head, and the evening photo with its copy, aligned to the end.
- **Page heroes**: Party 5fr / 6fr and hubs 1fr / 1fr, copy beside a photo; on phones the photo comes first at 4:3 and the copy follows.
- **FAQ, 4fr / 7fr**: heading left, questions right, on Party, Visit and hubs.
- **Spoke list, 4fr / 8fr**: a sticky heading left, linked rows right.
- **Menu, 1fr / 1.6fr**: category head and a sticky photo left, priced lists right.
- **Guide, 1fr / 300px**: prose plus a sticky sidebar from 1000px.

Grids break symmetry with offsets: the middle occasion drops 72px, even party types drop 64px, and every third film-strip frame is landscape and drops 40px.

**Home section rhythm:** night hero (split) → paper intro (7/5 with green card) → green dish carousel → paper occasions (three portraits, staggered) → night evening (7/5 photo, then film strip) → green quote band → paper guides (four columns) → night visit (1/1 split).

### Named Rules
**The Reach Rule.** Phones keep a 64px night action bar fixed at the bottom (Menu, Call, Directions, WhatsApp), and the body pads for it plus the safe area. Desktop drops the bar and puts "Book on WhatsApp" in the header.

**The 44 Rule.** Every link, chip, button and list row is at least 44px tall. Buttons are 50px, sheet links 58px, list rows 52px.

## Elevation & Depth

The system is flat. Depth comes from tone changes between sections, photo frames and thin rules. Shadows appear only on elements that float over scrolling content.

### Shadow Vocabulary
- **Sticky bar** (`box-shadow: 0 10px 24px -18px rgb(22 21 15 / 0.35)`): the sticky menu search and category bar.
- **Floating pill** (`box-shadow: 0 10px 24px -10px rgb(0 0 0 / 0.5)`): back-to-top.
- **Neon glow** (`text-shadow: 0 0 1px #effff5, 0 0 8px rgb(140 255 184 / 0.75), 0 0 22px rgb(51 224 127 / 0.45)`): the neon name only.

### Named Rules
**The Flat Page Rule.** Cards, frames and sections have no shadow. If something casts a shadow, it floats over the page.

## Shapes

Pills (999px) for every button, chip, search field and the header menu button. Photo frames are 6px, clipped (`overflow: hidden`), with a tone-matched fill while loading. Cards, the enquiry form and call-to-action boxes are 10px. Form fields are 8px. Veg marks are 15px squares at 2px with a dot (veg) or triangle (non-veg). Dividers are 1px rules in `--line`; 1.5px ink or gold underlines mark emphasis (menu group heads, links, nav).

## Components

### Buttons
- **Shape:** pill (999px), 50px tall, 24px side padding, Hanken 650 at 1rem, 19px icon with a 10px gap.
- **Solid:** fills with the tone's `--btn-bg` and `--btn-fg`: ink on paper, cream on night, cream with green text on green.
- **Book (`.red`):** redwood with cream text, hovering to redwood bright. Only for WhatsApp booking.
- **Ghost:** transparent with a 1.5px currentColor border, for the second action.
- **Hover / Active:** lifts 1px on hover and presses 1px on active, over 0.3s on the house ease. Focus is a 2px currentColor outline at a 3px offset.

### Link
Inline-flex, 44px tall, Hanken 650, with a 1.5px underline in the tone accent (redwood on paper, gold on dark). The trailing arrow slides 4px on hover.

### Header and navigation
Fixed, 64px, cream text. Transparent over the hero, then solid night after 40px of scroll; it hides when scrolling down past 500px and returns on scroll up. Desktop nav links are Hanken 550 with a 1.5px gold underline that wipes in from the left on hover and for the current page, plus a book button. Phones show a "Menu" pill instead.

### Menu sheet
A native `<dialog>`, full screen in lawn green deep with a 60% night backdrop; it rises 14px and fades in over 0.35s. Main links are Gloock 1.75rem in 58px rows with rules; secondary links are Hanken 1.0625rem. A two-column WhatsApp and Call row sits at the bottom. The action bar hides while the sheet is open.

### Action bar
Phones only: a 64px night bar with four equal cells (Menu, Call, Directions, WhatsApp), a 22px icon over a 0.875rem label. The WhatsApp cell is filled redwood.

### Cards
- **Hours card:** green tone on paper, 10px, clamp(22px, 3vw, 36px) padding, a definition list split by rules, then two buttons.
- **Short answer and call-to-action boxes:** the same 10px shape in green or night.

### Dish card (signature)
A 4:5 framed food photo, labelled illustrative, that scales to 1.04 on hover. Below it sit the Gloock name (1.3rem), a veg mark with a bold tabular price in `--price`, and a small muted line. On phones the cards form a snap-scrolling row (58vw, max 260px) with a "Swipe for more" hint whose arrow nudges until the first swipe. On desktop they become a five-column grid. The row ends with an ivory "All 187 dishes" card.

### Film strip (signature)
A row of real venue frames on night: 3:4 portraits, with every third frame a 4:3 landscape that drops 40px, each with a caption. It swipes with snap on phones; on desktop it drifts left as the section scrolls past.

### Quote band
On green: one large Gloock quote (clamp(2rem, 1.3rem + 3.6vw, 4.6rem), 22ch) in curly quotes, the reviewer below, then a rule, the gold rating figure with its source and date, and a ghost "Write a review" button. Three shorter quotes (1.35rem) follow in a row of three on desktop.

### FAQ
Native `<details>` between rules. Questions are Gloock clamp(1.15rem, 1rem + 0.5vw, 1.45rem) in 64px rows, with a 16px accent plus that turns 45 degrees when open. Answers are muted.

### Menu list and sticky chips
A sticky paper bar holds a pill search field, Veg and Non-veg toggle pills (pressed state is filled ink), and a horizontally scrolling row of 44px category chips; the active chip is filled green. Each group head is redwood Hanken 700 over a 1.5px ink rule, with Half and Full column headings. Items are rows split by rules: veg mark, name in 600 with a muted description, then 5rem right-aligned tabular prices.

### Back to top
A floating ink pill, 48px, fixed above the action bar (bottom right, 28px on desktop). It fades and rises in once shown.

### Forms
The party enquiry sits on an ivory 10px panel inside the night tone. Labels are Hanken 650; fields are 50px, 8px radius, white, with a 1.5px border at 25% ink, 1.0625rem text, and a 2px ink focus outline. Paired fields sit two across, stacking below 420px. Submitting opens WhatsApp.

### Spoke list
Rows between rules: a Gloock title, a small muted description and an accent arrow. On desktop the title and description sit side by side and the heading is sticky in a 4fr column.

### Motion
- **All devices:** blocks marked for reveal fade up 22px (0.7 to 0.8s, cubic-bezier(0.16, 1, 0.3, 1)) once, via IntersectionObserver. Without JavaScript the content is fully visible. The neon name flickers on once, and the hero photo pushes in slowly to 1.08.
- **Desktop only** (900px+, fine pointer, motion allowed, loaded on idle): Lenis smooth scroll; headlines rise line by line from a mask (expo.out, 1s, 0.07s stagger), skipping any already on screen; 8% parallax inside a clipped frame; the film strip drift.
- **Never:** pinned sections, cross-fading images, or scroll-scrubbed motion on phones. Reduced motion turns every reveal and animation off.

## Do's and Don'ts

### Do:
- **Do** give every section exactly one tone class and let components read `--fg`, `--mute`, `--line`, `--accent` and `--price`.
- **Do** put booking on a redwood pill and send it to WhatsApp; keep WhatsApp, Call and Directions within one tap on phones.
- **Do** keep tap targets at 44px or more and body text at 17px or more on phones.
- **Do** show only real venue photos, in 6px frames, at sizes where they hold up, and label food photos as illustrative.
- **Do** write headlines in sentence case in Gloock 400, and show prices in bold tabular Hanken.
- **Do** give each section on a page its own composition, using the 5/7, 7/5, 4/8 and 4/7 splits and offsets.
- **Do** write in English only, and write the name exactly as "Red Wood Farm".

### Don't:
- **Don't** put an eyebrow, kicker or numbered label above a headline. A sequence number may sit inline in a step heading.
- **Don't** italicise, highlight or recolour a word inside a headline.
- **Don't** place text on a photo, or repeat a dark text-over-photo hero down the page.
- **Don't** use gold on paper.
- **Don't** pin sections or scroll-scrub motion on phones, and don't cross-fade one image over another.
- **Don't** use Yellowtail or the neon glow anywhere except the one neon name.
- **Don't** add shadows to cards, frames or sections.
