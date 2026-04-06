import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { AnimatePresence, motion } from 'motion/react';
import { QuestButton } from '../../shared/QuestButton';
import { ScreenCard } from '../../shared/ScreenCard';
import { DefaultLines } from '../../shared/lines/DefaultLines';
import type { TypewriterLinesProps } from '../../shared/lines/TypewriterLines';

type AnswerStepCardProps = {
  lines: string[];
  hint?: string;
  value: string;
  submitLabel: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSound: TypewriterLinesProps['onSound'];
  isError?: boolean;
  handleBack?: () => void
  handleNext?: () => void
};

export function AnswerStepCard({
  lines,
  hint,
  value,
  submitLabel,
  onChange,
  onSubmit,
  onSound,
  isError,
  handleBack,
  handleNext
}: AnswerStepCardProps) {
  const [showInput, setShowInput] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    if (!isHintOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!hintRef.current) return;

      const target = event.target as Node | null;

      if (target && !hintRef.current.contains(target)) {
        setIsHintOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isHintOpen]);

  return (
    <ScreenCard
      isError={isError}
      handleBack={handleBack}
      handleNext={handleNext}
    >
      <DefaultLines
        lines={lines}
        onComplete={() => setShowInput(true)}
        onSound={onSound}
      />
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="flex items-center">
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Введи ответ..."
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full h-14.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-green-400/40"
                />

                {hint && (
                  <div ref={hintRef} className="relative ml-2 shrink-0">
                    <button
                      type="button"
                      aria-label="Показать подсказку"
                      aria-expanded={isHintOpen}
                      onClick={() => setIsHintOpen((prev) => !prev)}
                      className="flex h-14.5 w-14.5 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 active:scale-[0.98]"
                    >
                      <HiOutlineLightBulb size={26} />
                    </button>

                    <AnimatePresence>
                      {isHintOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute right-0 top-[calc(100%+12px)] z-20 w-64"
                        >
                          <div className="relative rounded-2xl border border-green-400/20 bg-zinc-950/95 px-4 py-3 text-sm leading-6 text-zinc-200 shadow-2xl backdrop-blur-xl">
                            <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-green-400/20 bg-zinc-950/95" />

                            <div className="relative">
                              <div className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-green-300">
                                Подсказка
                              </div>

                              <div>{hint}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              <QuestButton type="submit" variant="default">
                {submitLabel}
              </QuestButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenCard>
  );
}
