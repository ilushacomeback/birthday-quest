import clsx from 'clsx';

type LoaderProps = {
  text?: string;
  className?: string;
};

export const Loader = ({ text = 'Загрузка...', className }: LoaderProps) => {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Спиннер */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border border-green-400/20" />

          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-green-400" />

          <div className="absolute inset-[6px] animate-spin rounded-full border border-transparent border-t-green-300 [animation-duration:1.4s]" />
        </div>

        {/* Текст */}
        <div className="text-sm tracking-[0.15em] text-green-300">{text}</div>
      </div>
    </div>
  );
};
