// Every sitemap page at phone widths: sideways overflow and console errors.
// Usage: node scripts/sweep.cjs <baseUrl> [widths comma list] [chromePath]
const { chromium } = require('playwright');
(async () => {
  const [base = 'http://127.0.0.1:4401', widths = '360,390,412', exe] = process.argv.slice(2);
  const xml = await (await fetch(base + '/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/^\/redwood-farm/, ''));
  const b = await chromium.launch({ executablePath: exe || undefined });
  let fails = 0;
  for (const w of widths.split(',').map(Number)) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    let errs = 0, over = 0;
    for (const p of paths) {
      const pg = await ctx.newPage(); const e = [];
      pg.on('console', (m) => m.type() === 'error' && e.push(m.text()));
      pg.on('pageerror', (x) => e.push(String(x)));
      try { await pg.goto(base + p, { waitUntil: 'load', timeout: 60000 }); } catch { console.log('TIMEOUT', w, p); fails++; await pg.close(); continue; }
      await pg.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await pg.waitForTimeout(300);
      const ov = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      if (e.length) { errs++; console.log('ERR', w, p, e.slice(0, 2).join(' | ')); }
      if (ov) { over++; console.log('OVERFLOW', w, p); }
      await pg.close();
    }
    console.log(`${w}px: ${paths.length} pages, console errors on ${errs}, overflow on ${over}`);
    fails += errs + over;
    await ctx.close();
  }
  await b.close();
  process.exit(fails ? 1 : 0);
})();
