import { useEffect } from 'react'; // убрал useState
import { useUnit } from 'effector-react';
import { StepTransition } from '../shared/StepTransition';
import { DefaultStepCard } from '../features/ui/DefaultStepCard';
import { AnswerStepCard } from '../features/ui/AnswerStepCard';
import { CarouselStepCard } from '../features/ui/CarouselStepCard';
import { StartScreen } from '../features/ui/StartScreen';
import { CompletedScreen } from '../features/ui/CompletedScreen';
import { ScreenCard } from '../shared/ScreenCard';
import type { QuestStepId } from '../features/config/types';
import { INITIAL_STEP_ID } from '../features/config/constants';
import { Loader } from '../shared/Loader';
import { BackButton } from '../features/ui/BackButton';
import {
  $completedOnce,
  $currentAnswer,
  $currentStep,
  $finished,
  $init,
  $started,
  answerChanged,
  answerSubmitted,
  appStarted,
  questStarted,
  replayStarted,
  stepChanged,
  togglePathToPhotosFromStartPage,
} from '../model/quest';
import { useQuestAudio } from '../hooks/useQuestAudio'; // импортируем хук

export function QuestPage() {
  const currentStep = useUnit($currentStep);
  const currentAnswer = useUnit($currentAnswer);
  const started = useUnit($started);
  const finished = useUnit($finished);
  const completedOnce = useUnit($completedOnce);
  const init = useUnit($init);

  const onAppStarted = useUnit(appStarted);
  const onQuestStarted = useUnit(questStarted);
  const onReplayStarted = useUnit(replayStarted);
  const onStepChanged = useUnit(stepChanged);
  const onAnswerChanged = useUnit(answerChanged);
  const onAnswerSubmitted = useUnit(answerSubmitted);
  const onTogglePathToPhotosFromStartPage = useUnit(
    togglePathToPhotosFromStartPage,
  );

  // Используем аудио хук
  const { play } = useQuestAudio();

  useEffect(() => {
    onAppStarted();
  }, [onAppStarted]);

  const normalizeAnswer = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replaceAll('ё', 'е')
      .replace(/[.,!?;:;"'`()-]/g, '')
      .replace(/\s+/g, ' ');

  const handleStart = () => {
    play('electro'); // Мгновенно, без await и init
    onQuestStarted();
    onStepChanged(INITIAL_STEP_ID);
  };

  const handleReplay = () => {
    play('electro');
    onReplayStarted();
    onQuestStarted();
    onStepChanged(INITIAL_STEP_ID);
  };

  const handleGoToPhotos = () => {
    play('electro');
    onStepChanged('memories');
    onTogglePathToPhotosFromStartPage(true);
  };

  const handleDefaultButtonClick = (button: {
    label: string;
    sound?: string;
    nextStepId: QuestStepId;
  }) => {
    console.log('change step', button);

    if (currentStep.id === INITIAL_STEP_ID) {
      onQuestStarted();
    }

    const soundName = button.sound ?? 'click';
    if (
      soundName === 'click' ||
      soundName === 'success' ||
      soundName === 'error' ||
      soundName === 'engine' ||
      soundName === 'electro'
    ) {
      play(soundName);
    } else {
      play('click')
    }

    onStepChanged(button.nextStepId);
  };

  const handleAnswerSubmit = () => {
    if (currentStep.type !== 'answer') return;

    const normalized = normalizeAnswer(currentAnswer);
    const ok = currentStep.acceptedAnswers
      .map(normalizeAnswer)
      .includes(normalized);

    if (!ok) {
      const errorSound = currentStep.errorSound ?? 'error';
      if (errorSound === 'error') {
        play('error');
      }
      return;
    }

    const successSound = currentStep.successSound ?? 'success';
    if (successSound === 'success') {
      play('success');
    }
    onAnswerSubmitted();
  };

  if (!init) return <Loader />;

  console.log('currentstate', currentStep);

  return (
    <main className="safe-screen mx-auto flex w-full max-w-xl items-center px-4">
      <div className="w-full">
        <StepTransition
          stepKey={
            !started && !completedOnce
              ? 'start-screen'
              : finished && completedOnce
                ? 'completed-hub'
                : currentStep.id
          }
        >
          <>
            {!started && !completedOnce && (
              <StartScreen onStart={handleStart} />
            )}

            {finished && completedOnce && (
              <CompletedScreen
                onReplay={handleReplay}
                onGoToPhotos={handleGoToPhotos}
                onSecret={() => onStepChanged('secret')}
              />
            )}

            {started && currentStep.type === 'default' && (
              <DefaultStepCard
                lines={currentStep.lines}
                loadingLines={currentStep.loadingLines}
                buttons={currentStep.buttons}
                onButtonClick={handleDefaultButtonClick}
              />
            )}

            {started && currentStep.type === 'answer' && (
              <AnswerStepCard
                lines={currentStep.lines}
                hint={currentStep.hint}
                value={currentAnswer}
                submitLabel={currentStep.submitLabel}
                onChange={onAnswerChanged}
                onSubmit={handleAnswerSubmit}
              />
            )}

            {started && currentStep.type === 'carousel' && (
              <CarouselStepCard
                images={currentStep.images}
                captions={currentStep.captions}
                buttons={currentStep.buttons}
                onButtonClick={handleDefaultButtonClick}
              />
            )}

            {started && currentStep.type === 'secret' && (
              <ScreenCard text="session_complete">
                <div className="space-y-2 text-zinc-100">
                  {currentStep.lines.map((line, index) => (
                    <div
                      key={`${index}-${line}`}
                      className="whitespace-pre-wrap"
                    >
                      {line}
                    </div>
                  ))}
                </div>
                <BackButton onButtonClick={handleDefaultButtonClick} />
              </ScreenCard>
            )}
          </>
        </StepTransition>
      </div>
    </main>
  );
}
