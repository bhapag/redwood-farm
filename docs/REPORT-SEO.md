# SEO completeness pass (18 Nov 2026)

Built on the domain configuration (`https://redwoodfarm.in`). Checked with `scripts/seo_audit.py` on the build, plus the content gates `qa_content.py` and `qa_check.py` (both PASS).

## Technical checklist

| Item | Result | Notes |
|---|---|---|
| robots.txt allows crawlers, AI crawlers included | PASS | GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended, Applebot-Extended and Bingbot are all allowed. Cloudflare's Bot Preference Sync is off, so our own file is served. |
| XML sitemap + image sitemap | PASS | `/sitemap.xml` has 63 URLs, all on the domain. 77 image entries (the real venue photos on each guide page) use the image sitemap extension in the same file. |
| Canonicals | PASS | All 63 pages are self-canonical on https://redwoodfarm.in. |
| Custom 404 | PASS | `/404.html` (noindex), served by Cloudflare Pages for unknown paths. |
| 301 map for old /notes and /parties URLs | PASS (fixed) | `public/_redirects` now has real 301s for `/parties`, `/notes` and the four old `/notes/...` articles, with and without the trailing slash. Before this, they were meta refreshes only. |
| Breadcrumbs | PASS | BreadcrumbList on all 62 inner pages. |
| Schema | PASS | JSON-LD parses on every page. Types: Restaurant + EventVenue (63), Menu (menu page), FAQPage (60), BreadcrumbList (62), Article (54 guides), CollectionPage (hubs), AboutPage, WebSite. |
| llms.txt + llms-full.txt | PASS (llms-full added) | `/llms.txt` is the short index. `/llms-full.txt` (about 340 KB) adds the key facts, the full priced menu and every guide in full. |
| OG / Twitter images per page | PASS (fixed) | Every page has og:title, og:description, og:image, og:url and twitter:card. 54 guides now have their own 1200x630 card: the page's real photo beside a dark title panel (`scripts/make_og.cjs`). Core pages keep their themed cards. That makes 59 distinct images. |
| Favicon + manifest | PASS (fixed) | favicon.ico, favicon.svg, 48 / 96 / 192 / 512 px PNGs, `<link rel="icon">` on every page, and `site.webmanifest` lists all sizes. All at stable root URLs, none blocked by robots. |
| Core Web Vitals (lab, mobile) | PASS | Live Lighthouse (GitHub Pages copy, same build): Home 97–98, LCP 2.2 s, CLS 0.011; other pages 98–100. Field data appears in Search Console once the domain has traffic. |
| Alt text | PASS | Every image has alt text. Decorative duplicates (the desktop dish stage) use empty `alt` on purpose. |
| 0 orphan pages | PASS | Every page has at least one internal link from another page. |
| IndexNow ready | PASS (added) | The key file is at the site root (`/<key>.txt`). `python scripts/indexnow.py` submits every sitemap URL once the domain is live. |
| Search Console / Bing steps in DEPLOY.md | PASS | Section "Remaining steps after KYC" in `docs/DEPLOY.md`. |
| Indexable on the domain, noindex elsewhere | PASS | No robots noindex on pages. `X-Robots-Tag: noindex` is sent only on `*.pages.dev` (via `_headers`) and `*.vercel.app` (via vercel.json). |

## Demand check and new pages

**How demand was checked:** Google autocomplete (India locale) for 42 seeds with a–l expansions, which returned 1,778 live suggestions. The raw data is in `research/demand-2026-11-18.json`.

"People also ask" boxes were **not** pulled. The only Chrome Google session is a Samrat account, which must not be used for Red Wood Farm, and scraping Google results is against the rules for this project.

**Result:** the existing 52 guides already answer nearly every real query cluster, including:
- kitty venue, themes, games and menu
- birthday places, budget, kids and first birthday
- Lohri, Christmas and New Year
- the open-air, garden, family and Sunday dining queries
- the tandoor, dal makhani, butter chicken and paneer queries
- the Pakhowal Road and route queries

Several suggestions were rejected:

| Rejected suggestions | Why |
|---|---|
| Kitty party theme ideas | Already covered by `kitty-party-themes-and-games` |
| Kitty party lunch menu | Covered inside the kitty venue page |
| Family dinner with price | Covered by the group ordering guide |
| Pool party, engagement / roka, banquet hall for 50 / 100 | Facts we may not state |
| Other businesses (cafes, dhabas, hotels) | Not about Red Wood Farm |

Two intents were genuinely new and are now live in the build:

| New page | Target query | Supporting real queries |
|---|---|---|
| `/garden/date-night-ludhiana/` | date night in ludhiana | date ideas ludhiana, couple friendly restaurants in ludhiana, romantic dinner in ludhiana, birthday celebration places in ludhiana for couples |
| `/party/first-lohri-celebration/` | first lohri celebration ideas | lohri celebration for baby boy, lohri celebration for baby girl, first lohri celebration ideas |

**Total: 63 indexable pages** (54 guides, 5 hubs, menu, party, visit, about, FAQ and Home, minus overlaps with the hubs).

**Stopped before 100, as instructed: demand ran out.** Anything more would be a doorway or near-duplicate page. The next real expansion depends on owner facts, each of which opens real queries:
- capacity (banquet / "for 50 people" queries)
- whether there is an indoor hall
- whether a Lohri fire is allowed
- the decoration options

## GBP plan
`Downloads/Redwood-Farm/GBP-PLAN.md` was refreshed for after verification:
- **Status:** still "Verification required", so nothing was edited.
- **Apply order and categories:** primary Family restaurant, and remove Garden.
- **Description:** new text without "WhatsApp" wording.
- **Posts:** eight dated posts linking to the domain pages (two unconfirmed claims removed from the old drafts).
- **Q&A:** updated answers.
- **Review replies:** all 72 are already drafted in GBP-READY §11.
