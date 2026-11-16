# SEO-NEXT: after the domain is bought

Nothing was submitted to Google or Bing tonight. The Google Business Profile is under verification and was not touched.

## Why the domain matters
On `bhapag.github.io/redwood-farm/`, Google and Bing read `robots.txt` and `llms.txt` only at the domain root (`bhapag.github.io/robots.txt`), which this project doesn't control. The files are built and ready at `/redwood-farm/robots.txt` and `/redwood-farm/llms.txt`; they start working the moment the site moves to its own domain.

## 1. Move to the domain (10 minutes)
1. Buy the domain (Harman's decision; a .in or .com in the restaurant's name).
2. In `astro.config.mjs` change two lines: `SITE = 'https://<domain>'` and `BASE = '/'`.
3. Also update the absolute URLs in `public/robots.txt` and `public/site.webmanifest`.
4. Add `public/CNAME` with the domain, build, and push `dist/` to `main`.
5. In GitHub, go to repo Settings, then Pages, then Custom domain, and enforce HTTPS. Point DNS at GitHub Pages (4 A records plus a CNAME for www).
6. **Keep the old URL working for the printed QR codes:** leave a copy of the site, or a redirect page, on `bhapag.github.io/redwood-farm/` and `/redwood-farm/party/`. GitHub Pages can't send real 301s from a project site, so use a page with `<meta http-equiv="refresh">` and a canonical tag pointing at the new domain.

## 2. Google Search Console
- Add a Domain property (DNS TXT record) signed in as **redwoodfarm7@gmail.com** (never harmyysingh654 or any Samrat account).
- Submit `https://<domain>/sitemap.xml`.
- Request indexing for /, /menu/, /party/, /visit/, /notes/ (the URL inspection tool has a daily quota).

## 3. Bing Webmaster Tools and IndexNow
- Import from Search Console (sign in as redwoodfarm7).
- Generate an IndexNow key, put `<key>.txt` in `public/`, and ping it after each deploy for the changed URLs.

## 4. Google Business Profile (only after it shows Verified)
- Website field: `https://<domain>/`.
- Menu link: `https://<domain>/menu/`. Reservations and booking link: the WhatsApp link.
- Then run Phase B from `GBP-READY.md` as planned.

## 5. Citations
Update the website field everywhere `CITATIONS.csv` lists a listing: Facebook (kept page), Instagram bio link, Justdial, Zomato, Tripadvisor, EazyDiner and the rest. Name, address and phone stay word for word:
> Red Wood Farm, 676, VPO Daad, Pakhowal Road, Opp. Cerajot Tiles, near Omaxe Flats, Ludhiana, Punjab 142022, 096467 13555

## 6. Already built into the site
- One search intent per page:
  - Home: garden family restaurant and party lawn Ludhiana.
  - Menu: menu with prices.
  - Party: birthday and kitty party venue Ludhiana.
  - Visit: restaurant on Pakhowal Road.
  - Notes: kitty party venue, birthday party places, tandoor, open-air restaurant.
- Answer-first opening paragraphs on every page.
- JSON-LD:
  - Restaurant + EventVenue (address, geo pin, hours, servesCuisine, hasMenu, acceptsReservations via WhatsApp, amenities, sameAs).
  - Menu, MenuSection and MenuItem with INR prices for all 187 dishes.
  - FAQPage on Party, Visit and every note.
  - BreadcrumbList, and Article for the notes.
- Per-page titles, meta descriptions, canonical URLs, Open Graph and Twitter cards, and designed share images.
- `sitemap.xml`, plus `robots.txt` allowing GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot and Google-Extended.
- `llms.txt` with the key facts.
- **priceRange is deliberately not set.** Add it once the owner agrees a band (the menu runs from ₹20 to ₹925).

## 7. Owner facts that would unlock more search wins
- Guest capacity and per-plate or package prices: these are what "kitty party halls in Ludhiana with price" and "birthday party places in Ludhiana with price" searches want.
- Parking (yes/no): add it to Visit and the FAQ.
- Payment modes.
- Pool parties: only if still offered. Red Wood Farm already ranks for "pool party in Ludhiana" through its own reel.
- Real food photos shot at the restaurant, to replace the Higgsfield dish photos over time.
- **Analytics:** add GA4 or a privacy-friendly counter once approved. The placeholder comment is in `src/layouts/Base.astro`.
