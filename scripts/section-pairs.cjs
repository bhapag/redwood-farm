// Before/after captures of each Home section, side by side, at phone and desktop widths.
// Usage: node scripts/section-pairs.cjs <beforeUrl> <afterUrl> <outDir> [chromePath]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const [before, after, out, exe] = process.argv.slice(2);
const pairs = [
  ['1-hero', null, '.hero'],
  ['2-intro', '.intro', '.intro'],
  ['3-story-vs-occasions', '.story', '.occasions'],
  ['4-dishes', '.hstrip', '.dishes'],
  ['5-evening', '.evening', '.evening'],
  ['6-lawn-vs-strip', '.lawn', '.strip-wrap'],
  ['7-reviews', '.reviews', '.quote'],
  ['8-guides', '.explore', '.guides'],
  ['9-visit', '.visit-cta', '.visit'],
];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: exe || undefined });
  for (const [label, opts] of [['390', { ...devices['iPhone 13'], deviceScaleFactor: 2 }], ['1440', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }]]) {
    for (const [site, url, idx] of [['before', before, 1], ['after', after, 2]]) {
      const ctx = await b.newContext(opts);
      const pg = await ctx.newPage();
      await pg.goto(url, { waitUntil: 'load' });
      await pg.waitForTimeout(1500);
      for (const p of pairs) {
        const sel = p[idx];
        const file = path.join(out, `${p[0]}_${label}_${site}.jpg`);
        if (!sel) { await pg.evaluate(() => window.scrollTo(0, 0)); await pg.waitForTimeout(800); await pg.screenshot({ path: file, type: 'jpeg', quality: 75 }); continue; }
        const el = await pg.$(sel);
        if (!el) { console.log('missing', site, sel); continue; }
        await el.scrollIntoViewIfNeeded();
        await pg.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); window.scrollBy(0, r.top); }, sel);
        await pg.waitForTimeout(1200);
        // Settle reveal animations so nothing is captured half-faded.
        await pg.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('in')));
        await pg.waitForTimeout(900);
        const box = await el.boundingBox();
        const vp = pg.viewportSize();
        const h = Math.min(box.height, vp.height * 2.2);
        if (box.height <= vp.height) await el.screenshot({ path: file, type: 'jpeg', quality: 75 });
        else await pg.screenshot({ path: file, type: 'jpeg', quality: 75, fullPage: true, clip: { x: 0, y: box.y + (await pg.evaluate(() => window.scrollY)), width: vp.width, height: h } });
      }
      await ctx.close();
    }
  }
  await b.close();
  console.log('done');
})();
