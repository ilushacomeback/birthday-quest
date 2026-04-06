import { createEvent, createStore, sample } from 'effector';
import { questStepsMap } from '../features/config/steps';
import type { QuestStepId, TQuestButton } from '../features/config/types';
import { INITIAL_STEP_ID, STORAGE_KEY } from '../features/config/constants';

type QuestState = {
  currentStepId: QuestStepId;
  prevStepId: QuestStepId | null;
  answers: Partial<Record<QuestStepId, string>>;
  started: boolean;
  finished: boolean;
  init: boolean;
  pathToPhotosFromStartPage: boolean;
};

const defaultState: QuestState = {
  currentStepId: INITIAL_STEP_ID,
  prevStepId: null,
  answers: {},
  started: false,
  finished: false,
  init: false,
  pathToPhotosFromStartPage: false,
};

const normalizeAnswer = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/[.,!?;:;"'`()-]/g, '')
    .replace(/\s+/g, ' ');

const isQuestStepId = (value: string): value is QuestStepId => {
  return value in questStepsMap;
};

const loadState = (): QuestState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return { ...defaultState, init: true };

    const parsed = JSON.parse(raw) as Partial<QuestState>;
    const currentStepId = parsed.currentStepId;
    const prevStepId = parsed.prevStepId;

    return {
      currentStepId:
        typeof currentStepId === 'string' && isQuestStepId(currentStepId)
          ? currentStepId
          : INITIAL_STEP_ID,
      prevStepId:
        typeof prevStepId === 'string' && isQuestStepId(prevStepId)
          ? prevStepId
          : null,
      answers: parsed.answers ?? {},
      started: parsed.started ?? false,
      finished: parsed.finished ?? false,
      pathToPhotosFromStartPage: parsed.pathToPhotosFromStartPage ?? false,
      init: true,
    };
  } catch {
    return defaultState;
  }
};

const persistState = (state: QuestState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    //
  }
};

export const appStarted = createEvent();
export const questStarted = createEvent();
export const stepChanged = createEvent<TQuestButton['nextStepId']>();
export const answerChanged = createEvent<string>();
export const answerSubmitted = createEvent();
export const questReset = createEvent();
export const replayStarted = createEvent();
export const togglePathToPhotosFromStartPage = createEvent<boolean>();

export const $quest = createStore<QuestState>(defaultState)
  .on(appStarted, () => loadState())
  .on(questStarted, (state) => {
    const nextState = { ...state, started: true };
    persistState(nextState);
    return nextState;
  })
  .on(stepChanged, (state, nextStepId) => {
    const currentStepId = nextStepId;

    const isFinished = currentStepId === 'completed';

    const nextState = {
      ...state,
      prevStepId: state.currentStepId,
      currentStepId: currentStepId,
      started: !isFinished,
      finished: isFinished ? true : state.finished,
      pathToPhotosFromStartPage: false,
    };

    persistState(nextState);
    return nextState;
  })
  .on(togglePathToPhotosFromStartPage, (state, pathToPhotosFromStartPage) => {
    const nextState = {
      ...state,
      pathToPhotosFromStartPage,
    };

    persistState(nextState);
    return nextState;
  })
  .on(answerChanged, (state, answer) => {
    const nextState = {
      ...state,
      answers: {
        ...state.answers,
        [state.currentStepId]: answer,
      },
    };

    persistState(nextState);
    return nextState;
  })
  .on(replayStarted, (state) => {
    const nextState = {
      ...state,
      currentStepId: INITIAL_STEP_ID,
      answers: {},
      started: false,
    };

    persistState(nextState);
    return nextState;
  });

export const $currentStep = $quest.map(
  (state) => questStepsMap[state.currentStepId],
);
export const $prevStep = $quest.map(
  (state) => state.prevStepId && questStepsMap[state.prevStepId],
);

export const $currentAnswer = $quest.map(
  (state) => state.answers[state.currentStepId] ?? '',
);

export const $started = $quest.map((state) => state.started);
export const $finished = $quest.map((state) => state.finished);
export const $init = $quest.map((state) => state.init);
export const $pathToPhotosFromStartPage = $quest.map(
  (state) => state.pathToPhotosFromStartPage,
);

sample({
  clock: answerSubmitted,
  source: $quest,
  filter: (state) => {
    const currentStep = questStepsMap[state.currentStepId];

    if (currentStep.type !== 'answer') return false;

    const currentAnswer = normalizeAnswer(
      state.answers[state.currentStepId] ?? '',
    );

    return currentStep.acceptedAnswers
      .map(normalizeAnswer)
      .includes(currentAnswer);
  },
  fn: (state) => {
    const currentStep = questStepsMap[state.currentStepId];

    if (currentStep.type !== 'answer') return INITIAL_STEP_ID;

    return currentStep.nextStepId;
  },
  target: stepChanged,
});
