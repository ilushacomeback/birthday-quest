
import type { TCarouselSlide } from './CarouselViewport';
import { VideoSlide } from './VideoSlide';

type CarouselSlideProps = {
  slide: TCarouselSlide;
  isActive: boolean;
  onOpenFullscreen: () => void;
};

export const CarouselSlide = ({
  slide,
  isActive,
  onOpenFullscreen,
}: CarouselSlideProps) => {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {slide.type === 'image' ? (
          <button
            type="button"
            onClick={onOpenFullscreen}
            className="relative block h-105 w-full overflow-hidden bg-black/50"
          >
            <img
              src={slide.src}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-30"
            />
            <div className="absolute inset-0 bg-black/30" />
            <img
              src={slide.src}
              alt={slide.description ?? 'memory-slide'}
              className="relative z-10 h-full w-full object-contain"
            />
          </button>
        ) : (
          <VideoSlide
            src={slide.src}
            poster={slide.poster}
            isActive={isActive}
            onOpenFullscreen={onOpenFullscreen}
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
