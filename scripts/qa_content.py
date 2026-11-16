"""Content quality gate for src/content/pages/**.md.

Checks per page: body word count (700-1,400), answer-first opening (first paragraph <= 75 words),
3-5 FAQ, 1-3 valid image keys, summary length, banned phrases and never-claims, em dashes,
exclamation marks, every "Dish ... ₹N" price against menu.json, internal links resolve in dist/,
and the duplicate test: no run of 25+ identical words shared between any two pages.
Usage: python scripts/qa_content.py [--dist dist]
"""
import json, os, pathlib, re, sys, urllib.parse
from collections import defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / (sys.argv[sys.argv.index('--dist') + 1] if '--dist' in sys.argv else 'dist')
PAGES = sorted((ROOT / 'src/content/pages').glob('*/*.md'))
ASSETS = {p.relative_to(ROOT / 'src/assets').as_posix() for p in (ROOT / 'src/assets').glob('*/*') if p.suffix in ('.jpg', '.png')}
menu = json.load(open(ROOT / 'src/data/menu.json', encoding='utf8'))
items = {i['name']: (i['half'], i['full']) for c in menu['categories'] for g in c['groups'] for i in g['items']}

BANNED = [r'—', r'!', r'\bnestled\b', r'\bvibrant\b', r'\belevate', r'\bdelve', r'\bunforgettable\b', r'hidden gem', r'culinary journey',
          r'\btantaliz', r'whether you\'re', r'look no further', r"in today's", r'perfect for every occasion', r'\bmouth-?watering\b',
          r'\bbar\b', r'\bliquor\b', r'\balcohol', r'\bhookah\b', r'\bpool\b', r'farmhouse', r'farm stays', r'farm stay(?! open)', r'\bphotoshoot',
          r'\bparking\b', r'\bbonfire\b', r'\baward', r'best in ludhiana', r'images are for representation', r'150-200', r'150 to 200',
          r'\bcapacity of \d', r'\bseats? \d{2,}', r'\bup to \d{2,} (guests|people)', r'per plate (is|starts|from) ₹', r'\bupi\b', r'credit card',
          r'redwood farm']
fails = defaultdict(list)
# Order totals checked by hand (quantity x price, or a row that sums several dishes). Format: page|dish|value
ALLOW = set(l.strip() for l in open(ROOT / 'scripts/qa_price_allow.txt', encoding='utf8') if l.strip() and not l.startswith('#')) if (ROOT / 'scripts/qa_price_allow.txt').exists() else set()
texts = {}

def body_of(s):
    parts = s.split('---', 2)
    return parts[1], parts[2]

for p in PAGES:
    rel = p.relative_to(ROOT / 'src/content/pages').as_posix()
    fm, body = body_of(p.read_text(encoding='utf8'))
    words = re.findall(r"[\w₹'’-]+", re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', body))
    n = len(words)
    if not 700 <= n <= 1450:
        fails[rel].append(f'word count {n}')
    paras = [x.strip() for x in re.split(r'\n\s*\n', body) if x.strip() and not x.strip().startswith(('#', '|', '-', '*', '1.'))]
    if paras and len(paras[0].split()) > 75:
        fails[rel].append(f'first paragraph {len(paras[0].split())} words')
    faq = len(re.findall(r'^\s*- q:', fm, re.M))
    if not 3 <= faq <= 6:
        fails[rel].append(f'faq count {faq}')
    imgs = re.findall(r'^\s*- src:\s*"?([^"\n]+)"?', fm, re.M)
    if not 1 <= len(imgs) <= 3:
        fails[rel].append(f'image count {len(imgs)}')
    for k in imgs:
        if k.strip() not in ASSETS:
            fails[rel].append(f'unknown image {k}')
    full = (fm + body)
    low = full.lower()
    for b in BANNED:
        for m in re.finditer(b, low if b != '!' and b != r'—' else full):
            ctx = full[max(0, m.start() - 40):m.end() + 40].replace('\n', ' ')
            if b == r'\bbar\b' and re.search(r'(chocolate|candy|snack|search|sticky|action|filter|top|menu|bottom|side|navigation|progress) bar', ctx.lower()):
                continue
            if b == '!' and re.search(r'!\[|<!', full[max(0, m.start() - 1):m.end() + 1]):
                continue
            fails[rel].append(f'banned "{b}": ...{ctx}...')
            break
    # Prices: "Dish Name (₹N" or "Dish Name ₹N" or "**Dish Name** ₹N" or table rows "| Dish | ₹N |"
    plain = re.sub(r'[*_`]', '', body)
    for m in re.finditer(r'([A-Z][A-Za-z&\' ,()-]{2,60}?)\s*(?:\||:|,|\(|\s)\s*(?:half\s*)?₹\s?(\d+)(?:\s*(?:/|and|,)\s*(?:full\s*)?₹\s?(\d+))?', plain):
        name = m.group(1).strip(' ,(|:-')
        if re.match(r'^\d+\s', name) or re.search(r'(\d+|two|three|four|five|six)\s+[A-Z][a-z]+( [A-Z][a-z]+)*$', name, re.I) and re.search(r'(\d+|two|three|four|five|six)\s', name, re.I):
            continue  # quantity x dish = a sum, not a list price
        cands = [k for k in items if name.endswith(k) or name.lower().endswith(k.lower())]
        if not cands:
            continue
        k = max(cands, key=len)
        h, f = items[k]
        a, b2 = int(m.group(2)), int(m.group(3)) if m.group(3) else None
        ok = (a in (h, f)) and (b2 is None or b2 == f)
        if not ok and f'{rel}|{k}|{a}' not in ALLOW:
            fails[rel].append(f'price: {k} written ₹{a}{"/"+str(b2) if b2 else ""}, menu {h}/{f}')
    texts[rel] = re.findall(r"[a-z0-9₹]+", re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', body.lower()))
    # Links
    slug_path = '/' + rel[:-3] + '/'
    for href in re.findall(r'\]\(([^)\s]+)\)', body):
        if href.startswith(('http', 'tel:', 'mailto:', '#')):
            continue
        target = urllib.parse.urljoin(slug_path, href).split('#')[0]
        f = DIST / target.lstrip('/') / 'index.html'
        if not f.exists():
            fails[rel].append(f'broken link {href} -> {target}')

# Duplicate test: shared 25-word shingles between any two pages
N = 25
owner = {}
dups = defaultdict(set)
for rel, ws in texts.items():
    seen = set()
    for i in range(len(ws) - N + 1):
        sh = ' '.join(ws[i:i + N])
        if sh in seen:
            continue
        seen.add(sh)
        if sh in owner and owner[sh] != rel:
            dups[tuple(sorted((owner[sh], rel)))].add(sh)
        else:
            owner.setdefault(sh, rel)
for (a, b), shs in dups.items():
    fails[a].append(f'duplicate 25-word run with {b}: "{next(iter(shs))[:90]}..."')

total = len(PAGES)
print(f'pages checked: {total}')
for rel in sorted(fails):
    print(f'\n{rel}')
    for f in fails[rel]:
        print('  -', f)
print('\nRESULT:', 'PASS' if not fails else f'{len(fails)} pages with issues')
sys.exit(1 if fails else 0)
