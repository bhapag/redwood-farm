const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.argv[2] });
  const ctx = await b.newContext({ ...devices['Pixel 7'], reducedMotion: 'reduce' });
  const pg = await ctx.newPage(); await pg.goto('http://127.0.0.1:4405/', { waitUntil: 'load' }); await pg.waitForTimeout(4000);
  await pg.mouse.wheel(0, 3000); await pg.waitForTimeout(3000);
  console.log(JSON.stringify(await pg.evaluate(() => ({
    tunnelClass: document.querySelector('[data-tunnel]').className,
    running: document.getAnimations().filter((a) => a.playState === 'running').map((a) => (a.effect?.target?.className || '') + ':' + (a.animationName || a.constructor.name)).slice(0, 10),
    scrollLine: getComputedStyle(document.querySelector('.scroll-line')).display,
    sticky: getComputedStyle(document.querySelector('.cstack-card')).position,
  }))));
  await b.close();
})();
