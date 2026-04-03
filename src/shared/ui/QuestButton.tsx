import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type QuestButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function QuestButton({
  className,
  children,
  ...props
}: QuestButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-base font-medium text-white backdrop-blur-md transition',
        'active:scale-[0.985] disabled:opacity-50',
        'hover:bg-white/15',
        className,
      )}
    >
      {children}
    </button>
  );
}
