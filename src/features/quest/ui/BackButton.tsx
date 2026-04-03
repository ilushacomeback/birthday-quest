import { QuestButton } from '../../../shared/ui/QuestButton';
import type { TQuestButton } from '../config/types';

export const BackButton = ({
  onButtonClick,
}: {
  onButtonClick: (button: TQuestButton) => void;
}) => {
  return (
    <QuestButton
      onClick={() =>
        onButtonClick({
          label: 'Вернуться',
          nextStepId: 'completed',
        })
      }
    >
      Вернуться
    </QuestButton>
  );
};
