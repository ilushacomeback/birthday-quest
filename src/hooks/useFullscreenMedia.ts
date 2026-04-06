import { useCallback, useState } from 'react';

export const useFullscreenMedia = <T>() => {
  const [fullscreenSlide, setFullscreenSlide] = useState<T | null>(null);

  const openFullscreen = useCallback((slide: T) => {
    setFullscreenSlide(slide);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenSlide(null);
  }, []);

  return {
    fullscreenSlide,
    openFullscreen,
    closeFullscreen,
  };
};
