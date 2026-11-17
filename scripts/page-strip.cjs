// Phone screens down a whole page, joined into one contact strip for review.
// Usage: node scripts/page-strip.cjs <url> <out.png> [chrome] [width=412]
const { chromium, devices } = require('playwright');
(async () => {
  const [url, out, exe, w = '412'] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ ...devices['Pixel 7'], viewport: { width: +w, height: 860 } });
  const pg = await ctx.newPage();
  await pg.goto(url, { waitUntil: 'load' });
  await pg.waitForTimeout(1200);
  const H = await pg.evaluate(() => document.documentElement.scrollHeight);
  const shots = [];
  for (let y = 0; y < H; y += 800) {
    await pg.evaluate((yy) => scrollTo(0, yy), y); await pg.waitForTimeout(700);
    shots.push((await pg.screenshot()).toString('base64'));
  }
  const html = `<body style="margin:0;background:#888;display:flex;flex-wrap:wrap;gap:6px;width:${(+w + 6) * 6}px">${shots.map((s) => `<img src="data:image/png;base64,${s}" style="width:${w}px">`).join('')}</body>`;
  const p2 = await (await b.newContext({ viewport: { width: (+w + 6) * 6, height: 800 }, deviceScaleFactor: 0.5 })).newPage();
  await p2.setContent(html); await p2.waitForTimeout(500);
  await p2.screenshot({ path: out, fullPage: true });
  console.log(shots.length, 'screens');
  await b.close();
})();
