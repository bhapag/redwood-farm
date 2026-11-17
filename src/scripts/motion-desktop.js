// Desktop-only motion, loaded on demand: smooth scroll, gentle parallax,
// and the film strip that drifts sideways as you scroll past it. Nothing pins, and no two images
// ever cross-fade over each other.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initDesktop() {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -90 }); }
    })
  );

  document.fonts.ready.then(() => {

    // Parallax inside a clipped frame: the frame stays put, the picture drifts.
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const amt = parseFloat(el.dataset.parallax) || 8;
      gsap.fromTo(el, { yPercent: -amt / 2 }, { yPercent: amt / 2, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Film strip: the row slides left while the section crosses the screen.
    gsap.utils.toArray('[data-strip]').forEach((track) => {
      const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
      track.style.overflow = 'visible';
      gsap.fromTo(track, { x: 0 }, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: track, start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } });
    });

    ScrollTrigger.refresh();
  });
}
