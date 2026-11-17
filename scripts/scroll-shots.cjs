// Scrolls a page with the mouse wheel (so smooth scroll and scroll triggers fire as for a visitor)
// and saves a viewport screenshot after each step.
// Usage: node scripts/scroll-shots.cjs <url> <outDir> <width> <height> [steps] [chromePath]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [url, out, w, h, steps = '14', exe] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: exe || undefined });
  const mobile = +w < 900;
  const ctx = await b.newContext(mobile ? { ...devices['Pixel 7'], viewport: { width: +w, height: +h } } : { viewport: { width: +w, height: +h } });
  const pg = await ctx.newPage();
  await pg.goto(url, { waitUntil: 'load' });
  await pg.waitForTimeout(2500);
  for (let i = 0; i < +steps; i++) {
    await pg.screenshot({ path: path.join(out, String(i).padStart(2, '0') + '.jpg'), type: 'jpeg', quality: 70 });
    if (mobile) await pg.evaluate((d) => window.scrollBy(0, d), Math.round(+h * 0.8));
    else await pg.mouse.wheel(0, Math.round(+h * 0.8));
    await pg.waitForTimeout(1600);
  }
  await b.close();
})();
