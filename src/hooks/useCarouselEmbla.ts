import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type UseCarouselEmblaParams = {
  slidesCount: number;
};

export const useCarouselEmbla = ({ slidesCount }: UseCarouselEmblaParams) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLastSlideViewed, setIsLastSlideViewed] = useState(slidesCount <= 1);

  const updateState = useCallback(() => {
    if (!emblaApi) return;

    const index = emblaApi.selectedScrollSnap();
    const lastIndex = slidesCount - 1;

    setSelectedIndex(index);

    if (index >= lastIndex) {
      setIsLastSlideViewed(true);
    }
  }, [emblaApi, slidesCount]);

  useEffect(() => {
    if (!emblaApi) return;

    const frame = window.requestAnimationFrame(() => {
      updateState();
    });

    emblaApi.on('select', updateState);
    emblaApi.on('reInit', updateState);

    return () => {
      window.cancelAnimationFrame(frame);
      emblaApi.off('select', updateState);
      emblaApi.off('reInit', updateState);
    };
  }, [emblaApi, updateState]);

  return {
    emblaRef,
    emblaApi,
    selectedIndex,
    isLastSlideViewed,
    canGoPrev: emblaApi?.canScrollPrev() ?? false,
    canGoNext: emblaApi?.canScrollNext() ?? false,
  };
};
