import { AnimatePresence } from 'motion/react';
import { FullscreenImageViewer } from './FullscreenImageViewer';
import type { TCarouselSlide } from '../CarouselViewport';

type FullscreenViewerProps = {
  slide: TCarouselSlide | null;
  onClose: () => void;
};

export const FullscreenViewer = ({ slide, onClose }: FullscreenViewerProps) => {
  return (
    <AnimatePresence>
      {slide?.type === 'image' && (
        <FullscreenImageViewer
          src={slide.src}
          alt={slide.description}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
};
