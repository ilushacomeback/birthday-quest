import { ImageSlide } from './ImageSlide';
import { VideoSlide } from './VideoSlide';
import type { TCarouselSlide } from './CarouselViewport';

type CarouselSlideProps = {
  slide: TCarouselSlide;
  isActive: boolean;
  shouldLoad: boolean;
  onOpenFullscreen: () => void;
};

export const CarouselSlide = ({
  slide,
  isActive,
  shouldLoad,
  onOpenFullscreen,
}: CarouselSlideProps) => {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {slide.type === 'image' ? (
          <ImageSlide
            src={slide.src}
            description={slide.description}
            shouldLoad={shouldLoad}
            onOpenFullscreen={onOpenFullscreen}
          />
        ) : (
          <VideoSlide
            src={slide.src}
            poster={slide.poster}
            isActive={isActive}
            shouldLoad={shouldLoad}
          />
        )}
      </div>

      {slide.description && (
        <p className="px-1 pt-3 text-center text-sm leading-6 text-zinc-300">
          {slide.description}
        </p>
      )}
    </div>
  );
};
