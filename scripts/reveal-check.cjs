// Scroll reveals: no text may still be faded once it is on screen. Scrolls in steps, waits 400 ms after each,
// then fails any [data-reveal] block that is at least 10% inside the viewport with opacity under 0.98.
// With reduced motion, every block must be fully visible without scrolling.
// Usage: node scripts/reveal-check.cjs <base> [chrome]
const { chromium, devices } = require('playwright');
(async () => {
  const [base, exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined });
  for (const p of ['/', '/party/', '/visit/', '/menu/']) {
    for (const [w, opts] of [['390', { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }], ['1440', { viewport: { width: 1440, height: 900 } }]]) {
      const ctx = await b.newContext(opts);
      const pg = await ctx.newPage();
      await pg.goto(base + p, { waitUntil: 'load' });
      let ghosts = 0, checks = 0;
      const H = await pg.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < H; y += 320) {
        await pg.evaluate((yy) => window.scrollTo(0, yy), y);
        await pg.waitForTimeout(400);
        const r = await pg.$$eval('[data-reveal]', (els) => els.map((e) => {
          const b = e.getBoundingClientRect(); const vis = Math.max(0, Math.min(b.bottom, innerHeight) - Math.max(b.top, 0));
          return { into: b.height ? vis / Math.min(b.height, innerHeight) : 0, op: parseFloat(getComputedStyle(e).opacity) };
        }));
        r.forEach((x) => { if (x.into >= 0.1) { checks++; if (x.op < 0.98) ghosts++; } });
      }
      await ctx.close();
      const rctx = await b.newContext({ ...opts, reducedMotion: 'reduce' });
      const rp = await rctx.newPage();
      await rp.goto(base + p, { waitUntil: 'load' });
      const hidden = await rp.$$eval('[data-reveal]', (els) => els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 1 || getComputedStyle(e).transform !== 'none').length);
      await rctx.close();
      console.log(`${p} ${w}px: ${checks} on-screen checks, ${ghosts} ghosted; reduced motion: ${hidden} not fully shown`);
    }
  }
  await b.close();
})();
