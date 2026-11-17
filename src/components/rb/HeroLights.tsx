// Fairy-light dots drifting over the tunnel photo (React Bits Particles).
// 40 particles on phones, 90 on desktop; starts after the hero has painted (hydrated with client:after); pauses off screen; nothing at all under reduced motion.
import { useEffect, useRef, useState } from 'react';
import Particles from '../reactbits/Particles/Particles';

export default function HeroLights() {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [count, setCount] = useState(40);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const phone = window.innerWidth < 900;
    setCount(phone ? 40 : 90);
    // Start only after the page has finished loading and painted the hero photo, so the canvas
    // never competes with the first paint.
    let t = 0;
    const start = () => { t = window.setTimeout(() => setOn(true), 200); };
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
    // Pause once less than half of the hero is on screen, so the canvas never draws while the next section scrolls in.
    const io = new IntersectionObserver(([e]) => setPaused(e.intersectionRatio < 0.5), { threshold: [0, 0.5, 1] });
    if (box.current) io.observe(box.current);
    const vis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { window.clearTimeout(t); window.removeEventListener('load', start); io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  return (
    <div ref={box} className="hero-lights" aria-hidden="true">
      {on && (
        <Particles
          particleCount={count}
          particleSpread={10}
          speed={0.06}
          particleColors={['#fff1c9', '#f2cf83', '#ffffff']}
          alphaParticles
          particleBaseSize={count === 40 ? 70 : 90}
          sizeRandomness={0.9}
          cameraDistance={20}
          disableRotation
          pixelRatio={count === 40 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)}
          intro={false}
          twinkle={0.8}
          glow={0.6}
          drift="up"
          driftSpeed={0.35}
          moveParticlesOnHover={false}
          clickBurst={false}
          paused={paused}
        />
      )}
    </div>
  );
}
