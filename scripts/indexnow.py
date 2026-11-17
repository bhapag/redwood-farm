"""Send every sitemap URL to IndexNow (Bing, Yandex and others share it). Run after a deploy on the domain.
Usage: python scripts/indexnow.py   (the address comes from SITE_URL in site.config.mjs)"""
import json, re, sys, urllib.request, pathlib
cfg = (pathlib.Path(__file__).parent.parent / 'site.config.mjs').read_text()
origin = (sys.argv[1] if len(sys.argv) > 1 else re.search(r"export const SITE_URL = '([^']+)'", cfg).group(1)).rstrip('/')
key = (pathlib.Path(__file__).parent / 'indexnow.key').read_text().strip()
sm = urllib.request.urlopen(urllib.request.Request(origin + '/sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})).read().decode()
urls = re.findall(r'<loc>([^<]+)</loc>', sm)
body = json.dumps({'host': origin.split('//')[1].split('/')[0], 'key': key, 'keyLocation': f'{origin}/{key}.txt', 'urlList': urls}).encode()
req = urllib.request.Request('https://api.indexnow.org/indexnow', data=body, headers={'Content-Type': 'application/json; charset=utf-8'})
with urllib.request.urlopen(req) as r:
    print(r.status, len(urls), 'URLs submitted')
