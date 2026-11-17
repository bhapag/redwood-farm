// client:after — hydrate an island 2.5 s after the page has loaded, in an idle slot. Used for decorative
// hero effects (neon shine, fairy-light canvas) so their JavaScript never competes with the first paint
// and never lands in the middle of a scroll; the hero already moves through CSS until then.
export default (load) => {
  const go = async () => {
    const hydrate = await load();
    await hydrate();
  };
  const arm = () => setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1000 }) : go()), 2500);
  if (document.readyState === 'complete') arm(); else window.addEventListener('load', arm, { once: true });
};
