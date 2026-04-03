import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import type { QuestButtonVariant } from '../features/config/types';

type QuestButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: QuestButtonVariant;
};

export function QuestButton({
  className,
  children,
  variant = 'default',
  ...props
}: QuestButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'w-full rounded-2xl border px-5 py-4 text-base font-medium backdrop-blur-md transition',
        'active:scale-[0.985] disabled:opacity-50',
        {
          'border-white/10 bg-white/10 text-white hover:bg-white/15':
            variant === 'default',
          'border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500/30':
            variant === 'error',
        },
        className,
      )}
    >
      {children}
    </button>
  );
}
