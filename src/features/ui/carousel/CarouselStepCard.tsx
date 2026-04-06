import { AnimatePresence, motion } from 'motion/react';
import { useUnit } from 'effector-react';
import type {
  CarouselStep,
  QuestStepId,
  TQuestButton,
} from '../../config/types';
import { $pathToPhotosFromStartPage } from '../../../model/quest';
import { useCarouselEmbla } from '../../../hooks/useCarouselEmbla';
import { useFullscreenMedia } from '../../../hooks/useFullscreenMedia';
import { ScreenCard } from '../../../shared/ScreenCard';
import { CarouselViewport } from './CarouselViewport';
import { CarouselControls } from './CarouselControls';
import { QuestButton } from '../../../shared/QuestButton';
import { FullscreenViewer } from './fullscreen/FullscreenViewer';

type CarouselStepCardProps = {
  slides: CarouselStep['slides'];
  buttons: TQuestButton[];
  onButtonClick: (button: TQuestButton) => void;
  handleBack?: (prevStepId?: QuestStepId) => void;
  handleNext?: () => void;
};

export const CarouselStepCard = ({
  slides,
  buttons,
  onButtonClick,
  handleBack,
  handleNext,
}: CarouselStepCardProps) => {
  const pathToPhotosFromStartPage = useUnit($pathToPhotosFromStartPage);

  const {
    emblaRef,
    emblaApi,
    selectedIndex,
    canGoPrev,
    canGoNext,
    isLastSlideViewed,
  } = useCarouselEmbla({
    slidesCount: slides.length,
  });

  const { fullscreenSlide, openFullscreen, closeFullscreen } =
    useFullscreenMedia<(typeof slides)[number]>();

  return (
    <>
      <ScreenCard
        handleBack={
          pathToPhotosFromStartPage
            ? () => handleBack?.('completed')
            : handleBack
        }
        handleNext={pathToPhotosFromStartPage ? undefined : handleNext}
      >
        <div className="space-y-4">
          <CarouselViewport
            emblaRef={emblaRef}
            slides={slides}
            selectedIndex={selectedIndex}
            onOpenFullscreen={openFullscreen}
          />

          <CarouselControls
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrev={() => emblaApi?.scrollPrev()}
            onNext={() => emblaApi?.scrollNext()}
          />
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

      <FullscreenViewer slide={fullscreenSlide} onClose={closeFullscreen} />
    </>
  );
};
