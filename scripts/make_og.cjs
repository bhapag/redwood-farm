// Per-page Open Graph images (1200x630) for every guide page: the page's own first photo on the right, a dark
// panel on the left with the neon name, the page title and the address line. Text never sits on the photo.
// Writes public/og/pages/<cluster>-<slug>.jpg. Usage: node scripts/make_og.cjs [chromePath]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const font = (p) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'node_modules', p)).toString('base64');
const out = path.join(root, 'public/og/pages');
fs.mkdirSync(out, { recursive: true });
const pages = [];
for (const cluster of fs.readdirSync(path.join(root, 'src/content/pages'))) {
  const dir = path.join(root, 'src/content/pages', cluster);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    const title = (s.match(/^title:\s*"(.*)"\s*$/m) || [])[1];
    const img = (s.match(/images:\s*\n\s*-\s*src:\s*(\S+)/) || [])[1];
    if (title && img) pages.push({ slug: f.replace(/\.md$/, ''), cluster, title, img: path.join(root, 'src/assets', img) });
  }
}
// Core cards that need a real photo too (the menu card used an AI dish photo before 18 Nov).
for (const [name, title, img] of [
  ['og-home', 'A garden family restaurant and party lawn', 'venue/hero-path-landscape.jpg'],
  ['og-party', 'Birthday, kitty and family parties on the lawn', 'venue/birthday-arch.jpg'],
  ['og-visit', 'Find us on outer Pakhowal Road', 'venue/entrance-arch.jpg'],
  ['og-notes', 'Guides for parties, food and evenings', 'venue/palm-table.jpg'],
]) pages.push({ slug: name, cluster: 'core', title, img: path.join(root, 'src/assets', img), out: path.join(root, 'public/og', `${name}.jpg`) });
pages.push({ slug: 'menu', cluster: 'core', title: 'Our full menu of 187 dishes, with prices', img: path.join(root, 'src/assets/venue/buffet-lawn.jpg'), out: path.join(root, 'public/og/og-menu.jpg') });
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
(async () => {
  const b = await chromium.launch({ executablePath: process.argv[2] || undefined });
  const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const p of pages) {
    const photo = 'data:image/jpeg;base64,' + fs.readFileSync(p.img).toString('base64');
    // Title: the part before a colon is the topic; keep it short for the card.
    const t = p.title.split(':')[0];
    await pg.setContent(`<!doctype html><html><head><style>
      @font-face { font-family: Gloock; src: url(${font('@fontsource/gloock/files/gloock-latin-400-normal.woff2')}); }
      @font-face { font-family: Yellowtail; src: url(${font('@fontsource/yellowtail/files/yellowtail-latin-400-normal.woff2')}); }
      @font-face { font-family: Hanken; src: url(${font('@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')}); font-weight: 100 900; }
      * { margin: 0; box-sizing: border-box; }
      body { width: 1200px; height: 630px; display: grid; grid-template-columns: 620px 580px; background: #0b0f0c; color: #f7f4ec; }
      .panel { padding: 56px 52px 48px 60px; display: flex; flex-direction: column; }
      .name { font: 400 54px/1 Yellowtail; color: #effff5; text-shadow: 0 0 18px rgb(120 255 190 / 0.55), 0 0 4px rgb(160 255 210 / 0.8); }
      h1 { font: 400 ${t.length > 48 ? 46 : 54}px/1.08 Gloock; margin-top: auto; letter-spacing: -0.01em; }
      .foot { margin-top: 30px; padding-top: 18px; border-top: 1px solid rgb(247 244 236 / 0.18); font: 500 20px/1.4 Hanken; color: #c8c4b6; }
      .photo { background: url(${photo}) center / cover; }
    </style></head><body><div class="panel"><div class="name">Red Wood Farm</div><h1>${esc(t)}</h1>
      <div class="foot">Pakhowal Road, Ludhiana · Open daily 10 AM to 11 PM</div></div><div class="photo"></div></body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: p.out || path.join(out, `${p.cluster}-${p.slug}.jpg`), type: 'jpeg', quality: 78 });
  }
  console.log(pages.length, 'OG images');
  await b.close();
})();
