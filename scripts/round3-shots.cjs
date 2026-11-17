// Screens for this round: phone hero, phone tunnel (after the walk), desktop hero, desktop tunnel exit,
// desktop dish tilt, desktop DomeGallery. Usage: node scripts/round3-shots.cjs <baseUrl> <outDir> [chrome]
const { chromium, devices } = require('playwright');
(async () => {
  const [base, out, exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errs = [];
  const go = async (ctx) => { const pg = await ctx.newPage(); pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => m.type() === 'error' && errs.push(m.text())); await pg.goto(base, { waitUntil: 'load' }); await pg.waitForTimeout(1500); return pg; };
  // Phone
  let ctx = await b.newContext({ ...devices['Pixel 7'] });
  let pg = await go(ctx);
  await pg.screenshot({ path: `${out}/phone-hero.png` });
  await pg.evaluate(() => document.querySelector('[data-tunnel]').scrollIntoView());
  await pg.waitForTimeout(3500);
  await pg.screenshot({ path: `${out}/phone-tunnel-walk.png` });
  await pg.waitForTimeout(8000);
  await pg.screenshot({ path: `${out}/phone-tunnel-exit.png` });
  console.log('phone tunnel live:', await pg.evaluate(() => document.querySelector('[data-tunnel]').className));
  await ctx.close();
  // Desktop
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  pg = await go(ctx);
  await pg.screenshot({ path: `${out}/desk-hero.png` });
  const top = await pg.evaluate(() => document.querySelector('[data-tunnel]').offsetTop);
  await pg.evaluate((y) => scrollTo(0, y + 10), top); await pg.waitForTimeout(2500);
  await pg.screenshot({ path: `${out}/desk-tunnel-start.png` });
  await pg.evaluate((y) => scrollTo(0, y + innerHeight * 0.7), top); await pg.waitForTimeout(1500);
  await pg.screenshot({ path: `${out}/desk-tunnel-mid.png` });
  await pg.evaluate((y) => scrollTo(0, y + innerHeight * 1.38), top); await pg.waitForTimeout(2000);
  await pg.screenshot({ path: `${out}/desk-tunnel-exit.png` });
  await pg.evaluate(() => document.querySelector('.dswap').scrollIntoView({ block: 'center' })); await pg.waitForTimeout(5000);
  const st = await pg.$('.dswap-stage'); const bb = await st.boundingBox();
  await pg.mouse.move(bb.x + bb.width * 0.85, bb.y + bb.height * 0.2, { steps: 8 }); await pg.waitForTimeout(800);
  await pg.screenshot({ path: `${out}/desk-dish-tilt.png` });
  await pg.evaluate(() => document.querySelector('.strip-wrap').scrollIntoView({ block: 'start' })); await pg.waitForTimeout(6000);
  await pg.screenshot({ path: `${out}/desk-dome.png` });
  console.log('dome tiles:', await pg.evaluate(() => document.querySelectorAll('.sphere-root .item').length));
  console.log('errors:', JSON.stringify(errs.slice(0, 8)));
  await b.close();
})();
