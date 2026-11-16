// node scripts/qa-shots.cjs <url> <outPrefix> <width> <height> <steps> [reduced]
// Scrolls with the mouse wheel, takes a screenshot at each step, prints console errors.
const { chromium } = require('playwright');
(async () => {
  const [url, out, w, h, steps = 6, reduced] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: process.env.LOCALAPPDATA + '/ms-playwright/chromium-1248/chrome-win64/chrome.exe' });
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference', hasTouch: +w < 900, isMobile: +w < 900 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  for (let i = 0; i < +steps; i++) {
    await p.screenshot({ path: `${out}-${String(i).padStart(2, '0')}.jpg`, quality: 70, type: 'jpeg' });
    if (+w < 900) await p.evaluate((d) => window.scrollBy(0, d), +h * 0.9);
    else await p.mouse.wheel(0, +h * 0.9);
    await p.waitForTimeout(1300);
  }
  const doc = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight }));
  console.log(JSON.stringify({ url, w, doc, errors: errs }));
  await b.close();
})();
