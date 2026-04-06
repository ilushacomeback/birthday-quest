import { useEffect, useRef, useState } from 'react';
import { MdFullscreen } from 'react-icons/md';
import { ImSpinner2 } from 'react-icons/im';
import clsx from 'clsx';

type HTMLVideoElementWithWebkit = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

type VideoSlideProps = {
  src: string;
  poster?: string;
  isActive: boolean;
  shouldLoad: boolean;
};

export const VideoSlide = ({
  src,
  poster,
  isActive,
  shouldLoad,
}: VideoSlideProps) => {
  const videoRef = useRef<HTMLVideoElementWithWebkit | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasBeenLoaded, setHasBeenLoaded] = useState(shouldLoad);

  const shouldAttachSrc = shouldLoad || hasBeenLoaded;
  const isLoading = isActive && shouldAttachSrc && !isReady;
  const canInteract = isActive && shouldAttachSrc && isReady;

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video || !canInteract) return;

    try {
      if (video.paused) {
        await video.play();
        return;
      }

      video.pause();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenNativeFullscreen = async () => {
    const video = videoRef.current;
    if (!video || !canInteract) return;

    try {
      await video.play();

      if (typeof video.webkitEnterFullscreen === 'function') {
        video.webkitEnterFullscreen();
        return;
      }

      if (video.requestFullscreen) {
        await video.requestFullscreen();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isActive) return;

    video.pause();
    video.currentTime = 0;
  }, [isActive]);

  return (
    <div className="relative h-105 w-full overflow-hidden bg-black/50">
      <video
        ref={videoRef}
        src={shouldAttachSrc ? src : undefined}
        poster={poster}
        playsInline
        preload={isActive ? 'metadata' : 'none'}
        controls={false}
        className={clsx(
          'h-full w-full object-contain transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}
        onLoadStart={() => {
          setHasBeenLoaded(true);
          setIsReady(false);
          setIsPlaying(false);
        }}
        onLoadedMetadata={() => {
          setHasBeenLoaded(true);
          setIsReady(true);
        }}
        onLoadedData={() => {
          setHasBeenLoaded(true);
          setIsReady(true);
        }}
        onCanPlay={() => {
          setHasBeenLoaded(true);
          setIsReady(true);
        }}
        onWaiting={() => {
          setIsReady(false);
        }}
        onPlaying={() => {
          setHasBeenLoaded(true);
          setIsReady(true);
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          setIsPlaying(false);
        }}
        onError={() => {
          setIsReady(false);
          setIsPlaying(false);
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <ImSpinner2 className="animate-spin text-3xl text-white" />
        </div>
      )}

      {canInteract && (
        <>
          <button
            type="button"
            onClick={handleTogglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="rounded-full bg-black/50 px-4 py-3 text-xl text-white backdrop-blur-sm">
              {isPlaying ? '❚❚' : '▶'}
            </div>
          </button>

          <button
            type="button"
            onClick={handleOpenNativeFullscreen}
            className="absolute right-3 top-3 z-30 rounded-xl border border-white/10 bg-black/40 p-2 text-white backdrop-blur"
          >
            <MdFullscreen size={22} />
          </button>
        </>
      )}
    </div>
  );
};
