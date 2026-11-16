# WRITING BRIEF: Red Wood Farm content pages

Read first: `docs/FACTS.md` (the only allowed facts), `src/data/menu.json` (dishes and exact prices), `docs/CONTENT-MAP.md` (your page's query and the PAA questions), `research/routes.json` and `research/nearby.json` (place pages).

## File format
One Markdown file per page at `src/content/pages/<cluster>/<slug>.md`. Cluster is one of: party, food, garden, visit, guides. The URL becomes `/<cluster>/<slug>/`.

```yaml
---
title: "H1 text that matches the search intent"
seoTitle: "Title tag, 50 to 60 characters, query near the front | Red Wood Farm"
description: "Meta description, 140 to 160 characters, answers the query, no keyword stuffing."
cluster: party
query: "the target query from CONTENT-MAP"
summary: "In short: 2 to 3 plain sentences that answer the question on their own (AI answer engines quote this)."
updated: 2026-11-17
images:
  - src: venue/birthday-arch.jpg
    alt: "Specific description of what the photo shows"
faq:
  - q: "A real question people ask (use the PAA list where it fits)"
    a: "A direct 1 to 3 sentence answer using only FACTS."
related:
  - /party/
  - /menu/
---
```

### Allowed image keys
- **Real venue photos:** venue/birthday-arch.jpg, birthday.jpg, blossom-path.jpg, buffet-lawn.jpg, canopy.jpg, day-long-tables.jpg, day-lounge.jpg, entrance-arch.jpg, event-gate.jpg, fairy-tree.jpg, family-function.jpg (mehndi stage), function-night.jpg, garden-path-day.jpg, garden-path-night.jpg, lawn-seating.jpg, lawn-tables.jpg, name-arch.jpg, palm-table.jpg, palms-dusk.jpg, party-setup.jpg, string-lounge.jpg, string-wide.jpg, tent-dining.jpg, tunnel.jpg
- **AI dish photos, for food only:** food/butter_chicken.jpg, dal_makhni.jpg, hakka_noodles.jpg, kadhai_paneer.jpg, mutton_rogan_josh.jpg, naan.jpg, nonveg_biryani.jpg, nonveg_platter.jpg, paneer-grill.jpg, paneer_jalebi_rabri.jpg, paneer_tikka.jpg, seekh-kebab.jpg, tandoor-glow.jpg, tandoori_chicken.jpg, veg_sizzler.jpg
- Use 1 to 3 per page. Never describe a food photo as taken at the restaurant.

## Body rules
1. **Length:** 700 to 1,400 words of body (frontmatter not counted).
2. **The first paragraph answers the query in 40 to 60 words.** No intro fluff, no "Are you looking for...".
3. **Use H2s that mirror real questions;** H3 only where needed. No H1 in the body (the title is the H1).
4. **Specific to Ludhiana and Punjab, and specific to Red Wood Farm where relevant:** real dishes with exact ₹ prices from menu.json, real roads and distances, real features from FACTS.
5. **Never invent anything:** prices beyond the menu, capacity, packages, offers, awards, ratings, guest numbers, dishes not on the menu, or services not in FACTS. For unknowns: "ask us on WhatsApp (096467 13555)".
6. **3 to 6 internal links** in the body as relative Markdown links from the page URL `/<cluster>/<slug>/`. Use `../../menu/`, `../../party/`, `../` (this hub), `../other-slug/` (same cluster), `../../food/tandoor-guide/` and so on. **Only link to URLs that exist in CONTENT-MAP.**
7. **Close with a short practical section** pointing to WhatsApp booking or Visit.
8. **Writing style (strict):**
   - Plain American English; short sentences.
   - Concrete nouns and real numbers; second person where natural.
   - No em dashes. No "not X, but Y". No groups of three adjectives. No rhetorical questions. No "in today's world", "look no further", "nestled", "vibrant", "elevate", "delve", "unforgettable", "hidden gem", "culinary journey", "tantalizing", "whether you're", "perfect for every occasion".
   - No exclamation marks. No emoji.
9. **Every page must read differently from the others.** Don't reuse paragraphs or stock sentences between pages: the duplicate test fails any shared run of 25 or more words. Vary the openings. Repeat the NAP facts only where needed, worded freshly.
10. **English only.** Festival and dish names stay as they are.
11. **FAQ:** 3 to 5 questions per page, different from the body H2s, each answered directly.
12. **related:** 3 to 6 site paths (the hub first), for example `/party/`, `/menu/`, `/visit/`, `/party/kitty-party-venues-ludhiana/`.

## Self-check before you finish each file
- Word count is 700 to 1,400.
- Every ₹ price matches menu.json exactly (Half/Full).
- No banned words; none of the NEVER list from FACTS.
- The first paragraph answers the query.
- Every link target exists in CONTENT-MAP.
