// Desktop venue gallery: React Bits DomeGallery (drag to turn, click to enlarge) with real venue photos.
// It renders nothing on the server and on touch screens: its drag surface sets touch-action: none, which
// would trap vertical swipes on a phone. Phones keep the native swipe strip instead.
import { useEffect, useState } from 'react';
import DomeGallery from '../reactbits/DomeGallery/DomeGallery';

export default function VenueDome({ images }: { images: { src: string; alt: string }[] }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches); }, []);
  if (!on) return null;
  return (
    <div className="venue-dome">
      <DomeGallery images={images} segments={26} fit={0.6} grayscale={false} overlayBlurColor="#0b1410"
        imageBorderRadius="14px" openedImageBorderRadius="16px" openedImageWidth="560px" openedImageHeight="420px" />
    </div>
  );
}
