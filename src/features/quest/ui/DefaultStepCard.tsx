import { QuestButton } from '../../../shared/ui/QuestButton';
import { ScreenCard } from '../../../shared/ui/ScreenCard';
import type { QuestStepId } from '../config/types';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DefaultLines } from '../../../shared/ui/lines/DefaultLines';
import { LoadingLines } from '../../../shared/ui/lines/LoadingLines';

type QuestButtonModel = {
  label: string;
  sound?: string;
  nextStepId: QuestStepId;
};

type DefaultStepCardProps = {
  lines: string[];
  loadingLines?: string[];
  buttons: QuestButtonModel[];
  onButtonClick: (button: QuestButtonModel) => void;
};

export function DefaultStepCard({
  lines,
  loadingLines,
  buttons,
  onButtonClick,
}: DefaultStepCardProps) {
  const [showMainText, setShowMainText] = useState(!loadingLines?.length);
  const [showButtons, setShowButtons] = useState(!lines.length);

  return (
    <ScreenCard text='memory_session_active'>
      {loadingLines && (
        <LoadingLines
          lines={loadingLines}
          onComplete={() => setShowMainText(true)}
        />
      )}
      {showMainText && (
        <DefaultLines lines={lines} onComplete={() => setShowButtons(true)} />
      )}
      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="space-y-3">
              {buttons.map((button) => (
                <QuestButton
                  key={`${button.label}-${button.nextStepId}`}
                  onClick={() => onButtonClick(button)}
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
