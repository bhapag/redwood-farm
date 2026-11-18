// Section-by-section screenshots of a page at 390 and 1440 px (before/after reports).
// Usage: node scripts/section-shots.cjs <pageUrl> <outDir> <prefix> [chrome]
const { chromium, devices } = require('playwright');
(async () => {
  const [url, out, prefix, exe] = process.argv.slice(2);
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: exe || undefined });
  for (const [w, opts] of [['390', { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }], ['1440', { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await b.newContext({ ...opts, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    await pg.goto(url + (url.includes('?') ? '&' : '?') + 'shot=' + Date.now(), { waitUntil: 'load' });
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: `${out}/${prefix}-${w}-first.png` });
    await pg.addStyleTag({ content: '.site-head,.actionbar{visibility:hidden!important}' });
    const secs = await pg.$$('main > section, main > div > section, footer');
    let i = 0;
    for (const s of secs) {
      const box = await s.boundingBox();
      if (!box || box.height < 40) continue;
      i++;
      await s.scrollIntoViewIfNeeded(); await pg.waitForTimeout(250);
      const name = (await s.evaluate((e) => e.getAttribute('aria-labelledby') || e.className.split(' ')[0] || e.tagName)).replace(/[^a-z0-9-]/gi, '');
      await s.screenshot({ path: `${out}/${prefix}-${w}-${String(i).padStart(2, '0')}-${name}.jpg`, type: 'jpeg', quality: 70 });
    }
    await pg.screenshot({ path: `${out}/${prefix}-${w}-full.jpg`, fullPage: true, type: 'jpeg', quality: 60 });
    await ctx.close();
  }
  await b.close();
  console.log('ok');
})();
