# DEPLOY: hosting, the domain, and what to do after buying it

## Current state (18 Nov 2026, 03:00 IST): GitHub Pages is live, the domain is pending

**Owner decision (18 Nov, night):** the domain is pending. The live, indexed site is **https://bhapag.github.io/redwood-farm/**, deployed with `bash scripts/deploy-gh.sh "message"`. The printed QR codes (`/`, `/party/`, `/menu/`) serve the site directly. To switch to the domain later, follow **docs/DOMAIN-SWITCH.md**.

- **One config value:** `SITE_URL` in `site.config.mjs` (now the GitHub Pages address). It drives canonicals, the sitemap and image sitemap, robots.txt, llms.txt / llms-full.txt, OG/Twitter, schema and the base path.
- **Search Console (redwoodfarm7):**
  - URL-prefix property `https://bhapag.github.io/redwood-farm/` verified with `public/googlece72478a4790fdde.html`
  - `sitemap.xml` submitted
  - indexing requested for 15 URLs
  - the Domain property `redwoodfarm.in` is verified too (TXT record in Cloudflare)
- **IndexNow:** `python scripts/indexnow.py` sends every sitemap URL (key file `public/<key>.txt`, key in `scripts/indexnow.key`). 63 URLs were accepted on 18 Nov.
- **Bing Webmaster Tools:** not set up. In Chrome, Bing Webmaster is signed in to a different (non-Red Wood) account, and signing in as redwoodfarm7 needs a password prompt. Owner step: open bing.com/webmasters as redwoodfarm7, then Import from Google Search Console, then submit `sitemap.xml`.
- **Google Business Profile:** "Verification required" (checked 18 Nov, 02:30). Nothing was edited.
- **Cloudflare mirror:** redwoodfarm.in and redwood-farm.pages.dev serve the same build with `X-Robots-Tag: noindex` and canonicals pointing at GitHub Pages, so there is no duplicate indexing. Cloudflare builds `main` automatically through the deploy hook and webhook.
- **Vercel:** frozen preview with noindex.

## How to redo the whole setup without Claude (records as of 18 Nov 2026)

### Accounts
| What | Account |
|---|---|
| Code | GitHub `bhapag`, repo `bhapag/redwood-farm` (branch `main` = source, `gh-pages` = QR copy) |
| Hosting + DNS | Cloudflare account hbagga52@gmail.com (owner-approved for Red Wood Farm hosting), Pages project `redwood-farm`, zone `redwoodfarm.in` (Free) |
| Domain registrar | GoDaddy (owner's account), domain `redwoodfarm.in`, registered 17 Nov 2026, expires 17 Nov 2027 |
| Search Console, Bing, Google Business Profile | redwoodfarm7@gmail.com only |

### GoDaddy
- **Nameservers:** custom: `dexter.ns.cloudflare.com`, `harleigh.ns.cloudflare.com` (set 18 Nov 2026, after the .IN KYC cleared).
- **DNSSEC:** off.
- The old GoDaddy DNS records (Parked A, www CNAME, `_domainconnect`, `_dmarc`) no longer matter once Cloudflare is authoritative.

### Cloudflare zone redwoodfarm.in: DNS records
| Type | Name | Content | Proxy | Purpose |
|---|---|---|---|---|
| CNAME | `@` (redwoodfarm.in) | `redwood-farm.pages.dev` | Proxied | Site (added by Pages, Custom domains) |
| CNAME | `www` | `redwood-farm.pages.dev` | Proxied | www, redirected to the apex by the rule below |
| TXT | `@` | `google-site-verification=…` (exact value: Search Console, Settings, Ownership verification; also visible in Cloudflare DNS) | DNS only | Search Console Domain property (redwoodfarm7) |

### Cloudflare zone settings
- SSL/TLS: **Full (strict)**. Edge Certificates: **Always Use HTTPS** on. **HSTS** on once HTTPS works (max-age 6 months, include subdomains, no preload).
- Rules, Redirect Rules: "www to apex 301", request URL `https://www.*`, target `https://${1}`, 301, preserve query string.
- Bot Preference Sync: off (the site's own robots.txt is served).

### Cloudflare Pages project redwood-farm
- Source: GitHub `bhapag/redwood-farm`, production branch `main`.
- Build command `npx astro build`, output `dist`, root `/`.
- Environment variables: `NODE_VERSION=22`. A leftover `PUBLIC_CANONICAL_ORIGIN` variable is ignored by the code (the address comes from `SITE_URL`). Because `SITE_URL` is the GitHub Pages address, this mirror builds with base `/redwood-farm/`, and `public/_redirects` (`/redwood-farm/*` to `/:splat`) makes its links work. It is noindex either way.
- Deploys: the Git link shows "disconnected", so a deploy hook (`github-main-push`, Settings, Builds) is called by a GitHub webhook (repo Settings, Webhooks, push events). To rebuild by hand: Deployments, the latest one, "Retry deployment", or push any commit to `main`.
- Custom domains: `redwoodfarm.in`, `www.redwoodfarm.in`.
- `public/_headers` sends `X-Robots-Tag: noindex` on `*.pages.dev` only. `public/_redirects` holds the real 301s.

### QR codes (GitHub Pages copy)
- `bash scripts/deploy-gh-redirect.sh` publishes `gh-pages` as a redirect site: every path on `https://bhapag.github.io/redwood-farm/` forwards to the same path on `https://redwoodfarm.in` (meta refresh, JavaScript that keeps the query and hash, rel=canonical, 404 catch-all).
- Test: open `https://bhapag.github.io/redwood-farm/`, `/party/` and `/menu/`; each must land on the same path on the domain.

### Everyday changes
1. Edit the source in `site/`, then run `npx astro build`. Then run these checks, which must all pass:
   - `MSYS_NO_PATHCONV=1 DIST=dist BASE=/redwood-farm python scripts/qa_check.py`
   - `python scripts/qa_content.py`
   - `python scripts/seo_audit.py dist`
2. Copy into the repo clone and push `main`. This keeps the source and the Cloudflare mirror up to date.
3. **Publish the live site:** `bash scripts/deploy-gh.sh "message"`. It builds, runs the QA gate and pushes `gh-pages`. Check with `node scripts/qr-test.cjs`.
4. After content changes, run `python scripts/indexnow.py` to ping Bing and the other IndexNow engines.

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
