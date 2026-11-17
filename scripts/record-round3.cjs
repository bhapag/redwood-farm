// 30 s phone recording of Home: first screen, a fast flick, a pause on the 3D tunnel (walk to the neon
// name), then flicks down the page. Pixel 7 profile. Usage: node scripts/record-round3.cjs <url> <outDir> [chrome]
const { chromium, devices } = require('playwright');
(async () => {
  const [url, out, exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const vp = devices['Pixel 7'].viewport;
  const ctx = await b.newContext({ ...devices['Pixel 7'], recordVideo: { dir: out, size: vp } });
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  const flick = async (dist = 600) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 760 }] });
    for (let k = 1; k <= 6; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: 760 - (k * dist) / 6 }] }); await new Promise((r) => setTimeout(r, 12)); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await pg.goto(url, { waitUntil: 'load' });
  await pg.waitForTimeout(3500);                       // first screen
  await flick(500); await pg.waitForTimeout(1500);      // fast flick into the photo
  // bring the tunnel band into view and hold while the walk plays
  await pg.waitForTimeout(800);
  await pg.evaluate(() => { const t = document.querySelector('[data-tunnel]'); scrollTo({ top: t.getBoundingClientRect().top + scrollY - 64, behavior: 'smooth' }); });
  await pg.waitForTimeout(10500);
  for (let i = 0; i < 9; i++) { await flick(650); await pg.waitForTimeout(900); } // fast flicks down the page
  await pg.waitForTimeout(1500);
  await ctx.close();
  console.log(await pg.video().path());
  await b.close();
})();
