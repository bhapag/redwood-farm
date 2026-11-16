# DEPLOY: hosting, the domain, and what to do after buying it

## Current state (17 Nov 2026, 02:15 IST)

| Piece | Where | State |
|---|---|---|
| Source code | github.com/bhapag/redwood-farm, branch `main` | Live. Every change is a commit. |
| Live site (QR codes) | https://bhapag.github.io/redwood-farm/ served from branch `gh-pages` | Live. Built with `bash scripts/deploy-gh.sh "message"` (base `/redwood-farm/`). |
| Cloudflare Pages | project "redwood-farm" at https://redwood-farm.pages.dev | **Not created yet.** See "Cloudflare: why it is not live" below. |
| Old one-page site | branch `backup/live-2026-11-17` | Kept for reference. |

Canonical URLs currently point to the GitHub Pages address, because Cloudflare isn't live yet. One value controls this: `PUBLIC_CANONICAL_ORIGIN` (default in `src/data/urls.js`; set in `scripts/deploy-gh.sh` for the GitHub build).

## Cloudflare: why it is not live
- **Chrome is signed into Cloudflare as hbagga52@gmail.com.** That account also holds the Samrat and other sites. I didn't sign it out, and I didn't use it for Red Wood Farm, because the plan is a separate redwoodfarm7@gmail.com account.
- **The in-app browser** had no Google session, so "Continue with Google" asked for the redwoodfarm7 password. Per the rules, that step stopped there.

## Cloudflare Pages setup (10 minutes, once someone can sign in as redwoodfarm7@gmail.com)
1. **Create the account.** Open https://dash.cloudflare.com/sign-up in a browser signed into Google as redwoodfarm7@gmail.com (for example a separate Chrome profile). Choose "Continue with Google". Free plan.
2. **Start the Pages project.** Go to Workers & Pages, then Create, then Pages, then Connect to Git. Authorise GitHub for the repo `bhapag/redwood-farm` only, then pick the repo.
3. **Build settings:**
   - Project name: `redwood-farm`
   - Production branch: `main`
   - Framework preset: Astro
   - Build command: `npx astro build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION = 22`
   - Leave `BASE_PATH` unset; Cloudflare serves the site at `/`.
4. **Deploy.** Check that https://redwood-farm.pages.dev/ loads. `_headers` (security headers, CSP, long cache on `/_astro/*`) and `_redirects` are already in `public/` and apply automatically.
5. **Point canonical URLs at Cloudflare:** run `CANONICAL=https://redwood-farm.pages.dev bash scripts/deploy-gh.sh "canonical to Cloudflare"`. The Cloudflare build already defaults to that origin.

## Domain check on GoDaddy (17 Nov 2026, 02:10 IST; nothing bought)

| Domain | Available | GoDaddy price shown |
|---|---|---|
| **redwoodfarm.in** | Yes | ₹1 for the 1st year with a 3-year term (₹899/yr list) |
| redwoodfarm.co.in | Yes | ₹1 for the 1st year with a 3-year term (₹749/yr list) |
| redwoodfarmludhiana.com | Yes | ₹1 for the 1st year with a 3-year term (₹1,599/yr list) |
| redwoodfarmludhiana.in | Yes | ₹1 for the 1st year with a 3-year term (₹899/yr list) |
| theredwoodfarm.in | Yes | ₹1 for the 1st year with a 3-year term (₹899/yr list) |
| redwoodfarm.com | **Taken** | Broker service only (₹16,999 fee) |

- **Recommendation: redwoodfarm.in.** It's the exact name with nothing added, and .in reads as Indian and local to guests and to Google. It's also short enough to say over the phone and print on a table tent.
- **Also worth taking:** redwoodfarmludhiana.com later, as a redirect only, so nobody squats it.
- **At checkout:**
  - Check the renewal price for years 2 and 3. The ₹1 offer requires the 3-year term.
  - Skip GoDaddy's add-ons: email, website builder, extra privacy. Cloudflare handles DNS and SSL for free.
- **Account note:** the GoDaddy tab in Chrome showed "Samrat Poly" signed in. Buy the Red Wood Farm domain from a GoDaddy account in Red Wood Farm's name (redwoodfarm7@gmail.com), not the Samrat account.

## After buying the domain (in this order)
1. **Add the site to Cloudflare.** In the redwoodfarm7 Cloudflare account: Add a site, enter `redwoodfarm.in`, choose the Free plan. Cloudflare shows two nameservers (for example `xxx.ns.cloudflare.com`).
2. **Change nameservers in GoDaddy.** Go to My Products, then the domain, then DNS, then Nameservers, then Change, then "I'll use my own nameservers". Paste the two Cloudflare nameservers. Propagation takes minutes to 24 hours; Cloudflare emails when the site is active.
3. **Add the custom domain to Pages.** Open the Pages project `redwood-farm`, then Custom domains, then add `redwoodfarm.in`, then add `www.redwoodfarm.in`. Cloudflare creates the DNS records itself.
4. **Redirect www to the apex.** Go to Rules, then Redirect Rules, then Create:
   - When: hostname equals `www.redwoodfarm.in`
   - Then: dynamic redirect to `concat("https://redwoodfarm.in", http.request.uri.path)`
   - Status 301, keep the query string.
5. **SSL/TLS settings:**
   - Encryption mode **Full (strict)**
   - Always Use HTTPS **on**
   - Automatic HTTPS Rewrites **on**
   - Minimum TLS 1.2
6. **Search Console.** Signed in as redwoodfarm7@gmail.com, add a Domain property `redwoodfarm.in`. Copy the TXT record into Cloudflare DNS (Type TXT, Name `@`), then click Verify. Submit `https://redwoodfarm.in/sitemap.xml`.
7. **Switch every URL to the domain (one value).**
   - Set `PUBLIC_CANONICAL_ORIGIN=https://redwoodfarm.in` in Cloudflare Pages (Settings, Environment variables, Production), or change the default in `src/data/urls.js`.
   - Redeploy.
   - Canonicals, the sitemap, `robots.txt`, `llms.txt`, Open Graph URLs and schema all follow automatically.
8. **Turn the GitHub Pages copy into redirects** (keeps the printed QR codes working).
   - Run `python scripts/make_redirect_site.py https://redwoodfarm.in` to write a redirect-only site to `dist-redirect/`. Every built path becomes a page with a meta refresh, a JavaScript redirect that keeps the path and hash, and a canonical tag pointing at the same path on the domain.
   - Push it to `gh-pages` (the script prints the commands).
   - A guest who scans `bhapag.github.io/redwood-farm/menu/` lands on `redwoodfarm.in/menu/`.
9. **Then the SEO-NEXT.md list:**
   - Google Business Profile website field (only after verification), plus a menu link to `/menu/`
   - Bing Webmaster Tools: import from Search Console
   - IndexNow key file and ping
   - Citations update (CITATIONS.csv) with the new URL

## Everyday changes
- **Edit the source** in `src/`, then commit and push to `main`. Cloudflare rebuilds automatically once connected.
- **Then refresh the GitHub copy:** `bash scripts/deploy-gh.sh "what changed"`.
- **Menu price change:**
  1. Replace `data/RED_Wood_Restaurant_Menu.xlsx`.
  2. Run `python scripts/build_menu.py`, which stops if a row doesn't line up.
  3. Commit and push; the QA script `scripts/qa_check.py` re-checks every price.
