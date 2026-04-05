import { ScreenCard } from '../../shared/ScreenCard';
import { QuestButton } from '../../shared/QuestButton';

type StartScreenProps = {
  onStart: () => void;
};

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <ScreenCard text="scanner_idle" showButtonBack={false}>
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-white">Квест</div>
        <div className="text-zinc-300">
          Система готова к запуску. Нажми кнопку ниже, чтобы начать сканирование
          и открыть путешествие в светлое прошлое.
        </div>
      </div>
      <QuestButton onClick={onStart}>Начать сканирование</QuestButton>
    </ScreenCard>
  );
};
