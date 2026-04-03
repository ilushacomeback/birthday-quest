import { ScreenCard } from '../../../shared/ui/ScreenCard';
import { QuestButton } from '../../../shared/ui/QuestButton';

type CompletedHubScreenProps = {
  onReplay: () => void;
  onGoToPhotos: () => void;
  onSecret: () => void;
};

export const CompletedScreen = ({
  onReplay,
  onGoToPhotos,
  onSecret,
}: CompletedHubScreenProps) => {
  return (
    <ScreenCard text='scan_completed'>
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-white">
          Сканирование уже проводилось
        </div>
        <div className="text-zinc-300">
          Система обнаружила завершённую сессию. Выбери, что делать дальше.
        </div>
      </div>

      <div className="space-y-3">
        <QuestButton onClick={onReplay}>
          Начать повторное сканирование
        </QuestButton>
        <QuestButton onClick={onGoToPhotos}>Перейти к фото</QuestButton>
        <QuestButton onClick={onSecret}>Секрет</QuestButton>
      </div>
    </ScreenCard>
  );
};
