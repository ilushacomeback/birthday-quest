import { QuestButton } from '../../shared/QuestButton';
import clsx from 'clsx';

type BackButtonProps = {
  handleBack: () => void;
  variant?: 'icon' | 'text';
};

export const BackButton = ({
  handleBack,
  variant = 'icon',
}: BackButtonProps) => {
  const isIcon = variant === 'icon';

  return (
    <QuestButton
      onClick={() => handleBack()}
      className={clsx(
        'text-sm flex items-center justify-center',
        isIcon ? 'px-4 py-3 h-full' : 'px-3 py-1.5',
      )}
    >
      {isIcon ? <span className="text-lg leading-none">←</span> : 'Вернуться'}
    </QuestButton>
  );
};
