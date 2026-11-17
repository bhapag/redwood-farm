"""Independent checks on the BUILT site (dist/), not on the generator.

1. Menu: every item and price in dist/menu/index.html vs RED_Wood_Restaurant_Menu.xlsx (row order).
2. Notes: every "Dish ₹N" claim in the articles vs the menu data.
3. Links: every internal href/src resolves to a file in dist/; tel:, wa.me and maps links listed.
4. NAP: the exact address and phone appear on every page.
5. JSON-LD: every block parses as JSON.
Exit code 1 on any failure.
"""
import html, json, pathlib, re, sys, urllib.parse
import openpyxl

import os
DIST = pathlib.Path(os.environ.get("DIST", "dist"))
BASE = os.environ.get("BASE", "")  # "" for the Cloudflare build, "/redwood-farm" for dist-gh
XLSX = "data/RED_Wood_Restaurant_Menu.xlsx"
ADDRESS = "676, VPO Daad, Pakhowal Road, Opp. Cerajot Tiles, near Omaxe Flats, Ludhiana, Punjab 142022"
PHONE = "096467 13555"
fail = 0

def bad(msg):
    global fail
    fail += 1
    print("FAIL:", msg)

# 1. Menu prices
wb = openpyxl.load_workbook(XLSX, data_only=True)
xl = []
for name, half, full in wb.active.iter_rows(min_row=2, values_only=True):
    if name is None or (half is None and full is None):
        continue
    xl.append((str(name).strip(), int(half) if half else None, int(full)))
page = (DIST / "menu/index.html").read_text(encoding="utf8")
items = re.findall(r'<li class="m-item[^"]*"[^>]*data-veg="(v|nv)"[^>]*>(.*?)</li>', page, re.S)
site_items = []
for veg, body in items:
    name = html.unescape(re.sub(r"<small.*?</small>", "", re.search(r'<span class="m-name[^>]*>(.*?)</span>', body, re.S).group(1)))
    name = re.sub(r"<[^>]+>", "", name).strip()
    prices = [int(p) for p in re.findall(r"₹(\d+)", re.sub(r'<span class="sr-only">.*?</span>', "", body))]
    half = prices[0] if len(prices) == 2 else None
    site_items.append((name, veg, half, prices[-1]))
print(f"menu: site {len(site_items)} items, xlsx {len(xl)} items")
if len(site_items) != len(xl):
    bad("menu item count differs")
mism = 0
for (sn, veg, sh, sf), (xn, xh, xf) in zip(site_items, xl):
    if (sh, sf) != (xh, xf):
        mism += 1
        bad(f"price: {sn} site {sh}/{sf} vs xlsx {xn} {xh}/{xf}")
print(f"menu: {mism} price mismatches")
brownie = [i for i in site_items if i[0] == "Ice Cream with Brownie"]
if not brownie or brownie[0][1] != "nv":
    bad("Ice Cream with Brownie must keep the non-veg mark")

# 2. Prices inside content pages are checked by scripts/qa_content.py (handles order totals).

# 3. Links, 4. NAP, 5. JSON-LD
external = set()
for f in DIST.rglob("*.html"):
    if f.name.startswith("google") and len(f.read_bytes()) < 200:
        continue  # Search Console verification file, not a page
    t = f.read_text(encoding="utf8")
    rel = f.relative_to(DIST).as_posix()
    if f.name != "404.html" and "http-equiv=\"refresh\"" not in t:
        if ADDRESS not in html.unescape(t):
            bad(f"{rel}: address missing or different")
        if PHONE not in t:
            bad(f"{rel}: phone missing")
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S):
        try:
            json.loads(block)
        except Exception as e:
            bad(f"{rel}: JSON-LD does not parse ({e})")
    for url in re.findall(r'(?:href|src|srcset|poster|data-src|data-poster)="([^"]+)"', t):
        for u in [x.strip().split(" ")[0] for x in url.split(",")]:
            if u.startswith(("http", "tel:", "mailto:")):
                external.add(u.split("?")[0] if "wa.me" not in u else u)
                continue
            if u.startswith("#") or not u:
                continue
            if u.startswith("../"):
                u = urllib.parse.urljoin("/" + rel, u)
                if not u.startswith(BASE):
                    u = BASE + u
            if not u.startswith(BASE):
                bad(f"{rel}: link outside base: {u}")
                continue
            p = DIST / urllib.parse.unquote(u[len(BASE):].lstrip("/").split("#")[0])
            if p.is_dir():
                p = p / "index.html"
            if not p.exists():
                bad(f"{rel}: broken link {u}")
print("external links:")
for u in sorted(external):
    print("  ", urllib.parse.unquote(u)[:140])
print("RESULT:", "PASS" if not fail else f"{fail} failures")
sys.exit(1 if fail else 0)
