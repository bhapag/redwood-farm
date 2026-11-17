"""Technical SEO audit of a build (default dist/): canonicals, robots meta, OG/Twitter, schema types and JSON
validity, breadcrumbs, alt text, orphan pages, sitemap coverage. Prints a per-check summary and failures.
Usage: python scripts/seo_audit.py [dist] [origin]
"""
import json, pathlib, re, sys, collections
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
ORIGIN = (sys.argv[2] if len(sys.argv) > 2 else 'https://redwoodfarm.in').rstrip('/')
pages = {}
for f in DIST.rglob('index.html'):
    rel = f.parent.relative_to(DIST).as_posix()
    path = '/' if rel == '.' else f'/{rel}/'
    h = f.read_text(encoding='utf8')
    if 'http-equiv="refresh"' in h and len(h) < 3000:
        continue  # astro redirect stubs
    pages[path] = h
fails = collections.defaultdict(list)
types_seen = collections.Counter()
links = collections.defaultdict(set)
for path, h in pages.items():
    m = re.search(r'<link rel="canonical" href="([^"]+)"', h)
    if not m or m.group(1) != ORIGIN + path: fails['canonical self = domain'].append(path)
    if re.search(r'<meta name="robots" content="[^"]*noindex', h): fails['indexable (no noindex)'].append(path)
    for prop in ('og:title', 'og:description', 'og:image', 'og:url'):
        if f'property="{prop}"' not in h: fails[f'{prop}'].append(path)
    if 'name="twitter:card"' not in h: fails['twitter:card'].append(path)
    og = re.search(r'property="og:image" content="([^"]+)"', h)
    if og and not og.group(1).startswith(ORIGIN): fails['og:image absolute on domain'].append(path)
    for blob in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        try:
            data = json.loads(blob)
        except Exception:
            fails['JSON-LD parses'].append(path); continue
        items = data if isinstance(data, list) else data.get('@graph', [data])
        for it in items:
            t = it.get('@type'); [types_seen.update([x]) for x in (t if isinstance(t, list) else [t])]
    if path != '/' and 'BreadcrumbList' not in h: fails['BreadcrumbList on inner pages'].append(path)
    for img in re.findall(r'<img\b[^>]*>', h):
        if not re.search(r'\salt(="|\s|>)', img): fails['img alt present'].append(path); break
    for href in re.findall(r'href="(/[^"#?]*)', h):
        if not href.endswith('/') and '.' not in href.split('/')[-1]: href += '/'
        links[href].add(path)
    if not re.search(r'<title>[^<]{10,}</title>', h): fails['title'].append(path)
    if not re.search(r'<meta name="description" content="[^"]{50,}"', h): fails['meta description'].append(path)
    if len(re.findall(r'<h1\b', h)) != 1: fails['exactly one h1'].append(path)
orphans = [p for p in pages if p != '/' and not (links.get(p, set()) - {p})]
if orphans: fails['0 orphan pages'] = orphans
sm = (DIST / 'sitemap.xml').read_text(encoding='utf8')
locs = set(re.findall(r'<loc>([^<]+)</loc>', sm))
missing = [p for p in pages if ORIGIN + p not in locs and p not in ('/404/',)]
if missing: fails['every page in sitemap'] = missing
extra = [l for l in locs if not l.startswith(ORIGIN)]
if extra: fails['sitemap domain URLs only'] = extra
checks = ['canonical self = domain', 'indexable (no noindex)', 'og:title', 'og:description', 'og:image', 'og:url', 'og:image absolute on domain',
          'twitter:card', 'JSON-LD parses', 'BreadcrumbList on inner pages', 'img alt present', 'title', 'meta description', 'exactly one h1',
          '0 orphan pages', 'every page in sitemap', 'sitemap domain URLs only']
print(f'pages audited: {len(pages)}; sitemap URLs: {len(locs)}; image entries: {sm.count("<image:image>")}')
for c in checks:
    f = fails.get(c, [])
    print(f"{'PASS' if not f else 'FAIL'}  {c}" + (f'  ({len(f)}: {f[:5]})' if f else ''))
print('schema types:', dict(types_seen))
