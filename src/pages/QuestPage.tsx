import { useCallback, useEffect, useState } from 'react'; // убрал useState
import { useUnit } from 'effector-react';
import { StepTransition } from '../shared/StepTransition';
import { DefaultStepCard } from '../features/ui/DefaultStepCard';
import { AnswerStepCard } from '../features/ui/AnswerStepCard';
import { CarouselStepCard } from '../features/ui/CarouselStepCard';
import { StartScreen } from '../features/ui/StartScreen';
import { CompletedScreen } from '../features/ui/CompletedScreen';
import { ScreenCard } from '../shared/ScreenCard';
import type { QuestStepId, TQuestButton } from '../features/config/types';
import { INITIAL_STEP_ID } from '../features/config/constants';
import { Loader } from '../shared/Loader';
import {
  // $completedOnce,
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
  // const completedOnce = useUnit($completedOnce);
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
    onQuestStarted();
    onStepChanged(INITIAL_STEP_ID);
  };

  const handleReplay = async () => {
    await unlock();
    play('electro');
    onReplayStarted();
    onQuestStarted();
    onStepChanged(INITIAL_STEP_ID);
  };

  const handleGoToPhotos = async () => {
    await unlock();
    play('click');
    onStepChanged('memories');
    onTogglePathToPhotosFromStartPage(true);
  };

  const handleSecret = async () => {
    await unlock();
    play('click');
    onStepChanged('secret');
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
    await unlock();
    play(soundName);

    if (button.variant === 'error') {
      handleError(true);
      window.setTimeout(() => onStepChanged(button.nextStepId), 600);
      return;
    }

    onStepChanged(button.nextStepId);
  };

  const handleBack =
    'noBackBtn' in currentStep && currentStep.noBackBtn
      ? undefined
      : (prevStepId?: QuestStepId) => {
          if (prevStepId) {
            onStepChanged(prevStepId);
            return;
          }
          if ('prevStepId' in currentStep && currentStep.prevStepId) {
            onStepChanged(currentStep.prevStepId);
            return;
          }
          if (currentStep.id === 'intro') {
            onReplayStarted();
            return;
          }
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
        await unlock();
        play('error');
      }

      handleError(true);

      return;
    }

    handleError(false);

    const successSound = currentStep.successSound ?? 'success';

    if (successSound === 'success') {
      await unlock();
      play('success');
    }

    onAnswerSubmitted();
  };

  if (!init || !ready) return <Loader />;

  console.log('currentstate', currentStep);

  return (
    <main className="safe-screen mx-auto flex w-full max-w-xl items-center px-4">
      <div className="w-full">
        <StepTransition
          stepKey={
            !started
              ? 'start-screen'
              : finished
                ? 'completed-hub'
                : currentStep.id
          }
        >
          <>
            {!started && !finished && <StartScreen onStart={handleStart} />}

            {finished && !started && (
              <CompletedScreen
                onReplay={handleReplay}
                onGoToPhotos={handleGoToPhotos}
                onSecret={handleSecret}
              />
            )}

            {started && currentStep.type === 'default' && (
              <DefaultStepCard
                key={currentStep.id}
                lines={currentStep.lines}
                loadingLines={currentStep.loadingLines}
                buttons={currentStep.buttons}
                onButtonClick={handleDefaultButtonClick}
                onSound={soundTypewriter}
                isError={isAnswerError}
                handleBack={handleBack}
              />
            )}

            {started && currentStep.type === 'answer' && (
              <AnswerStepCard
                key={currentStep.id}
                lines={currentStep.lines}
                hint={currentStep.hint}
                value={currentAnswer}
                submitLabel={currentStep.submitLabel}
                onChange={onAnswerChanged}
                onSubmit={handleAnswerSubmit}
                onSound={soundTypewriter}
                isError={isAnswerError}
                handleBack={handleBack}
              />
            )}

            {currentStep.type === 'carousel' && (
              <CarouselStepCard
                images={currentStep.images}
                buttons={currentStep.buttons}
                onButtonClick={handleDefaultButtonClick}
                handleBack={() => handleBack?.()}
              />
            )}

            {currentStep.type === 'secret' && (
              <ScreenCard
                text="session_complete"
                handleBack={() => handleBack?.('completed')}
              >
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
              </ScreenCard>
            )}
          </>
        </StepTransition>
      </div>
    </main>
  );
}
