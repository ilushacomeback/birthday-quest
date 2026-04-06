type CarouselControlsProps = {
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export const CarouselControls = ({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: CarouselControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition disabled:opacity-40"
      >
        Назад
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition disabled:opacity-40"
      >
        Дальше
      </button>
    </div>
  );
};
