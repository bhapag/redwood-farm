# DEPLOY: hosting, the domain, and what to do after buying it

## Launch status: redwoodfarm.in (18 Nov 2026, 00:30 IST)

The owner bought **redwoodfarm.in** at GoDaddy and approved the hbagga52 Cloudflare account for Red Wood Farm hosting.

| Piece | State |
|---|---|
| Source | github.com/bhapag/redwood-farm `main`, clean and pushed. |
| Cloudflare Pages | Project `redwood-farm` (hbagga52 account) builds `main`: `npx astro build`, output `dist`, env `NODE_VERSION=22`, `PUBLIC_CANONICAL_ORIGIN=https://redwoodfarm.in`. Live at https://redwood-farm.pages.dev (sends `X-Robots-Tag: noindex` via `public/_headers`; only the domain is indexable). |
| Auto-deploy | The Pages Git link shows "disconnected", so a **deploy hook** (`github-main-push`) is called by a GitHub webhook on every push to `main` (repo Settings, Webhooks). The hook URL is a secret; it lives only in Cloudflare and GitHub. |
| Cloudflare zone | `redwoodfarm.in` added on the **Free** plan. Status **pending** until the nameservers change. Assigned nameservers: **dexter.ns.cloudflare.com** and **harleigh.ns.cloudflare.com**. Bot Preference Sync is off (our own robots.txt is served). |
| Zone settings done | SSL/TLS **Full (strict)**; **Always Use HTTPS** on; redirect rule **www to apex 301** (preserves path and query). HSTS: turn on in SSL/TLS, Edge Certificates, only after https://redwoodfarm.in loads with a valid certificate. |
| DNS records | TXT `@` google-site-verification (Search Console, redwoodfarm7). The apex and www records are created by Pages when the custom domains are added (needs the zone active). |
| **GoDaddy (blocker)** | The domain is on **Registrar Hold: .IN KYC verification required**. Nameservers cannot be changed until the registrant (Jaspal Singh, +91 74638 81005) verifies with Aadhaar. **Owner action:** GoDaddy, My Domains, redwoodfarm.in, yellow banner, **Validate**, Verify your contact. The details must match the registrant data or it fails. |
| Search Console | Domain property `redwoodfarm.in` added in redwoodfarm7@gmail.com, **not verified yet** (Verify later). It verifies once the zone is active (the TXT record is already in Cloudflare). |
| Bing Webmaster + IndexNow | Waits for Search Console verification (import from Search Console). |
| Google Business Profile | **Verification required** (checked 18 Nov as redwoodfarm7). Per the rules, nothing was edited. After verification, set the website field to https://redwoodfarm.in. |
| GitHub Pages copy (QR codes) | Still the full site until the domain works. Then run `bash scripts/deploy-gh-redirect.sh`: every path on bhapag.github.io/redwood-farm/ forwards to the same path on https://redwoodfarm.in (meta refresh + JavaScript with query and hash + rel=canonical, 404 catch-all). |
| Vercel preview | Frozen with noindex. Delete the `redwood-farm` project in the Sales Leak team once the domain works. |

### Remaining steps after KYC (in order)
1. GoDaddy, redwoodfarm.in, DNS, Nameservers, Change, "I'll use my own nameservers": `dexter.ns.cloudflare.com`, `harleigh.ns.cloudflare.com`. Turn DNSSEC off at GoDaddy if it is on.
2. Cloudflare, redwoodfarm.in Overview, "Check nameservers now". Wait for **Active** (minutes to a few hours).
3. Pages project, Custom domains: add `redwoodfarm.in`, then `www.redwoodfarm.in`. Wait for both to show Active with SSL.
4. Check: `curl -sI https://redwoodfarm.in/` (200, no `x-robots-tag`), `curl -sI https://www.redwoodfarm.in/menu/` (301 to apex), `curl -s https://redwoodfarm.in/sitemap.xml` (domain URLs only).
5. Turn on HSTS (max-age 6 months, include subdomains, no preload yet).
6. `bash scripts/deploy-gh-redirect.sh`, then test the QR paths `/redwood-farm/`, `/redwood-farm/party/`, `/redwood-farm/menu/`.
7. Search Console (redwoodfarm7): Verify the Domain property; submit `https://redwoodfarm.in/sitemap.xml` (it includes the image entries); URL Inspection, Request indexing for Home, Menu, Parties, Visit, FAQ and the top 10 guides; live-test the favicon.
8. Bing Webmaster Tools: import from Search Console; submit the sitemap; send IndexNow for all URLs.
9. Google Business Profile: only if verified, set the website to https://redwoodfarm.in.
10. Delete the Vercel project; remove `vercel.json`.

## Earlier state (17 Nov 2026, kept for history)

| Piece | Where | State |
|---|---|---|
| Source code | github.com/bhapag/redwood-farm, branch `main` | Live. Every change is a commit. |
| Live site (QR codes) | https://bhapag.github.io/redwood-farm/ served from branch `gh-pages` | Live. Built with `bash scripts/deploy-gh.sh "message"` (base `/redwood-farm/`). |
| Vercel (temporary preview) | project "redwood-farm" in the hbagga52-3954 Vercel account, https://redwood-farm.vercel.app | **Frozen** at its last build (redesign, commit 3a48b23). No Git link since GitHub bhapag moved back to the Sales Leak account, so pushes no longer deploy it. Sends `X-Robots-Tag: noindex`. Left in place, not deleted. |
| Cloudflare Pages | project "redwood-farm" at https://redwood-farm.pages.dev | **Not created yet.** See "Cloudflare: why it is not live" below. |
| Old one-page site | branch `backup/live-2026-11-17` | Kept for reference. |

Canonical URLs currently point to the GitHub Pages address, because Cloudflare isn't live yet. One value controls this: `PUBLIC_CANONICAL_ORIGIN` (default in `src/data/urls.js`; set in `scripts/deploy-gh.sh` for the GitHub build).

## Vercel: temporary preview only (frozen since 17 Nov 2026)
- **Deploy to GitHub Pages only for now:** `bash scripts/deploy-gh.sh "message"`. The QR address is the live preview until the domain moves to Cloudflare.
- The Vercel project keeps serving its last build and does not follow `main`. Do not reconnect it to GitHub unless the owner asks.

- **Project:** `redwood-farm` in the Vercel account hbagga52-3954 (the account with the other sites). It is connected to GitHub `bhapag/redwood-farm`, branch `main`. Every push to `main` redeploys it.
- **Settings live in `vercel.json`** at the repo root, not in the Vercel dashboard:
  - Astro preset; build `PUBLIC_CANONICAL_ORIGIN=https://bhapag.github.io/redwood-farm npx astro build`; output `dist`; served at `/` (`BASE_PATH` unset, the same build as Cloudflare).
  - The same security headers and cache rules as `public/_headers`, and the same redirects as `public/_redirects`, as real 301s.
  - **No duplicate indexing:** a header rule sends `X-Robots-Tag: noindex` only when the host matches `*.vercel.app`. Canonical tags point at the GitHub Pages address.
- **GitHub access:** the Vercel GitHub app on bhapag can now see `redwood-farm` (added to its selected repositories alongside crm, salesleak and SamratFRPTraders).
- Vercel is not the final host. Don't add the custom domain here.

## Domain day: leave Vercel, move to Cloudflare Pages + GoDaddy
Do these in order once the domain is bought. Each step is detailed further down.
1. **Cloudflare Pages:** set up the project (section "Cloudflare Pages setup"), then add the domain to Cloudflare.
2. **GoDaddy nameservers:** point the domain at the two Cloudflare nameservers.
3. **Canonical to the domain:** set `PUBLIC_CANONICAL_ORIGIN=https://redwoodfarm.in` in Cloudflare Pages and redeploy. Canonicals, sitemap, robots.txt, llms.txt, Open Graph URLs and schema all follow.
4. **Indexing on:** the domain is served by Cloudflare, so it never gets the Vercel `noindex` header. Check with `curl -sI https://redwoodfarm.in/ | grep -i x-robots`, which should print nothing.
5. **Retire Vercel:** delete `vercel.json` from the repo and delete the Vercel project `redwood-farm` (Project Settings, then Advanced, then Delete). Leave the other Vercel projects alone. Optionally remove `redwood-farm` from the Vercel GitHub app's repository list.
6. **GitHub copy to redirects:** run `python scripts/make_redirect_site.py https://redwoodfarm.in` and push `dist-redirect/` to `gh-pages`. The printed QR codes then forward to the same page on the domain.

## Cloudflare: why it was not live (superseded 18 Nov: the owner approved the hbagga52 account)
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
