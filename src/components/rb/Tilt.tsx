// Desktop dish stage: React Bits TiltedCard wrapped around the existing photo stage (hover tilt + glare).
// Loaded only on mouse/trackpad devices (client:media), so phones never run it.
import type { ReactNode } from 'react';
import TiltedCard from '../reactbits/TiltedCard/TiltedCard';

export default function Tilt({ children }: { children?: ReactNode }) {
  return (
    <TiltedCard containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={7}
      scaleOnHover={1.02} glare={0.22} shadow={0.4} showTooltip={false} flipOnClick={false} gyroscope={false}
      intro={false} floating={false} radius={10}>
      {children}
    </TiltedCard>
  );
}
