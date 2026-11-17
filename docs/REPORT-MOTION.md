# Red Wood Farm: motion pass, mobile first (17 Nov 2026)

**Live:** https://bhapag.github.io/redwood-farm/ (GitHub Pages, the QR address; latest site commit `8d7e9a5`). Content, SEO, menu data and the review band are unchanged.

## Recordings (Pixel 7 emulation, live site)
- `report/motion/home-mobile-30s.mp4`: 30 s of Home, top to bottom. It holds on the hero for the neon shine and fairy lights, swipes two dish cards, and scrolls through the headline word rises, the review band and the party card stack.
- `report/motion/menu-parties-mobile-20s.mp4`: 10 s of Menu, then 10 s of Parties.

## React Bits: what is used where
The components came from the official registry (`https://reactbits.dev/r/<Name>-TS-CSS.json`, the same files the shadcn and jsrepo CLIs fetch). They were committed unmodified in `076d608` with hashes in `src/components/reactbits/MANIFEST.json`. Changes are marked `// RWF:` in the source, and the licence is MIT + Commons Clause.

**Used:**

| Component | Where | How it runs |
|---|---|---|
| **ShinyText** | Hero neon "Red Wood Farm" (Home) | `client:after`: one shine sweep once the page has loaded (2.5 s), over the CSS neon glow and flicker |
| **Particles** | Fairy-light dots drifting up over the tunnel photo (Home hero) | 40 particles on phones, 90 on desktop. Starts after load, pauses when the hero is less than half on screen, and is off under reduced motion |
| **Stack** | Signature dishes on phones: swipe or tap to flip, 9 cards | The front 3 photos load first, the next ones as you swipe. Text sits on a solid panel under each photo |
| **ScrollStack** | Party occasions on Home and the "What we host" cards on Parties | Window scroll, no wheel hijack, no snapping. Hydrates only near the screen |
| **CountUp** | Intro stats: 187 dishes, 13 hours a day, 4.2 from 72 reviews | Counts once in view |
| **ClickSpark** | Hero buttons and the Parties "Send on WhatsApp" button | Sparks on tap; off under reduced motion |
| **Magnet** | "Book on WhatsApp" in the desktop header | Fine pointers only (`client:media`) |

**Desktop only, not React Bits:** the hover image swap on the dish list (in the style of landonorris.com's helmets).

**Tried and dropped:**

| Component | Why |
|---|---|
| **ScrollFloat** (section headlines) | Measured. Its GSAP ScrollTrigger timelines held the Home hero at about 22 fps on a Pixel 7 with 4x CPU slowdown, even with no headline on screen. Replaced by `ScrollWords.astro`: the same word-by-word rise as CSS scroll-driven animations (`animation-timeline: view()`). It runs on the compositor, needs no JavaScript, and is static where unsupported or under reduced motion. |
| **BlurText** (hero headlines) | Its motion library delayed the hero photo's paint (Home LCP 3.1 s, Parties 2.6 s). Replaced by `BlurHeading.astro`: the same word blur-in in CSS. |
| ScrollReveal, BounceCards, CardSwap | Fetched and evaluated, not used. Stack and ScrollStack fit better, and CardSwap needs an icon package. |
| PixelTransition | Not used. Page changes use a brand-green wipe (CSS cross-document view transitions) instead, with no JavaScript. |
| SplashCursor, custom cursors | Not used, as the brief asked. |

**Other motion (CSS, no JavaScript):**
- scroll-driven zoom-in on large photos (evening, visit, film strip, party gallery, menu category photos)
- a soft edge fade on the review band
- the hero photo's slow push-in

**How islands load** (`src/directives/`):

| Directive | When it hydrates | Used for |
|---|---|---|
| `client:after` | 2.5 s after load | Hero shine and lights |
| `client:interact` | One island per idle slot from 3.5 s after load, or near the screen once the visitor scrolls | Sparks, counters, dish stack |
| `client:visible` | When it nears the screen | The party stacks |

- A warm-up parses the motion libraries during idle time before the first scroll.
- Under prefers-reduced-motion everything is static: no particles, no sweeps, no counting, no scroll animation.

## Frame rate (Pixel 7 emulation, CPU slowed 4x, steady scroll; three runs, median, lowest in brackets)

| Home | fps | Parties | fps | Menu | fps |
|---|---|---|---|---|---|
| Hero | 59.9 (59.6) | Hero | 57.5 (57.3) | Heading and search | 59.6 |
| Intro and stats | **54.2 (44.7)** | What we host (stack) | 59.0 (58.0) | Soups | 60.0 |
| Dishes (stack) | 59.9 (59.5) | How booking works | 59.2 (58.8) | Appetizers | 59.9 |
| Review band | 55.5 (53.7) | Enquiry form | 59.1 (58.1) | Tandoori | 59.9 |
| Party stack | 56.9 (54.9) | Gallery | 60.0 | Main course | 59.9 |
| Lawn by night and film strip | 59.3 (56.9) | Review band | 60.0 | Breads | 59.9 |
| Guides | 59.7 (59.3) | Party guides | 60.0 | Dessert | 60.0 |
| Visit | 58.3 (56.6) | Questions | 60.0 | Footer note | 60.0 |
| Footer | 60.0 | Footer | 60.0 | Footer | 59.9 |

- **Every median is at or above 54 fps.** The Home intro dipped to 44.7 in one of three runs, while an island hydrated during that run's first scroll. Its median is 54.2.
- **To get there:**
  - The intro headline is a plain heading with a short slide-in.
  - ScrollFloat was replaced, and the party stack hydrates only near the screen.
  - The hero lights pause when the hero is half off screen.
  - The dish photos load progressively.

## Lighthouse (mobile, live GitHub Pages, after the last deploy)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home (run 1) | 97 | 100 | 100 | 100 | 2.4 s | 0.011 | 40 ms |
| Home (run 2) | 98 | 100 | 100 | 100 | 2.3 s | 0.011 | 10 ms |
| Home (run 3) | 94 | 100 | 100 | 100 | 2.2 s | 0 | 150 ms |
| Menu | 100 | 100 | 100 | 100 | 1.6 s | 0.007 | 0 ms |
| Parties | 99 | 100 | 100 | 100 | 1.8 s | 0 | 0 ms |
| Birthday guide | 100 | 100 | 100 | 100 | 1.6 s | 0 | 30 ms |
| Visit | 98 | 100 | 100 | 100 | 2.4 s | 0 | 50 ms |

Your budget was performance ≥ 85, LCP < 2.5 s and CLS < 0.05: met on every page and every run.

## QA (final build)
- **360 / 390 / 412 / 1440 px sweep:** all 61 pages, 0 overflow, 0 console errors. The 360 px sweep was repeated on the live site with the same result.
- **Phone checks on 3 devices** (Galaxy S20 / Redmi 360 x 800, Pixel 7, iPhone 13), all passing:
  - the hero fits one screen and the neon name is one line
  - no pinned sections (the party stack's sticky slots scroll freely)
  - no text on photos, no half-visible images
  - the bottom bar clears the page end
- **Content:** menu 187 of 187 live, `qa_content` PASS, `qa_check` (links, name/address/phone, JSON-LD) PASS. All 61 sitemap URLs return 200 live, cache-busted, and no page has a duplicate id.

## Higgsfield
- **Balance checked: 0.62 credits** (Lite plan). That's below the cost of any video or upscale job, so step 2 was skipped as your brief allows.
- **Not made:**
  - the hero tunnel image-to-video loop (9:16 and 16:9)
  - the three food loops
  - the venue upscales
- **Instead:** the hero gets its motion from the slow CSS push-in on the real photo, the fairy-light particles and the neon shine. The log is in `HIGGSFIELD-PLAN.md`; the jobs and prompts are ready to run once credits are added.
