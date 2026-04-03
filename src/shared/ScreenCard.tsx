import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';

type ScreenCardProps = PropsWithChildren<{
  className?: string;
  text: string;
  isError?: boolean;
}>;

export function ScreenCard({
  children,
  className,
  text,
  isError = false,
}: ScreenCardProps) {
  return (
    <motion.div
      animate={
        isError
          ? {
              x: [0, -8, 8, -6, 6, -3, 3, 0],
            }
          : { x: 0 }
      }
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className={clsx(
        'glow w-full rounded-[28px] border bg-black/40 p-5 backdrop-blur-xl transition-colors',
        isError ? 'border-red-400/40' : 'border-white/10',
        className,
      )}
    >
      <div className="space-y-5">
        <div
          className={[
            'rounded-2xl border px-4 py-3 text-sm transition-colors',
            isError
              ? 'border-red-400/20 bg-red-400/5 text-red-300'
              : 'border-green-400/20 bg-green-400/5 text-green-300',
          ].join(' ')}
        >
          birthday-quest://{text}
        </div>
        {children}
      </div>
    </motion.div>
  );
}
