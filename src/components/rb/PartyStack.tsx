// Party occasions as cards that stack as you scroll (React Bits ScrollStack, window scroll).
// Native scrolling only: no wheel hijack, no snapping, so the page never locks.
import ScrollStack, { ScrollStackItem } from '../reactbits/ScrollStack/ScrollStack';

export interface Occasion { img: string; alt: string; h: string; p: string; href: string; cta: string }

export default function PartyStack({ items }: { items: Occasion[] }) {
  return (
    <ScrollStack
      className="pstack"
      useWindowScroll
      smoothScroll={false}
      snap={false}
      itemDistance={40}
      itemStackDistance={18}
      stackPosition="14%"
      itemScale={0.035}
      baseScale={0.9}
      dimAmount={0.25}
      holdDistance={60}
    >
      {items.map((o) => (
        <ScrollStackItem key={o.h} itemClassName="pstack-card">
          <img src={o.img} alt={o.alt} width={760} height={570} loading="lazy" decoding="async" />
          <div className="pstack-panel">
            <h3>{o.h}</h3>
            <p>{o.p}</p>
            <a className="link" href={o.href} target="_blank" rel="noopener">{o.cta} →</a>
          </div>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
