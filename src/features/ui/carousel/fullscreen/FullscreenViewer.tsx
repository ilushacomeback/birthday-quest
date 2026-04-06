import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FullscreenImageViewer } from './FullscreenImageViewer';
import type { TCarouselSlide } from '../CarouselViewport';
import { IoCloseSharp } from 'react-icons/io5';

type FullscreenViewerProps = {
  slide: TCarouselSlide | null;
  onClose: () => void;
};

export const FullscreenViewer = ({ slide, onClose }: FullscreenViewerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!slide) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slide, onClose]);

  useEffect(() => {
    if (slide) return;

    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  }, [slide]);

  return (
    <AnimatePresence>
      {slide &&
        (slide.type === 'image' ? (
          <FullscreenImageViewer
            src={slide.src}
            alt={slide.description}
            onClose={onClose}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/95"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white backdrop-blur"
            >
              <IoCloseSharp size={24} />
            </button>

            <div className="flex h-full w-full items-center justify-center p-4">
              <video
                ref={videoRef}
                src={slide.src}
                poster={slide.poster}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </motion.div>
        ))}
    </AnimatePresence>
  );
};
