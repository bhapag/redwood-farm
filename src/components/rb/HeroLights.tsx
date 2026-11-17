// Fairy-light dots drifting over the tunnel photo (React Bits Particles).
// 40 particles on phones, 90 on desktop; pauses off screen; nothing at all under reduced motion.
import { useEffect, useRef, useState } from 'react';
import Particles from '../reactbits/Particles/Particles';

export default function HeroLights() {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [count, setCount] = useState(40);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setCount(window.innerWidth < 900 ? 40 : 90);
    setOn(true);
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting));
    if (box.current) io.observe(box.current);
    const vis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
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
          pixelRatio={Math.min(window.devicePixelRatio || 1, 1.5)}
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
