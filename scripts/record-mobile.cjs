// 20-second phone scroll recording of the home page (iPhone 13 size), saved as WebM.
// Usage: node scripts/record-mobile.cjs <url> <outDir> [chromePath]
const { chromium, devices } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out, exe] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: exe || undefined });
  const ctx = await b.newContext({ ...devices['iPhone 13'], recordVideo: { dir: out, size: { width: 390, height: 844 } } });
  const pg = await ctx.newPage();
  await pg.goto(url, { waitUntil: 'load' });
  await pg.waitForTimeout(2000); // first screen: the hero
  const total = await pg.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const steps = 16 * 60; // about 16 s of scrolling at 60 steps a second
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    await pg.evaluate((y) => window.scrollTo(0, y), Math.round(e * total));
    await pg.waitForTimeout(16);
  }
  await pg.waitForTimeout(2000);
  const v = pg.video();
  await ctx.close();
  console.log(await v.path());
  await b.close();
})();
