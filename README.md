# Red Wood Farm website (source)

Astro static site. Built locally and pushed to `main`, which GitHub Pages serves at https://bhapag.github.io/redwood-farm/.

- `npm run menu`: regenerate `src/data/menu.json` from the owner's Excel menu (stops on any price mismatch).
- `npx astro build`: build to `dist/`.
- `python scripts/qa_check.py`: checks the built site (menu prices vs Excel, note prices, links, NAP, JSON-LD).
- Custom domain later: change `SITE` and `BASE` in `astro.config.mjs`.

Docs: `docs/` (DECISIONS, RESEARCH-UI, HIGGSFIELD-PLAN, SEO-NEXT).
