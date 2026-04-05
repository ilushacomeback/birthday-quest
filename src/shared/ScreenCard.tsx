import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { BackButton } from '../features/ui/BackButton';
import type { QuestStepId } from '../features/config/types';
import { NextButton } from '../features/ui/NextButton';

type ScreenCardProps = PropsWithChildren<{
  className?: string;
  text?: string;
  isError?: boolean;
  handleBack?: (prevStepId?: QuestStepId) => void;
  handleNext?: () => void;
  showButtonBack?: boolean;
}>;

export function ScreenCard({
  children,
  className,
  text,
  isError = false,
  handleBack,
  showButtonBack = true,
  handleNext,
}: ScreenCardProps) {
  return (
    <motion.div
      animate={
        isError
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className={clsx(
        'relative glow w-full rounded-[28px] border bg-black/40 p-5 backdrop-blur-xl transition-colors',
        isError ? 'border-red-400/40' : 'border-white/10',
        className,
      )}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          {showButtonBack && handleBack && (
            <div className="h-14 flex-none">
              <BackButton
                handleBack={handleBack}
                className="h-full leading-none"
              />
            </div>
          )}

          <div
            className={clsx(
              'h-14 flex-1 rounded-2xl border px-4',
              'flex items-center justify-center text-center text-sm leading-none',
              isError
                ? 'border-red-400/20 bg-red-400/5 text-red-300'
                : 'border-green-400/20 bg-green-400/5 text-green-300',
            )}
          >
            <span className="block leading-none">
              quest://{text ?? 'session_active'}
            </span>
          </div>

          {handleNext && (
            <div className="h-14 flex-none">
              <NextButton
                handleNext={handleNext}
                className="h-full leading-none"
              />
            </div>
          )}
        </div>

        {children}
      </div>
    </motion.div>
  );
}