// client:interact — hydrate scroll effects (headlines, sparks, counters) off the critical path:
//  1. never during page load;
//  2. from 3.5 s after load, one island per idle slot, so they are ready before most visitors scroll;
//  3. if the visitor scrolls or touches sooner, any island within 600 px of the screen hydrates next.
// Islands never hydrate all at once, so the first scroll does not stutter.
const queue = [];
let pumping = false;
let armed = false;
const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 900 }) : setTimeout(fn, 120));

function pump() {
  if (pumping) return;
  const next = queue.shift();
  if (!next) return;
  pumping = true;
  idle(async () => {
    try { await next(); } finally { pumping = false; pump(); }
  });
}

function armTimer() {
  if (armed) return;
  armed = true;
  const start = () => setTimeout(pump, 3500);
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
}

export default (load, _opts, el) => {
  let done = false;
  const hydrateNow = async () => {
    if (done) return;
    done = true;
    const hydrate = await load();
    await hydrate();
  };
  queue.push(hydrateNow);
  armTimer();

  // Early visitors: once they interact, islands near the screen jump the queue.
  const events = ['scroll', 'touchstart', 'pointerdown', 'wheel', 'keydown'];
  const onInteract = () => {
    events.forEach((e) => window.removeEventListener(e, onInteract));
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const i = queue.indexOf(hydrateNow);
      if (i > 0) { queue.splice(i, 1); queue.unshift(hydrateNow); }
      pump();
    }, { rootMargin: '600px 0px 600px 0px' });
    for (const child of el.children) io.observe(child);
    if (!el.children.length) io.observe(el);
  };
  events.forEach((e) => window.addEventListener(e, onInteract, { passive: true, once: true }));
};
