import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

type ScreenCardProps = PropsWithChildren<{
  className?: string;
  text: string
}>;

export function ScreenCard({ children, className, text }: ScreenCardProps) {
  return (
    <div
      className={clsx(
        'glow w-full rounded-[28px] border border-white/10 bg-black/40 p-5 backdrop-blur-xl',
        className,
      )}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-sm text-green-300">
          birthday-quest://{text}
        </div>
        {children}
      </div>
    </div>
  );
}
