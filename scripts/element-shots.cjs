// Screenshots of chosen elements at several widths, after settling reveals.
// Usage: node scripts/element-shots.cjs <url> <outDir> <selector> <widths comma list> [prefix] [chromePath]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [url, out, sel, widths, prefix = 'el', exe] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: exe || undefined });
  for (const w of widths.split(',').map(Number)) {
    const mobile = w < 900;
    const ctx = await b.newContext(mobile ? { ...devices['Pixel 7'], viewport: { width: w, height: 800 } } : { viewport: { width: w, height: 900 } });
    const pg = await ctx.newPage();
    await pg.goto(url, { waitUntil: 'load' });
    await pg.waitForTimeout(1200);
    const el = await pg.$(sel);
    if (!el) { console.log('missing', sel); await ctx.close(); continue; }
    await el.scrollIntoViewIfNeeded();
    await pg.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('in')));
    await pg.waitForTimeout(1500);
    const file = path.join(out, `${prefix}_${w}.jpg`);
    await el.screenshot({ path: file, type: 'jpeg', quality: 78 });
    const m = await el.evaluate((e) => ({ w: e.scrollWidth, cw: e.clientWidth, h: e.getBoundingClientRect().height }));
    console.log(file, JSON.stringify(m));
    await ctx.close();
  }
  await b.close();
})();
