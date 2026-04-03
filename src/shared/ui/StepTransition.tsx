import { AnimatePresence, motion } from 'motion/react';
import type { PropsWithChildren } from 'react';

type StepTransitionProps = PropsWithChildren<{
  stepKey: string;
}>;

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 56, scale: 0.98, filter: 'blur(8px)' }}
        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: -56, scale: 0.96, filter: 'blur(6px)' }}
        transition={{
          duration: 0.34,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
