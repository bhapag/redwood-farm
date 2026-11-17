// client:after — hydrate an island 2.5 s after the page has loaded, or on the first interaction,
// whichever comes first. Used for decorative hero effects (neon shine, fairy-light canvas) so their
// JavaScript never competes with the first paint; the hero already moves through CSS until then.
export default (load) => {
  const events = ['scroll', 'touchstart', 'pointerdown', 'keydown'];
  let done = false, timer = 0;
  const go = async () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    events.forEach((e) => window.removeEventListener(e, go));
    const hydrate = await load();
    await hydrate();
  };
  const arm = () => { timer = setTimeout(go, 2500); };
  if (document.readyState === 'complete') arm(); else window.addEventListener('load', arm, { once: true });
  events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
};
