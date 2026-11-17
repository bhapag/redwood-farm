// Sparks on tap around call-to-action buttons (React Bits ClickSpark). Off under reduced motion.
import { useEffect, useState, type ReactNode } from 'react';
import ClickSpark from '../reactbits/ClickSpark/ClickSpark';

export default function Spark({ children, color = '#f2cf83' }: { children?: ReactNode; color?: string }) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);
  return (
    <ClickSpark sparkColor={[color, '#fff1c9']} sparkSize={9} sparkRadius={22} sparkCount={reduce ? 0 : 9} duration={420} disabled={reduce} className="rb-spark">
      {children}
    </ClickSpark>
  );
}
