// Frame rate per section on a mid-range phone profile: Pixel 7 emulation, CPU slowed 4x,
// a steady scroll from top to bottom. Frames are attributed to the section under the screen centre.
// Usage: node scripts/fps.cjs <url> <section selectors, comma list> [seconds] [chromePath]
const { chromium, devices } = require('playwright');
(async () => {
  const [url, sels, secs = '24', exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ ...devices['Pixel 7'] });
  const pg = await ctx.newPage();
  // Optional: BLOCK=Name1,Name2 blocks those island chunks, to find which effect costs frames.
  for (const n of (process.env.BLOCK || '').split(',').filter(Boolean)) await pg.route(new RegExp(`/_astro/${n}[.][^/]*js$`), (r) => r.abort());
  const cdp = await ctx.newCDPSession(pg);
  await pg.goto(url, { waitUntil: 'load' });
  // A visitor looks at the first screen for a few seconds before scrolling; the hero effects hydrate then.
  await pg.waitForTimeout(8000);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const res = await pg.evaluate(async ({ sels, secs }) => {
    const list = sels.split(',');
    const total = document.documentElement.scrollHeight - innerHeight;
    const dur = secs * 1000;
    const frames = [];
    let t0 = null, last = null;
    await new Promise((done) => {
      const step = (t) => {
        if (t0 === null) { t0 = t; last = t; }
        const p = Math.min(1, (t - t0) / dur);
        window.scrollTo(0, p * total);
        const mid = innerHeight / 2;
        let sec = 'other';
        for (const s of list) { const el = document.querySelector(s); if (!el) continue; const r = el.getBoundingClientRect(); if (r.top <= mid && r.bottom >= mid) { sec = s; break; } }
        if (t !== last) frames.push([sec, t - last]);
        last = t;
        if (p < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    });
    const out = {};
    for (const [s, d] of frames) { (out[s] = out[s] || []).push(d); }
    return Object.fromEntries(Object.entries(out).map(([s, ds]) => {
      // A real screen refreshes at most every 16.7 ms; headless frames can run faster, so clamp to vsync.
      const avg = ds.reduce((a, b) => a + Math.max(b, 16.67), 0) / ds.length;
      const sorted = [...ds].sort((a, b) => a - b);
      return [s, { frames: ds.length, fps: +(1000 / avg).toFixed(1), p95ms: +sorted[Math.floor(ds.length * 0.95)].toFixed(1), over33ms: ds.filter((d) => d > 33.4).length }];
    }));
  }, { sels, secs: +secs });
  console.log(JSON.stringify(res, null, 1));
  await b.close();
})();
