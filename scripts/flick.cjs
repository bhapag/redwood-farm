// Fast flick-scroll trace on a mid-range phone profile: Pixel 7 emulation, CPU slowed 4x,
// real touch-event flicks (CDP Input.dispatchTouchEvent: a fast 600 px swipe released at speed, so Chrome
// adds native fling momentum), repeated from the top until the bottom of the page.
// Records every frame interval (rAF) and every long task (>50 ms) during the gestures.
// Usage: node scripts/flick.cjs <url> [runs] [chromePath]
const { chromium, devices } = require('playwright');
(async () => {
  const [url, runs = '2', exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const results = [];
  for (let r = 0; r < +runs; r++) {
    const ctx = await b.newContext({ ...devices['Pixel 7'] });
    const pg = await ctx.newPage();
    for (const n of (process.env.BLOCK || '').split(',').filter(Boolean)) await pg.route(new RegExp(`/_astro/${n}[.][^/]*js$`), (rt) => rt.abort());
    const cdp = await ctx.newCDPSession(pg);
    await pg.goto(url, { waitUntil: 'load' });
    await pg.waitForTimeout(6000); // a visitor looks at the first screen first
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await pg.evaluate(() => {
      window.__fr = []; window.__lt = [];
      let last = performance.now();
      const loop = (t) => { window.__fr.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(e.duration))).observe({ type: 'longtask', buffered: false });
    });
    const H = await pg.evaluate(() => document.documentElement.scrollHeight);
    const vh = devices['Pixel 7'].viewport.height;
    const flick = async () => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 760 }] });
      for (let k = 1; k <= 6; k++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: 760 - k * 100 }] });
        await new Promise((res) => setTimeout(res, 12));
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    for (let i = 0; i < 60; i++) {
      const y = await pg.evaluate(() => window.scrollY);
      if (y + vh >= H - 8) break;
      await flick();
      await pg.waitForTimeout(700); // the next flick lands while the last one is still gliding
    }
    await pg.waitForTimeout(1500);
    const out = await pg.evaluate(() => { window.__stop = true; return { fr: window.__fr.slice(2), lt: window.__lt }; });
    const fr = out.fr;
    results.push({
      frames: fr.length,
      maxFrameMs: +Math.max(...fr).toFixed(1),
      over32ms: fr.filter((d) => d > 32).length,
      over50ms: fr.filter((d) => d > 50).length,
      longTasks: out.lt.length,
      longTaskMs: Math.round(out.lt.reduce((a, b) => a + b, 0)),
      reachedBottom: (await pg.evaluate(() => window.scrollY + innerHeight)) >= H - 8,
      tunnel: await pg.evaluate(() => document.querySelector('[data-tunnel]')?.className || 'none'),
    });
    await ctx.close();
  }
  console.log(JSON.stringify(results));
  await b.close();
})();
