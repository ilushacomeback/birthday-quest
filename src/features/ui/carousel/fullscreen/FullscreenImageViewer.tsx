import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'motion/react';
import { IoCloseSharp } from 'react-icons/io5';

type FullscreenImageViewerProps = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export const FullscreenImageViewer = ({
  src,
  alt,
  onClose,
}: FullscreenImageViewerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-black/95"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-30 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white backdrop-blur"
      >
        <IoCloseSharp size={24} />
      </button>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-4">
        <TransformWrapper
          minScale={1}
          maxScale={4}
          centerOnInit
          doubleClick={{ mode: 'zoomIn', step: 1.2 }}
          pinch={{ step: 5 }}
          wheel={{ step: 0.15 }}
        >
          {() => (
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full flex items-center justify-center"
            >
              <img
                src={src}
                alt={alt ?? 'fullscreen-image'}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>
    </motion.div>
  );
};
