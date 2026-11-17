// client:interact — hydrate an island on the visitor's first scroll, touch, click or key press.
// Used for effects that only matter once someone starts moving through the page (scroll headlines,
// tap sparks), so none of their JavaScript runs while the first screen is painting.
export default (load) => {
  const events = ['scroll', 'touchstart', 'pointerdown', 'wheel', 'keydown'];
  let done = false;
  const go = async () => {
    if (done) return;
    done = true;
    events.forEach((e) => window.removeEventListener(e, go));
    const hydrate = await load();
    await hydrate();
  };
  events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
};
