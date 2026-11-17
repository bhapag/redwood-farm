// Phone screen recordings for the report (Pixel 7 emulation), from the live site.
// Usage: node scripts/record-motion.cjs <url> <outDir> <seconds> <mode: home|page> [chromePath]
// home: hold on the hero (so the neon shine and fairy lights start), scroll slowly, stop at the dish
//       stack and swipe two cards, then continue to the footer.
// page: hold briefly, then a steady scroll to the bottom.
const { chromium, devices } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out, secs, mode = 'page', exe] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: exe || undefined });
  const dev = devices['Pixel 7'];
  const ctx = await b.newContext({ ...dev, recordVideo: { dir: out, size: dev.viewport } });
  const pg = await ctx.newPage();
  await pg.goto(url, { waitUntil: 'load' });
  const total = +secs * 1000;
  const t0 = Date.now();
  const hold = mode === 'home' ? 4500 : 1500;
  await pg.waitForTimeout(hold);
  const glide = async (toY, ms) => {
    const from = await pg.evaluate(() => window.scrollY);
    const steps = Math.max(1, Math.round(ms / 33));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps; const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      await pg.evaluate((y) => window.scrollTo(0, y), Math.round(from + (toY - from) * e));
      await pg.waitForTimeout(33);
    }
  };
  if (mode === 'home') {
    const stackY = await pg.evaluate(() => { const s = document.querySelector('.dstack'); return s ? s.getBoundingClientRect().top + window.scrollY - 120 : 0; });
    await glide(stackY, 6500);
    await pg.waitForTimeout(900);
    const box = await pg.evaluate(() => { const r = document.querySelector('.dstack').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    for (let k = 0; k < 2; k++) {
      await pg.mouse.move(box.x, box.y); await pg.mouse.down();
      for (let s = 1; s <= 12; s++) { await pg.mouse.move(box.x - s * 22, box.y + s * 3); await pg.waitForTimeout(16); }
      await pg.mouse.up(); await pg.waitForTimeout(900);
    }
  }
  const left = total - (Date.now() - t0) - 1500;
  const end = await pg.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await glide(end, Math.max(4000, left));
  await pg.waitForTimeout(1200);
  const v = pg.video();
  await ctx.close();
  console.log(await v.path());
  await b.close();
})();
