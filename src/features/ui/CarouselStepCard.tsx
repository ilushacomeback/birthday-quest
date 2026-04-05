import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenCard } from '../../shared/ScreenCard';
import { QuestButton } from '../../shared/QuestButton';
import { useUnit } from 'effector-react';
import { $pathToPhotosFromStartPage } from '../../model/quest';
import type { CarouselStep, QuestStepId, TQuestButton } from '../config/types';

type CarouselStepCardProps = {
  images: CarouselStep['images'];
  buttons: TQuestButton[];
  onButtonClick: (button: TQuestButton) => void;
  handleBack?: (prevStepId?: QuestStepId) => void;
  handleNext?: () => void;
};

export const CarouselStepCard = ({
  images,
  buttons,
  onButtonClick,
  handleBack,
  handleNext,
}: CarouselStepCardProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  });

  const [, setSelectedIndex] = useState(0);
  const [isLastSlideViewed, setIsLastSlideViewed] = useState(
    images.length <= 1,
  );

  const pathToPhotosFromStartPage = useUnit($pathToPhotosFromStartPage);

  const updateState = useCallback(() => {
    if (!emblaApi) return;

    const index = emblaApi.selectedScrollSnap();
    const lastIndex = images.length - 1;

    setSelectedIndex(index);

    if (index >= lastIndex) {
      setIsLastSlideViewed(true);
    }
  }, [emblaApi, images.length]);

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

  const canGoPrev = emblaApi?.canScrollPrev() ?? false;
  const canGoNext = emblaApi?.canScrollNext() ?? false;

  console.log('pathToPhotosFromStartPage', pathToPhotosFromStartPage);

  return (
    <ScreenCard
      handleBack={
        pathToPhotosFromStartPage ? () => handleBack?.('completed') : handleBack
      }
      handleNext={pathToPhotosFromStartPage ? undefined : handleNext}
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
          <div className="flex">
            {images.map(({ src, description }, index) => (
              <div key={src} className="min-w-0 shrink-0 grow-0 basis-full">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <img
                    src={src}
                    alt={`memory-slide-${index + 1}`}
                    className="h-90 w-full object-cover"
                  />
                </div>
                {description && (
                  <p className="px-1 pt-3 text-center text-sm leading-6 text-zinc-300">
                    {description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canGoPrev}
            className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition disabled:opacity-40"
          >
            Назад
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canGoNext}
            className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition disabled:opacity-40"
          >
            Дальше
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isLastSlideViewed &&
          buttons.length > 0 &&
          !pathToPhotosFromStartPage && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-3"
            >
              {buttons.map((button) => (
                <QuestButton
                  key={`${button.label}-${button.nextStepId}`}
                  onClick={() => onButtonClick(button)}
                  variant={button.variant}
                >
                  {button.label}
                </QuestButton>
              ))}
            </motion.div>
          )}
      </AnimatePresence>
    </ScreenCard>
  );
};
