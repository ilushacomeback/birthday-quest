import { useEffect, useRef, useState } from 'react';
import { MdFullscreen } from 'react-icons/md';

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleEnded = () => {
      video.currentTime = 0;
      setIsPlaying(false);
    };

    video.addEventListener('pause', handlePause);
    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
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
        className="absolute right-3 top-3 z-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/80 backdrop-blur"
      >
        <MdFullscreen size={24} />
      </button>
    </div>
  );
};
