// node scripts/record.cjs <url> <outDir> <width> <height> <seconds>
// Records a smooth scroll-through of the page as a WebM (Playwright video).
const { chromium } = require('playwright');
(async () => {
  const [url, out, w, h, secs = 26] = process.argv.slice(2);
  const mobile = +w < 900;
  const b = await chromium.launch({ executablePath: process.env.LOCALAPPDATA + '/ms-playwright/chromium-1248/chrome-win64/chrome.exe' });
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: mobile, hasTouch: mobile, recordVideo: { dir: out, size: { width: +w, height: +h } } });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const steps = Math.round((+secs - 3) * 30);
  for (let i = 1; i <= steps; i++) {
    const y = Math.round((total * i) / steps);
    if (mobile) await p.evaluate((y) => window.scrollTo(0, y), y);
    else await p.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)), y);
    await p.waitForTimeout(33);
  }
  await p.waitForTimeout(1500);
  await ctx.close();
  await b.close();
})();
