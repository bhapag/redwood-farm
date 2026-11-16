# Red Wood Farm website: 9 AM report (17 Nov 2026)

**Live:** https://bhapag.github.io/redwood-farm/ (same URL as the printed QR codes)
- Pages: / (home), /menu/, /party/ (old link kept; /parties/ redirects to it), /visit/, /notes/ with 4 articles, and a 404 page.
- The old site is backed up on branch `backup/live-2026-11-17`. The source is on branch `source`.

## Lighthouse, mobile, live site
| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Home | 97 | 100 | 100 | 100 | 1.7 s | 0.015 |
| Menu | 99 | 100 | 100 | 100 | 2.0 s | 0.005 |
| Party | 97 | 100 | 100 | 100 | 2.5 s | 0.002 |
| Visit | 98 | 100 | 100 | 100 | 2.3 s | 0.002 |
| Notes | 98 | 100 | 100 | 100 | 1.8 s | 0.001 |
| Note (kitty party) | 100 | 100 | 100 | 100 | 1.5 s | 0.002 |

- Menu and Visit were re-measured after the last fix. Home, Party and Notes are from the run just before it.
- **Frame rate at 4x CPU throttle:**
  - Home holds 60 fps on mobile and desktop (95th-percentile frame 12 ms).
  - Party: 12 ms. Menu: 12 ms after the fix (it was 30 ms).

## Menu check
- Live page vs `RED_Wood_Restaurant_Menu.xlsx`: **187 of 187 items, 0 price mismatches**. The menu is generated from the file by `scripts/build_menu.py`.
- The 33 prices quoted in the articles are also checked against the menu: 0 wrong.
- "Ice Cream with Brownie" keeps the non-veg mark.

## Other checks (all pass)
- All internal links resolve.
- The address and phone are identical, word for word, on every page and in the schema.
- All JSON-LD parses: Restaurant + EventVenue, Menu with 187 priced items, FAQPage, BreadcrumbList, Article.
- The WhatsApp enquiry form opens WhatsApp with occasion, date, time, guests and note prefilled. Tested.
- tel: and maps links work.
- Menu search and veg / non-veg filters work.
- No console errors.
- Reduced-motion mode shows static images, with no scrubbing or pinning.
- Layout checked at 360, 390, 768, 1280 and 1440 px.

## The 3 directions (in `directions/`)
- A, Tunnel Walk (real tunnel photo with the neon name)
- B, Night Ledger (editorial split)
- C, Lantern Field (light arches drawn in code)

**Chosen: C into A, with B's type.** You scroll to walk through code-drawn light arches. They dissolve into the real tunnel photo, and the neon name lights up with one flicker. It tells the brand's "walk down the tunnel" story and lands on the real place.

Type: Bodoni Moda + Schibsted Grotesk, picked from 3 rendered pairings, with Yellowtail for the neon name only.

## AI vs real, by section
| Section | Imagery |
|---|---|
| Home hero | Light arches drawn in code, then the REAL tunnel photo (on desktop, a slow loop made from that photo) |
| Home story | Chapter 1: Higgsfield tandoor image (AI). Chapter 2: REAL lawn photo as a looping video. Chapter 3: REAL birthday set-up |
| "What to order first" strip and menu photos | Higgsfield dish photos (AI), made earlier for the printed menu |
| Evening, lawn, visit, party types, party gallery | REAL venue photos, colour-graded only |
| Share images | REAL or Higgsfield photo plus type |

- **No new Higgsfield generations:** the account has 0.62 credits and no unlimited allowance, and I don't buy without approval.
- HIGGSFIELD-PLAN.md lists the exact jobs to run if credits are added.

## Motion built
- Lenis smooth scroll on the GSAP ticker (one animation loop).
- Scroll-scrubbed tunnel walk.
- Pinned story with text crossfading over the media.
- Masked line-by-line headline reveals.
- Clip-path image reveals and parallax.
- Horizontal dish strip on desktop, swipe on mobile.
- Stacked sticky party cards.
- Desktop only: custom cursor with a dish preview on hover, magnetic buttons, skew that follows scroll speed.
- Review marquee.
- Smooth page transitions using the browser's built-in View Transitions.
- Recordings: `report/home-scroll-desktop.mp4` and `report/home-scroll-mobile.mp4` (28 s each).

## Open owner list
1. Guest capacity.
2. Per-plate prices and party packages.
3. Pool parties: still offered? Not advertised anywhere.
4. Payment modes.
5. Parking: yes or no. Not mentioned until confirmed.
6. Brownie: eggless? If yes, switch to the veg mark.
7. Real food photos shot at the restaurant, to replace the AI dish photos over time.
8. Higgsfield credits, if you want the upgrades in HIGGSFIELD-PLAN.md.
9. A domain. The steps after buying it are in SEO-NEXT.md.

## Files (C:\Users\harmy\Downloads\Redwood-Farm\website\)
- DECISIONS.md, RESEARCH-UI.md (17 sites, 102 screenshots in research/shots), HIGGSFIELD-PLAN.md, SEO-NEXT.md, directions/, report/.
- Source: `C:\Users\harmy\redwood-site\site` (and branch `source` on GitHub).

Not done: nothing was submitted to Google or Bing; the Google Business Profile was not touched.
