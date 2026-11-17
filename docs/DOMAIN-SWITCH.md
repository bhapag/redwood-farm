# DOMAIN-SWITCH: moving the live site to https://redwoodfarm.in

> **DONE on 18 Nov 2026 (morning), Route A.** The site is live on https://redwoodfarm.in and the GitHub Pages copy redirects to it. Current state is in DEPLOY.md. The steps below are kept as the record.

Written 18 Nov 2026 (night). The domain is **pending by the owner's decision**. The live, indexed site stays at **https://bhapag.github.io/redwood-farm/**, because the printed QR codes point there. This file is everything needed to switch later, without Claude.

## Where things stand now
- **Domain:** `redwoodfarm.in` at GoDaddy (owner's account). Registered 17 Nov 2026, expires 17 Nov 2027. The .IN KYC is done.
- **Nameservers: already Cloudflare.** `dexter.ns.cloudflare.com` and `harleigh.ns.cloudflare.com` were set on 18 Nov at about 01:45 IST, while acting on the owner's earlier launch message, before the "domain pending" message arrived. Nothing at GoDaddy was changed after that.
- **Cloudflare** (account hbagga52@gmail.com, owner-approved for Red Wood Farm hosting):
  - zone `redwoodfarm.in` is Active on the Free plan
  - SSL is Full (strict), with Always Use HTTPS
  - a redirect rule sends www to the apex with a 301
  - the Pages project `redwood-farm` has the custom domains `redwoodfarm.in` and `www.redwoodfarm.in`
- **What the domain serves today:** a mirror of the site that sends `X-Robots-Tag: noindex` (from `public/_headers`) and has canonical URLs pointing at GitHub Pages. Search engines therefore keep indexing only the GitHub Pages address.
- **Search Console (redwoodfarm7@gmail.com):**
  - Domain property `redwoodfarm.in`: verified by a TXT record in Cloudflare DNS
  - URL-prefix property `https://bhapag.github.io/redwood-farm/`: verified by the HTML file `public/googlece72478a4790fdde.html` (never delete it)
- **The one config value:** `SITE_URL` in `site.config.mjs`. It drives:
  - canonical URLs
  - `sitemap.xml` and its image entries
  - `robots.txt`
  - `llms.txt` and `llms-full.txt`
  - Open Graph and Twitter URLs
  - every schema `url` and `@id`
  - the base path

## Route A (recommended): serve the domain from Cloudflare Pages (already wired)
1. In `site.config.mjs`, set `export const SITE_URL = 'https://redwoodfarm.in';`.
2. In `public/_headers`, delete the two blocks under "Domain pending" (the `https://redwoodfarm.in/*` and `https://www.redwoodfarm.in/*` noindex lines). Keep the `*.pages.dev` noindex blocks.
3. Build and check: `npx astro build`, then `python scripts/qa_check.py`, `python scripts/qa_content.py` and `python scripts/seo_audit.py dist`. All must pass.
4. Commit and push `main` (`bhapag/redwood-farm`). Cloudflare builds within a few minutes through the deploy hook.
5. Check the domain:
   - `curl -sI https://redwoodfarm.in/` returns 200 with no `x-robots-tag`
   - the canonical on the domain is `https://redwoodfarm.in/`
   - `curl -sI https://www.redwoodfarm.in/menu/` returns 301 to `https://redwoodfarm.in/menu/`
   - all sitemap URLs return 200
6. **QR codes:** run `bash scripts/deploy-gh-redirect.sh`. It turns `bhapag.github.io/redwood-farm/*` into pages that forward to the same path on the domain (meta refresh, JavaScript that keeps the query and hash, rel=canonical, 404 catch-all). Then run `node scripts/qr-test.cjs` and open `/`, `/party/` and `/menu/` on the QR address. Each must land on the same path on redwoodfarm.in.
7. **Search Console:**
   - In the `redwoodfarm.in` Domain property, submit `https://redwoodfarm.in/sitemap.xml`.
   - Use URL Inspection, then Request indexing, for Home, Menu, Parties, Visit, FAQ and the top guides.
   - The Change of Address tool does not work from a GitHub Pages sub-path property, so the redirects in step 6 carry the move.
8. **IndexNow:** run `python scripts/indexnow.py` (it reads `SITE_URL`). Note that the key file `public/<key>.txt` must be live on the domain first.
9. **Cloudflare:** turn on HSTS in SSL/TLS, Edge Certificates (6 months, include subdomains, no preload yet).
10. **Google Business Profile** (redwoodfarm7): only once the profile is verified, set the website to `https://redwoodfarm.in`.
11. **Bing Webmaster Tools:** add the site as redwoodfarm7 (import from Search Console) and submit the sitemap.

## Route B: serve the domain from GitHub Pages instead
Use this route only if Cloudflare is dropped. Start with the DNS records:

**DNS records** (in Cloudflare DNS while the nameservers are Cloudflare; set proxy to "DNS only", the grey cloud):

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | bhapag.github.io |
| TXT | @ | google-site-verification (keep the existing record) |

**If the nameservers are reverted to GoDaddy's defaults** (GoDaddy, DNS, Nameservers, "GoDaddy Nameservers"), add the same records in GoDaddy DNS instead:
- replace the "Parked" A record on @ with the four A records above
- set CNAME `www` to `bhapag.github.io`
- leave `_dmarc` and `_domainconnect` alone
- re-add the Search Console TXT record (exact value: Search Console, Settings, Ownership verification)

Then:
1. Cloudflare Pages project `redwood-farm`, Custom domains: remove `redwoodfarm.in` and `www.redwoodfarm.in`.
2. Repo `bhapag/redwood-farm`, Settings, Pages, Custom domain: `redwoodfarm.in`. Save, wait for the DNS check, then tick **Enforce HTTPS**.
3. Add `public/CNAME` containing `redwoodfarm.in`. Set `SITE_URL = 'https://redwoodfarm.in'` (the base becomes `/`).
4. Run `bash scripts/deploy-gh.sh "Move to redwoodfarm.in"`. GitHub then redirects `bhapag.github.io/redwood-farm/*` to `redwoodfarm.in/*` by itself, which keeps the QR codes working.
5. Do steps 5 and 7 to 11 of Route A.

## Things not to do
- Don't run `deploy-gh-redirect.sh` before the domain serves the real site. The QR codes would forward to a site that is not ready.
- Don't delete `public/googlece72478a4790fdde.html` or the Search Console TXT record. Search Console would lose verification.
- Don't use any Samrat, harmyysingh654 or websitecraftroom account for Red Wood Farm. Use redwoodfarm7@gmail.com only.
