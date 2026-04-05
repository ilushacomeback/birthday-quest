import { useCallback, useEffect, useState } from 'react'; // убрал useState
import { useUnit } from 'effector-react';
import { StepTransition } from '../shared/StepTransition';
import { DefaultStepCard } from '../features/ui/DefaultStepCard';
import { AnswerStepCard } from '../features/ui/AnswerStepCard';
import { CarouselStepCard } from '../features/ui/CarouselStepCard';
import { StartScreen } from '../features/ui/StartScreen';
import { CompletedScreen } from '../features/ui/CompletedScreen';
import { ScreenCard } from '../shared/ScreenCard';
import type { TQuestButton } from '../features/config/types';
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
  const [isAnswerError, setIsAnswerError] = useState(false);
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

  const { play, ready, unlock } = useQuestAudio();

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

  const handleStart = async () => {
    await unlock();
    play('electro');
    window.setTimeout(() => {
      onQuestStarted();
      onStepChanged(INITIAL_STEP_ID);
    }, 100);
  };

  const handleReplay = async () => {
    await unlock();
    play('electro');
    window.setTimeout(() => {
      onReplayStarted();
      onQuestStarted();
      onStepChanged(INITIAL_STEP_ID);
    }, 100);
  };

  const handleGoToPhotos = async () => {
    await unlock();
    play('click');
    window.setTimeout(() => {
      onStepChanged('memories');
      onTogglePathToPhotosFromStartPage(true);
    }, 100);
  };

  const handleSecret = async () => {
    await unlock();
    play('click');
    window.setTimeout(() => {
      onStepChanged('secret');
    }, 100);
  };

  const soundTypewriter = useCallback(async () => {
    await unlock();
    play('typewriter');
  }, [play, unlock]);

  const handleError = (isError: boolean) => {
    if (isError) {
      setIsAnswerError(true);

      window.setTimeout(() => {
        setIsAnswerError(false);
      }, 450);

      return;
    }

    setIsAnswerError(false);
  };

  const handleDefaultButtonClick = async (button: TQuestButton) => {
    console.log('change step', button);

    handleError(false);

    if (currentStep.id === INITIAL_STEP_ID) {
      onQuestStarted();
    }

    const soundName = button.sound ?? 'click';
    await unlock()
    play(soundName);

    if (button.variant === 'error') {
      handleError(true);
      return;
    }

    window.setTimeout(() => onStepChanged(button.nextStepId), 100);
  };

  const handleAnswerSubmit = async () => {
    if (currentStep.type !== 'answer') return;

    const normalized = normalizeAnswer(currentAnswer);
    const ok = currentStep.acceptedAnswers
      .map(normalizeAnswer)
      .includes(normalized);

    if (!ok) {
      const errorSound = currentStep.errorSound ?? 'error';

      if (errorSound === 'error') {
        await unlock()
        play('error');
      }

      handleError(true);

      return;
    }

    handleError(false);

    const successSound = currentStep.successSound ?? 'success';

    if (successSound === 'success') {
      await unlock()
      play('success');
    }

    window.setTimeout(() => onAnswerSubmitted(), 100);
  };

  if (!init || !ready) return <Loader />;

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
                onSecret={handleSecret}
              />
            )}

            {started && currentStep.type === 'default' && (
              <DefaultStepCard
                lines={currentStep.lines}
                loadingLines={currentStep.loadingLines}
                buttons={currentStep.buttons}
                onButtonClick={handleDefaultButtonClick}
                onSound={soundTypewriter}
                isError={isAnswerError}
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
                onSound={soundTypewriter}
                isError={isAnswerError}
              />
            )}

            {started && currentStep.type === 'carousel' && (
              <CarouselStepCard
                images={currentStep.images}
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
