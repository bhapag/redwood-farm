// Core behaviour for every device. Phones get only this: no smooth-scroll library, no pinning.
// Desktop (fine pointer, wide screen, motion allowed) also loads motion-desktop.js on demand.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// "Open now" line, worked out in India time (10:00 to 23:00 every day).
function openNow() {
  const els = document.querySelectorAll('[data-open]');
  if (!els.length) return;
  const [h, m] = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()).split(':').map(Number);
  const mins = h * 60 + m;
  const open = mins >= 600 && mins < 1380;
  els.forEach((el) => { el.textContent = open ? 'Open now, until 11 PM' : 'Closed now, opens at 10 AM'; el.dataset.state = open ? 'open' : 'closed'; });
}

/* ---------- Header ----------
   Phones: the header is always solid and never moves, so there is no scroll listener at all (native
   momentum scrolling stays untouched). Desktop: it hides while scrolling down, using one passive listener
   that only writes when the state actually changes. */
function header() {
  const h = document.querySelector('[data-head]');
  if (!h) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let last = 0, hidden = false, frame = 0;
  const on = () => {
    frame = 0;
    const y = window.scrollY;
    const hide = y > 500 && y > last && !reduce && !document.documentElement.classList.contains('sheet-open');
    if (hide !== hidden) { hidden = hide; h.classList.toggle('hide', hide); }
    last = y;
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(on); }, { passive: true });
}

/* ---------- Menu sheet: native <dialog>, so focus and Escape are handled by the browser ---------- */
function sheet() {
  const d = document.querySelector('[data-sheet]');
  const open = document.querySelector('[data-sheet-open]');
  if (!d || !open || typeof d.showModal !== 'function') return;
  const root = document.documentElement;
  open.addEventListener('click', () => { d.showModal(); root.classList.add('sheet-open'); open.setAttribute('aria-expanded', 'true'); });
  d.querySelector('[data-sheet-close]')?.addEventListener('click', () => d.close());
  d.addEventListener('close', () => { root.classList.remove('sheet-open'); open.setAttribute('aria-expanded', 'false'); open.focus(); });
  d.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => d.close()));
}

/* ---------- Reveals: a short fade-up when a block enters the screen ---------- */
function reveals() {
  const els = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((e) => io.observe(e));
}

/* ---------- Swipe rows: hide the "swipe" hint once the visitor has swiped ---------- */
function swipeHints() {
  document.querySelectorAll('[data-swipe]').forEach((row) => {
    const hint = document.querySelector(`[data-swipe-hint="${row.dataset.swipe}"]`);
    if (!hint) return;
    row.addEventListener('scroll', () => { if (row.scrollLeft > 24) hint.classList.add('gone'); }, { passive: true });
  });
}

/* ---------- Videos play only while visible ---------- */
function lazyVideos() {
  const vids = document.querySelectorAll('video[data-lazy]');
  if (!vids.length) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.dataset.loaded) { v.querySelectorAll('source[data-src]').forEach((s) => (s.src = s.dataset.src)); v.load(); v.dataset.loaded = 1; }
      if (!reduce) v.play().catch(() => {});
    } else v.pause();
  }), { rootMargin: '400px' });
  vids.forEach((v) => io.observe(v));
}

/* ---------- Warm-up: parse the heavy island libraries while the visitor reads the first screen ----------
   Islands hydrate on scroll; parsing GSAP and the motion library at that moment would make the first
   scroll stutter on a mid-range phone. So, 3 s after load and in idle time, fetch and evaluate them once.
   The islands share these exact modules, so their own hydration is then cheap. */
function warmIslands() {
  if (reduce) return;
  const has = (name) => document.querySelector(`astro-island[component-url*="${name}"]`);
  const jobs = [];
  if (!jobs.length) return;
  const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200));
  const run = () => { const job = jobs.shift(); if (!job) return; job().catch(() => {}).finally(() => idle(run)); };
  const arm = () => setTimeout(() => idle(run), 3000);
  if (document.readyState === 'complete') arm(); else window.addEventListener('load', arm, { once: true });
}

export function initMotion() {
  openNow();
  header();
  sheet();
  reveals();
  swipeHints();
  lazyVideos();
  warmIslands();
  const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
  if (desktop && !reduce) {
    const go = () => import('./motion-desktop.js').then((m) => m.initDesktop());
    'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 400);
  }
}
