import { QuestButton } from '../../shared/QuestButton';
import { ScreenCard } from '../../shared/ScreenCard';
import type { TQuestButton } from '../config/types';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DefaultLines } from '../../shared/lines/DefaultLines';
import { LoadingLines } from '../../shared/lines/LoadingLines';
import type { TypewriterLinesProps } from '../../shared/lines/TypewriterLines';

type DefaultStepCardProps = {
  lines: string[];
  loadingLines?: string[];
  buttons: TQuestButton[];
  onButtonClick: (button: TQuestButton) => void;
  handleBack?: () => void;
  onSound: TypewriterLinesProps['onSound'];
  isError?: boolean;
  handleNext?: () => void;
};

export function DefaultStepCard({
  lines,
  loadingLines,
  buttons,
  onButtonClick,
  onSound,
  isError,
  handleBack,
  handleNext,
}: DefaultStepCardProps) {
  const [showMainText, setShowMainText] = useState(!loadingLines?.length);
  const [showButtons, setShowButtons] = useState(!lines.length);

  console.log('showButtons', lines, showButtons);

  return (
    <ScreenCard
      isError={isError}
      handleBack={handleBack}
      handleNext={handleNext}
    >
      {loadingLines && (
        <LoadingLines
          lines={loadingLines}
          onComplete={() => setShowMainText(true)}
          onSound={onSound}
        />
      )}
      {showMainText && (
        <DefaultLines
          lines={lines}
          onComplete={() => {
            console.log('complete');
            setShowButtons(true);
          }}
          onSound={onSound}
        />
      )}
      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="flex gap-5">
              {buttons.map((button) => (
                <QuestButton
                  key={`${button.label}-${button.nextStepId}`}
                  onClick={() => onButtonClick(button)}
                  variant={button.variant}
                >
                  {button.label}
                </QuestButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenCard>
  );
}
