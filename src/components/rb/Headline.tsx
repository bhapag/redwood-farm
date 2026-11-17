// Section headline that rises word by word as it scrolls into view (React Bits ScrollFloat).
// Scrubbed transforms only: nothing pins, scrolling stays free.
// Performance: the heading renders as plain text first; ScrollFloat (and GSAP with it) loads only after the
// visitor's first scroll or touch, so none of it runs during page load.
import { useEffect, useState, type ComponentType } from 'react';

interface Props { text: string; id?: string; className?: string }

let loader: Promise<ComponentType<any>> | null = null;
const loadFloat = () => (loader ??= import('../reactbits/ScrollFloat/ScrollFloat').then((m) => m.default));

export default function Headline({ text, id, className = '' }: Props) {
  const [Float, setFloat] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      ['scroll', 'touchstart', 'wheel', 'keydown'].forEach((e) => window.removeEventListener(e, go));
      loadFloat().then((C) => setFloat(() => C));
    };
    ['scroll', 'touchstart', 'wheel', 'keydown'].forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    return () => ['scroll', 'touchstart', 'wheel', 'keydown'].forEach((e) => window.removeEventListener(e, go));
  }, []);

  if (!Float) {
    return (
      <h2 id={id} className={`scroll-float rb-headline ${className}`}>
        <span className="scroll-float-text rb-headline__text">{text}</span>
      </h2>
    );
  }
  return (
    <Float
      id={id}
      containerClassName={`rb-headline ${className}`}
      textClassName="rb-headline__text"
      effect="float"
      splitBy="words"
      animationDuration={1}
      ease="power3.out"
      scrollStart="top bottom-=8%"
      scrollEnd="top 62%"
      stagger={0.06}
    >
      {text}
    </Float>
  );
}
