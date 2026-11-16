"""Turn the GitHub Pages copy into a redirect-only site once the custom domain is live.

Usage: python scripts/make_redirect_site.py https://redwoodfarm.in
Reads the page list from dist-gh/ (build it first with deploy-gh.sh) and writes dist-redirect/,
where every page forwards to the same path on the new domain:
  <meta http-equiv="refresh">, a JavaScript redirect that keeps the hash, and rel=canonical.
GitHub Pages cannot send server 301s, so this is the standard fallback.
"""
import pathlib, shutil, sys, html

if len(sys.argv) != 2 or not sys.argv[1].startswith('https://'):
    sys.exit('usage: python scripts/make_redirect_site.py https://your-domain')
origin = sys.argv[1].rstrip('/')
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'dist-gh'
out = root / 'dist-redirect'
if not src.exists():
    sys.exit('dist-gh/ not found: run bash scripts/deploy-gh.sh first (or build with BASE_PATH=/redwood-farm)')
shutil.rmtree(out, ignore_errors=True)
count = 0
for page in src.rglob('index.html'):
    rel = page.parent.relative_to(src).as_posix()
    path = '/' if rel == '.' else f'/{rel}/'
    target = html.escape(origin + path, quote=True)
    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Red Wood Farm has moved</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="{target}">
<meta http-equiv="refresh" content="0; url={target}">
<script>location.replace("{origin}{path}" + location.hash);</script>
</head><body><p>Red Wood Farm has moved to <a href="{target}">{target}</a>.</p></body></html>
'''
    dest = out / ('' if rel == '.' else rel) / 'index.html'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(doc, encoding='utf8')
    count += 1
(out / '404.html').write_text(f'''<!doctype html><meta charset="utf-8"><title>Moved</title>
<script>location.replace("{origin}" + location.pathname.replace(/^\\/redwood-farm/, "") + location.hash);</script>
<p>Red Wood Farm has moved to <a href="{origin}/">{origin}</a>.</p>''', encoding='utf8')
(out / '.nojekyll').write_text('')
print(f'wrote {count} redirect pages to {out}')
print('publish: copy dist-redirect/ over branch gh-pages, commit, push (same steps as scripts/deploy-gh.sh)')
