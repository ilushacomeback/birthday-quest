import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { audioManager } from '../model/audio';
import { StepTransition } from '../shared/ui/StepTransition';
import { DefaultStepCard } from '../features/quest/ui/DefaultStepCard';
import { AnswerStepCard } from '../features/quest/ui/AnswerStepCard';
import { CarouselStepCard } from '../features/quest/ui/CarouselStepCard';
import { StartScreen } from '../features/quest/ui/StartScreen';
import { CompletedScreen } from '../features/quest/ui/CompletedScreen';
import { ScreenCard } from '../shared/ui/ScreenCard';
import type { QuestStepId } from '../features/quest/config/types';
import { INITIAL_STEP_ID } from '../features/quest/config/constants';
import { Loader } from '../shared/ui/Loader';
import { BackButton } from '../features/quest/ui/BackButton';
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
import click from '../assets/sounds/click.mp3'
import electro from '../assets/sounds/electro.mp3'
import engine from '../assets/sounds/engine.mp3'
import error from '../assets/sounds/error.mp3'
import success from '../assets/sounds/success.mp3'

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

  useEffect(() => {
    onAppStarted();

    audioManager.registerMany([
      { name: 'click', src: click },
      { name: 'success', src: success },
      { name: 'error', src: error },
      { name: 'engine', src: engine },
      { name: 'electro', src: electro },
    ]);
  }, [onAppStarted]);

  const normalizeAnswer = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replaceAll('ё', 'е')
      .replace(/[.,!?;:;"'`()-]/g, '')
      .replace(/\s+/g, ' ');

  const handleStart = async () => {
    onQuestStarted();
    // await audioManager.unlock();
    await audioManager.play('electro');
    onStepChanged(INITIAL_STEP_ID);
  };

  const handleReplay = async () => {
    onReplayStarted();
    // await audioManager.unlock();
    await audioManager.play('electro');
    onQuestStarted();
    onStepChanged(INITIAL_STEP_ID);
  };

  const handleGoToPhotos = () => {
    onStepChanged('memories');
    onTogglePathToPhotosFromStartPage(true);
  };

  const handleDefaultButtonClick = async (button: {
    label: string;
    sound?: string;
    nextStepId: QuestStepId;
  }) => {
    console.log('change step', button);
    if (currentStep.id === INITIAL_STEP_ID) {
      onQuestStarted();
      // await audioManager.unlock();
    }

    await audioManager.play(button.sound ?? 'click');
    onStepChanged(button.nextStepId);
  };

  const handleAnswerSubmit = async () => {
    if (currentStep.type !== 'answer') return;

    const normalized = normalizeAnswer(currentAnswer);

    const ok = currentStep.acceptedAnswers
      .map(normalizeAnswer)
      .includes(normalized);

    if (!ok) {
      await audioManager.play(currentStep.errorSound ?? 'error');
      return;
    }

    await audioManager.play(currentStep.successSound ?? 'success');
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
