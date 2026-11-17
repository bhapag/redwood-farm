// Phones: the signature dishes as a swipe-to-flip card stack (React Bits Stack).
// Text sits on a solid panel under each photo, never on it.
import { useEffect, useState } from 'react';
import Stack from '../reactbits/Stack/Stack';

export interface Dish { name: string; price: string; veg: boolean; img: string; alt: string; line: string; href: string }

export default function DishStack({ dishes }: { dishes: Dish[] }) {
  // Photos get their source only after hydration (600 px before the stack scrolls in), so on a slow
  // connection they never compete with the hero photo during page load.
  // Only the front three photos load at first; the next ones load as the visitor swipes.
  const [ready, setReady] = useState(false);
  const [upTo, setUpTo] = useState(3);
  useEffect(() => setReady(true), []);
  const cards = dishes.map((d, i) => (
    <article className="dstack-card" key={d.name}>
      <img src={ready && i < upTo ? d.img : undefined} alt={d.alt} width={480} height={600} decoding="async" draggable={false} />
      <div className="dstack-panel">
        <h3>{d.name}</h3>
        <p className="dstack-meta">
          <span className={`mark ${d.veg ? 'v' : 'nv'}`} role="img" aria-label={d.veg ? 'Veg' : 'Non-veg'} />
          <span className="dstack-price">{d.price}</span>
        </p>
        <p className="dstack-line">{d.line}</p>
      </div>
    </article>
  ));
  return (
    <Stack
      cards={cards}
      className="dstack"
      visible={3}
      spread={14}
      depth={0.06}
      radius={14}
      frame={0}
      shadow
      tilt={8}
      threshold={70}
      sendToBackOnClick
      onChange={(top) => setUpTo((n) => Math.max(n, Math.min(dishes.length, top + 4)))}
    />
  );
}
