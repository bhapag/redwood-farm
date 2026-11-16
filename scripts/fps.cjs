// node scripts/fps.cjs <url> <width> <height>   (4x CPU throttle, scrolls the page, reports frame stats)
const { chromium } = require('playwright');
(async () => {
  const [url, w, h] = process.argv.slice(2);
  const mobile = +w < 900;
  const b = await chromium.launch({ executablePath: process.env.LOCALAPPDATA + '/ms-playwright/chromium-1248/chrome-win64/chrome.exe' });
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await p.goto(url, { waitUntil: 'networkidle' });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.waitForTimeout(1000);
  const r = await p.evaluate(async (mobile) => {
    const frames = [];
    let last = performance.now(), run = true;
    const tick = (t) => { frames.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    const total = document.documentElement.scrollHeight - innerHeight;
    const dur = 12000, t0 = performance.now();
    await new Promise((res) => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / dur);
        window.scrollTo(0, total * k);
        if (k < 1) setTimeout(step, 16); else res();
      };
      step();
    });
    run = false;
    const f = frames.slice(5).sort((a, b) => a - b);
    const avg = f.reduce((s, x) => s + x, 0) / f.length;
    return { frames: f.length, avgFps: +(1000 / avg).toFixed(1), p95ms: +f[Math.floor(f.length * 0.95)].toFixed(1), over50ms: f.filter((x) => x > 50).length };
  }, mobile);
  console.log(url, w + 'x' + h, JSON.stringify(r));
  await b.close();
})();
