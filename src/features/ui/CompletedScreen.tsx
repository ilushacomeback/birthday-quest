import { ScreenCard } from '../../shared/ScreenCard';
import { QuestButton } from '../../shared/QuestButton';

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
    <ScreenCard showButtonBack={false}>
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
