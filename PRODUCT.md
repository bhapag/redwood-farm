# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Families and groups in Ludhiana deciding where to eat, mostly on Android phones (360 to 412 px wide). Typical jobs: check the menu and prices, find the place on Pakhowal Road, and book a table on WhatsApp.
- Party hosts (birthdays, kitty parties, family functions, office lunches) checking whether the lawn suits them and starting an enquiry on WhatsApp.
- Guests who scan the printed QR codes at the venue. They land on the menu or party page.

## Product Purpose
The website of Red Wood Farm, a garden family restaurant and party lawn. Success is a guest who reads the real menu, finds the venue, and taps WhatsApp, Call or Directions.

## Positioning
A real garden lawn with a fairy-light tunnel, string lights and a neon "Red Wood Farm" sign. Tandoor, North Indian and Indo-Chinese food from 10 AM to 11 PM daily, with 187 priced dishes. No other Pakhowal Road venue can show this tunnel and sign.

## Capabilities and Constraints
- Astro static site. One source produces two builds:
  - `/`: Vercel preview now, Cloudflare later
  - `/redwood-farm/`: the GitHub Pages copy that the printed QR codes point to
- 61 indexable pages. The menu comes from the xlsx (187 items).
- Booking is through WhatsApp only. No online payments.
- Unknowns are answered with "ask us on WhatsApp": capacity, packages, pool, parking, payment modes, heaters.

## Brand Commitments
- Name: "Red Wood Farm", exactly.
- English only: no Hindi or Punjabi text.
- Never use:
  - bar or liquor wording
  - fake reviews
  - invented awards or numbers
  - "Images are for representation only"
  - fake people
- The neon name and the light tunnel are the recognisable assets (design/BRAND.md).
- No eyebrow labels and no single highlighted word in a headline.

## Evidence on Hand
- Real venue photos in `src/assets/venue/`.
- Illustrative food photos in `src/assets/food/`, labelled "illustrative".
- 4.2 rating from 72 Google reviews.
- Real review quotes in `src/data/reviews.js`.
- Do not fabricate guest photos, capacity or prices.

## Product Principles
1. Phone first: most guests are on Android, often with mobile data.
2. Real place, real prices: every photo of the venue is the venue.
3. One tap to act: WhatsApp, Call and Directions are always within reach.
4. Fast pages: Lighthouse mobile performance of 90 or above.

## Accessibility & Inclusion
WCAG AA contrast, tap targets of 44 px or more, and a reduced-motion fallback. The venue has no wheelchair access, and the site says so plainly.
