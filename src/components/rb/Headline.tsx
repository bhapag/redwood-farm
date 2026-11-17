// Section headline that rises word by word as it scrolls into view (React Bits ScrollFloat).
// Scrubbed transforms only: nothing pins, scrolling stays free. The full text is in a visually hidden span.
import ScrollFloat from '../reactbits/ScrollFloat/ScrollFloat';

interface Props { text: string; id?: string; className?: string }

export default function Headline({ text, id, className = '' }: Props) {
  return (
    <ScrollFloat
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
    </ScrollFloat>
  );
}
