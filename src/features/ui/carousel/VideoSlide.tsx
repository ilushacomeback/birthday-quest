import { useEffect, useRef, useState } from 'react';
import { MdFullscreen } from 'react-icons/md';
import { ImSpinner2 } from 'react-icons/im';

type HTMLVideoElementWithWebkit = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

type VideoSlideProps = {
  src: string;
  poster?: string;
  isActive: boolean;
};

export const VideoSlide = ({ src, poster, isActive }: VideoSlideProps) => {
  const videoRef = useRef<HTMLVideoElementWithWebkit | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  };

  const handleOpenNativeFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

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

  // 🎧 события видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleEnded = () => {
      video.currentTime = 0;
      setIsPlaying(false);
    };

    const handleLoaded = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);

    video.addEventListener('pause', handlePause);
    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('waiting', handleWaiting);

    return () => {
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('waiting', handleWaiting);
    };
  }, []);

  return (
    <div className="relative h-105 w-full overflow-hidden bg-black/50">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        controls={false}
        className="h-full w-full object-contain"
      />
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <ImSpinner2 className="animate-spin text-3xl text-white" />
        </div>
      )}
      {!isLoading && (
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
            <MdFullscreen size={24} />
          </button>
        </>
      )}
    </div>
  );
};
