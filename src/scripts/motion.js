import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const desktop = () => window.innerWidth >= 900;

// "Open now" line, worked out in India time (10:00 to 23:00 every day).
function openNow() {
  const el = document.querySelector('[data-open]');
  if (!el) return;
  const [h, m] = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()).split(':').map(Number);
  const mins = h * 60 + m;
  el.textContent = mins >= 600 && mins < 1380 ? 'Open now, until 11 PM' : 'Closed now, opens at 10 AM';
}

export function initMotion() {
  openNow();
  header();
  lazyVideos();
  if (reduce) { staticHero(); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // One RAF loop: Lenis is driven by the GSAP ticker.
  const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -90 }); }
    })
  );

  hero();
  const rest = () => {
    splits();
    reveals();
    parallax();
    story();
    hstrip();
    cards();
    skew();
    if (fine) { magnetic(); cursor(); }
    ScrollTrigger.refresh();
  };
  // Everything below the hero waits for fonts and an idle moment, so first paint stays fast.
  document.fonts.ready.then(() => ('requestIdleCallback' in window ? requestIdleCallback(rest, { timeout: 1200 }) : setTimeout(rest, 300)));
}

/* ---------- Header: solid after the hero, hides on scroll down ---------- */
function header() {
  const h = document.querySelector('[data-head]');
  if (!h) return;
  let last = 0;
  const on = () => {
    const y = window.scrollY;
    h.classList.toggle('solid', y > 40);
    h.classList.toggle('hide', y > 400 && y > last && !reduce);
    last = y;
  };
  window.addEventListener('scroll', on, { passive: true });
  on();
}

/* ---------- Videos play only while visible ---------- */
function lazyVideos() {
  const vids = document.querySelectorAll('video[data-lazy]');
  if (!vids.length) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.dataset.loaded) { if (v.dataset.poster) v.poster = v.dataset.poster; v.querySelectorAll('source[data-src]').forEach((s) => (s.src = s.dataset.src)); v.load(); v.dataset.loaded = 1; }
      if (!reduce) v.play().catch(() => {});
    } else v.pause();
  }), { rootMargin: '600px' });
  vids.forEach((v) => io.observe(v));
}

/* ---------- Hero: walk through the light tunnel, land on the real tunnel and the neon name ---------- */
function staticHero() {
  document.querySelectorAll('[data-hero]').forEach((s) => s.classList.add('is-static'));
}

function hero() {
  const sec = document.querySelector('[data-hero]');
  if (!sec) return;
  const canvas = sec.querySelector('canvas');
  const photo = sec.querySelector('.hero-photo');
  const name = sec.querySelector('.hero-name');
  const hint = sec.querySelector('.hero-hint');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, desktop() ? 2 : 1.5);
  let W, H, state = { p: 0 };

  const N = desktop() ? 22 : 14; // arches
  const GAP = 1.2;
  const resize = () => {
    W = canvas.width = Math.round(canvas.clientWidth * dpr);
    H = canvas.height = Math.round(canvas.clientHeight * dpr);
    draw();
  };

  function draw() {
    const p = state.p;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H * 0.56;
    const cam = p * GAP * 9; // camera travels forward
    const tw = performance.now() / 1000;
    // red carpet floor
    const far = 0.06 * W, near = 0.9 * W;
    const g = ctx.createLinearGradient(0, cy, 0, H);
    g.addColorStop(0, 'rgba(126,31,39,0)');
    g.addColorStop(1, 'rgba(126,31,39,0.55)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx - far / 2, cy + H * 0.02);
    ctx.lineTo(cx + far / 2, cy + H * 0.02);
    ctx.lineTo(cx + near / 2, H);
    ctx.lineTo(cx - near / 2, H);
    ctx.fill();
    for (let i = N - 1; i >= 0; i--) {
      const z = i * GAP + 0.6 - (cam % GAP);
      if (z <= 0.15) continue;
      const s = 1 / z;
      const B = Math.min(W * 0.92, H * 1.05);
      const aw = B * 0.62 * s, ah = B * 1.1 * s;
      const legs = ah * 0.42;
      const dots = Math.max(20, Math.round((desktop() ? 90 : 60) * Math.min(s * 1.4, 1.4)));
      const fade = Math.min(1, 2.6 / z) * Math.min(1, (z - 0.15) * 2.5);
      const r = Math.max(0.8, B * 0.0055 * s);
      for (let k = 0; k <= dots; k++) {
        const t = k / dots;
        let x, y;
        const per = legs * 2 + Math.PI * aw / 2;
        const d = t * per;
        if (d < legs) { x = cx - aw / 2; y = cy + ah * 0.18 - d; }
        else if (d < legs + Math.PI * aw / 2) {
          const a = Math.PI - ((d - legs) / (aw / 2));
          x = cx + Math.cos(a) * aw / 2; y = cy + ah * 0.18 - legs - Math.sin(a) * aw * 0.62;
        } else { x = cx + aw / 2; y = cy + ah * 0.18 - legs + (d - legs - Math.PI * aw / 2); }
        const flick = 0.75 + 0.25 * Math.sin(tw * 3 + k * 1.7 + i * 2.3);
        const a = fade * flick;
        ctx.fillStyle = `rgba(255,241,201,${a})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
        if (r > 2) { ctx.fillStyle = `rgba(242,207,131,${a * 0.18})`; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 6.283); ctx.fill(); }
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
  // idle twinkle while the hero is on screen
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sec);
  // Redraw only when scroll progress moves; desktop adds a gentle 15 fps twinkle.
  let lastP = -1, lastT = 0;
  const twinkle = desktop() && fine;
  gsap.ticker.add((t) => {
    if (!visible || state.p >= 0.98) return;
    if (state.p !== lastP || (twinkle && t - lastT > 0.066)) { draw(); lastP = state.p; lastT = t; }
  });

  gsap.set(photo, { opacity: 0, scale: 1.25 });
  gsap.set(name, { autoAlpha: 0, scale: 0.92, filter: 'blur(8px)' });
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    // The section is tall and its stage is position: sticky (CSS), so nothing is re-parented and LCP stays early.
    scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  });
  tl.to(state, { p: 1, duration: 1 }, 0)
    .to(hint, { opacity: 0, duration: 0.15 }, 0)
    .to(canvas, { opacity: 0, duration: 0.3 }, 0.62)
    .to(photo, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 0.55)
    .to(name, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.25, ease: 'power3.out' }, 0.72);
  // Desktop: once the walk starts, swap the still for the real tunnel loop (slow push-in made from the same photo).
  if (desktop()) {
    const base = document.documentElement.dataset.base || '';
    ScrollTrigger.create({
      trigger: sec, start: 'top+=40 top', once: true,
      onEnter: () => {
        const v = document.createElement('video');
        Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto' });
        v.setAttribute('aria-hidden', 'true');
        v.className = 'hero-video';
        v.innerHTML = `<source src="${base}/media/tunnel-loop.webm" type="video/webm"><source src="${base}/media/tunnel-loop.mp4" type="video/mp4">`;
        v.addEventListener('canplay', () => v.classList.add('on'), { once: true });
        photo.append(v);
      },
    });
  }
  // one neon flicker as the sign lights up
  ScrollTrigger.create({
    trigger: sec, start: () => 'top+=' + (sec.offsetHeight - window.innerHeight) * 0.72 + ' top', once: true,
    onEnter: () => gsap.fromTo(name, { opacity: 0.35 }, { opacity: 1, duration: 0.08, repeat: 3, yoyo: true, ease: 'steps(1)' }),
  });
}

/* ---------- Split-text line reveals with masks ---------- */
function splits() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'ln', aria: 'none' });
    gsap.from(s.lines, {
      yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function reveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  gsap.utils.toArray('[data-clip]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(18% 12% 18% 12% round 4px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 4px)', ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 35%', scrub: 0.6 },
    });
  });
}

function parallax() {
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 12;
    if (!desktop() && amt > 8) return; // keep mobile light
    gsap.fromTo(el, { yPercent: -amt / 2 }, { yPercent: amt / 2, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- Pinned story: text crossfades over pinned media ---------- */
function story() {
  const sec = document.querySelector('[data-story]');
  if (!sec) return;
  const media = gsap.utils.toArray(sec.querySelectorAll('.story-media > *'));
  const steps = gsap.utils.toArray(sec.querySelectorAll('.story-step'));
  const n = steps.length;
  gsap.set(media.slice(1), { opacity: 0 });
  gsap.set(steps.slice(1), { opacity: 0, y: 40 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + window.innerHeight * n, scrub: 0.6, pin: true } });
  for (let i = 1; i < n; i++) {
    tl.to(steps[i - 1], { opacity: 0, y: -40, duration: 0.5 }, i)
      .to(media[i - 1], { opacity: 0, duration: 0.6 }, i)
      .fromTo(media[i], { scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.8 }, i)
      .to(steps[i], { opacity: 1, y: 0, duration: 0.5 }, i + 0.3);
  }
  tl.to({}, { duration: 0.6 });
  const bar = sec.querySelector('.story-progress i');
  if (bar) ScrollTrigger.create({ trigger: sec, start: 'top top', end: () => '+=' + window.innerHeight * n, onUpdate: (s) => (bar.style.transform = `scaleX(${s.progress})`) });
}

/* ---------- Horizontal dish strip (desktop pin; mobile uses native swipe) ---------- */
function hstrip() {
  const sec = document.querySelector('[data-hstrip]');
  if (!sec || !desktop()) return;
  const track = sec.querySelector('.hstrip-track');
  const dist = () => track.scrollWidth - window.innerWidth + 80;
  gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), scrub: 0.6, pin: true, invalidateOnRefresh: true },
  });
}

/* ---------- Stacked sticky cards: earlier cards recede ---------- */
function cards() {
  const cs = gsap.utils.toArray('.stack-card');
  if (!desktop()) return; // mobile cards are taller than the screen; plain sticky stacking reads better
  cs.forEach((c, i) => {
    if (i === cs.length - 1) return;
    gsap.to(c.querySelector('.stack-inner'), {
      scale: 0.95, filter: 'brightness(0.6)', ease: 'none',
      // Dim only while the next card slides up over this one (until it reaches its sticky top).
      scrollTrigger: { trigger: cs[i + 1], start: 'top 75%', end: () => 'top ' + (84 + (i + 1) * 18) + 'px', scrub: true },
    });
  });
}

/* ---------- Velocity skew on large type ---------- */
function skew() {
  const els = gsap.utils.toArray('[data-skew]');
  if (!els.length || !desktop()) return;
  const set = els.map((el) => gsap.quickTo(el, 'skewY', { duration: 0.5, ease: 'power3' }));
  ScrollTrigger.create({ onUpdate: (s) => { const v = gsap.utils.clamp(-4, 4, s.getVelocity() / -400); set.forEach((q) => q(v)); } });
}

/* ---------- Magnetic buttons ---------- */
function magnetic() {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* ---------- Custom cursor with image preview on dish names ---------- */
function cursor() {
  const c = document.createElement('div'); c.className = 'cursor';
  const peek = document.createElement('div'); peek.className = 'peek'; peek.innerHTML = '<img alt="" />';
  document.body.append(c, peek);
  const img = peek.querySelector('img');
  const cx = gsap.quickTo(c, 'x', { duration: 0.15 }), cy = gsap.quickTo(c, 'y', { duration: 0.15 });
  const px = gsap.quickTo(peek, 'x', { duration: 0.6, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: 0.6, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    c.classList.add('on'); cx(e.clientX); cy(e.clientY); px(e.clientX + 24); py(e.clientY - 200);
  });
  document.querySelectorAll('a, button, [data-peek]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      c.classList.add('big');
      if (el.dataset.peek) { img.src = el.dataset.peek; peek.classList.add('on'); }
    });
    el.addEventListener('pointerleave', () => { c.classList.remove('big'); peek.classList.remove('on'); });
  });
}
