// Morning report screenshots of the live site: 390 px (phone) and 1440 px (desktop), full pages for Home, Menu
// and Parties, plus the Home dishes section on its own. Usage: node scripts/morning-shots.cjs <base> <outDir> [chrome]
const { chromium, devices } = require('playwright');
(async () => {
  const [base, out, exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const sizes = { '390': { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }, '1440': { viewport: { width: 1440, height: 900 } } };
  for (const [w, opts] of Object.entries(sizes)) {
    const ctx = await b.newContext({ ...opts, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    for (const [name, path] of [['home', ''], ['menu', 'menu/'], ['party', 'party/']]) {
      await pg.goto(`${base}/${path}?shot=${Date.now()}`, { waitUntil: 'load' });
      await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
      await pg.waitForTimeout(800);
      await pg.screenshot({ path: `${out}/${w}-${name}-top.png` });
      await pg.screenshot({ path: `${out}/${w}-${name}-full.jpg`, fullPage: true, type: 'jpeg', quality: 70 });
    }
    await pg.goto(`${base}/?shot=${Date.now()}`, { waitUntil: 'load' });
    const d = await pg.$('.dishes'); await d.scrollIntoViewIfNeeded(); await pg.waitForTimeout(800);
    await d.screenshot({ path: `${out}/${w}-home-dishes.png` });
    await ctx.close();
  }
  await b.close();
  console.log('ok');
})();
