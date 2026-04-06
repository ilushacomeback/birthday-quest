import type { EmblaViewportRefType } from 'embla-carousel-react';
import { CarouselSlide } from './CarouselSlide';

export type TCarouselSlide =
  | {
      type: 'image';
      src: string;
      description?: string;
    }
  | {
      type: 'video';
      src: string;
      description?: string;
      poster?: string;
    };

type CarouselViewportProps = {
  emblaRef: EmblaViewportRefType;
  slides: TCarouselSlide[];
  selectedIndex: number;
  onOpenFullscreen: (slide: TCarouselSlide) => void;
};

export const CarouselViewport = ({
  emblaRef,
  slides,
  selectedIndex,
  onOpenFullscreen,
}: CarouselViewportProps) => {
  return (
    <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => {
          const isNearActive = Math.abs(index - selectedIndex) <= 1;

          return (
            <div
              key={`${slide.type}-${slide.src}-${index}`}
              className="min-w-0 shrink-0 grow-0 basis-full"
            >
              <CarouselSlide
                slide={slide}
                isActive={selectedIndex === index}
                shouldLoad={isNearActive}
                onOpenFullscreen={() => onOpenFullscreen(slide)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
