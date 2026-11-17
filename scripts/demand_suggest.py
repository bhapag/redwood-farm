"""Live demand check: Google autocomplete (public suggest endpoint, India locale) for seed topics plus a-z
expansions. Writes research/demand-YYYY-MM-DD.json and prints suggestions not yet covered by a page query.
Usage: python scripts/demand_suggest.py"""
import json, time, urllib.parse, urllib.request, pathlib, re, datetime, string
SEEDS = [
    'kitty party ludhiana', 'kitty party venue', 'kitty party ideas', 'kitty party games', 'kitty party theme',
    'birthday party venue ludhiana', 'birthday party ideas', 'birthday party places in ludhiana', 'first birthday party',
    'party lawn ludhiana', 'party hall ludhiana', 'small party venue ludhiana', 'outdoor dining ludhiana',
    'garden restaurant ludhiana', 'open air restaurant ludhiana', 'restaurant pakhowal road', 'pakhowal road ludhiana',
    'family restaurant ludhiana', 'best restaurant in ludhiana for family', 'dhaba ludhiana', 'tandoori chicken ludhiana',
    'lohri party', 'lohri celebration ideas', 'new year party ludhiana', 'new year eve dinner ludhiana',
    'christmas party ludhiana', 'winter evening ludhiana', 'anniversary dinner ludhiana', 'baby shower venue ludhiana',
    'roka ceremony venue ludhiana', 'engagement venue ludhiana', 'retirement party', 'office party venue ludhiana',
    'pool party ludhiana', 'places to visit in ludhiana', 'date night ludhiana', 'couple friendly restaurant ludhiana',
    'veg restaurant ludhiana', 'chaap ludhiana', 'dal makhani', 'butter chicken ludhiana', 'paneer tikka',
]
covered = set()
for f in pathlib.Path('src/content/pages').rglob('*.md'):
    m = re.search(r'^query:\s*"(.*)"', f.read_text(encoding='utf8'), re.M)
    if m: covered.add(m.group(1).lower())

def suggest(q):
    url = 'https://suggestqueries.google.com/complete/search?' + urllib.parse.urlencode({'client': 'firefox', 'hl': 'en', 'gl': 'in', 'q': q})
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=10) as r:
            return json.loads(r.read().decode('utf-8', 'ignore'))[1]
    except Exception:
        return []

out = {}
for s in SEEDS:
    found = set(suggest(s))
    for ch in string.ascii_lowercase[:12]:  # a-l keeps it polite
        found |= set(suggest(f'{s} {ch}')); time.sleep(0.25)
    out[s] = sorted(found)
    time.sleep(0.4)
day = datetime.date.today().isoformat()
pathlib.Path('research').mkdir(exist_ok=True)
pathlib.Path(f'research/demand-{day}.json').write_text(json.dumps({'covered': sorted(covered), 'suggest': out}, indent=1), encoding='utf8')
total = sum(len(v) for v in out.values())
print('seeds', len(SEEDS), 'suggestions', total, 'covered queries', len(covered))
for s, v in out.items():
    print(f'## {s} ({len(v)})')
    print('  ' + ' | '.join(v[:40]))
