import { useState } from 'react';
import clsx from 'clsx';
import { ImSpinner2 } from 'react-icons/im';

type ImageSlideProps = {
  src: string;
  description?: string;
  shouldLoad: boolean;
  onOpenFullscreen: () => void;
};

export const ImageSlide = ({
  src,
  description,
  shouldLoad,
  onOpenFullscreen,
}: ImageSlideProps) => {
  const [hasBeenLoaded, setHasBeenLoaded] = useState(shouldLoad);
  const [isReady, setIsReady] = useState(false);

  const shouldAttachSrc = shouldLoad || hasBeenLoaded;
  const isLoading = shouldAttachSrc && !isReady;

  return (
    <button
      type="button"
      onClick={onOpenFullscreen}
      className="relative block h-105 w-full overflow-hidden bg-black/50"
      disabled={!shouldAttachSrc}
    >
      {shouldAttachSrc && (
        <>
          <img
            src={src}
            alt=""
            aria-hidden
            className={clsx(
              'absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-30 transition-opacity duration-200',
              isLoading ? 'opacity-0' : 'opacity-30',
            )}
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/30" />

          <img
            src={src}
            alt={description ?? 'memory-slide'}
            loading="lazy"
            className={clsx(
              'relative z-10 h-full w-full object-contain transition-opacity duration-200',
              isLoading ? 'opacity-0' : 'opacity-100',
            )}
            onLoad={() => {
              setHasBeenLoaded(true);
              setIsReady(true);
            }}
            onError={() => {
              setIsReady(false);
            }}
          />
        </>
      )}

      {!shouldAttachSrc && <div className="absolute inset-0 bg-black/50" />}

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <ImSpinner2 className="animate-spin text-3xl text-white" />
        </div>
      )}
    </button>
  );
};
