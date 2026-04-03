import { createEvent, createStore, sample } from 'effector';
import { questStepsMap } from '../features/quest/config/steps';
import type { QuestStepId } from '../features/quest/config/types';
import { INITIAL_STEP_ID, STORAGE_KEY } from '../features/quest/config/constants';



type QuestState = {
  currentStepId: QuestStepId;
  answers: Partial<Record<QuestStepId, string>>;
  started: boolean;
  finished: boolean;
  completedOnce: boolean;
  init: boolean;
  pathToPhotosFromStartPage: boolean;
};



const defaultState: QuestState = {
  currentStepId: INITIAL_STEP_ID,
  answers: {},
  started: false,
  finished: false,
  completedOnce: false,
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

    return {
      currentStepId:
        typeof currentStepId === 'string' && isQuestStepId(currentStepId)
          ? currentStepId
          : INITIAL_STEP_ID,
      answers: parsed.answers ?? {},
      started: parsed.started ?? false,
      finished: parsed.finished ?? false,
      completedOnce: parsed.completedOnce ?? false,
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
export const stepChanged = createEvent<QuestStepId>();
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
    console.log('started', nextState);
    return nextState;
  })
  .on(stepChanged, (state, nextStepId) => {
    const isFinished = nextStepId === 'completed';

    console.log('state', state);

    const nextState = {
      ...state,
      currentStepId: nextStepId,
      started: true,
      finished: isFinished,
      completedOnce: state.completedOnce || isFinished,
      pathToPhotosFromStartPage: false,
    };

    persistState(nextState);
    return nextState;
  })
  .on(togglePathToPhotosFromStartPage, (state, pathToPhotosFromStartPage) => {
    console.log('state', state, pathToPhotosFromStartPage);

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
      finished: false,
    };

    persistState(nextState);
    return nextState;
  });

export const $currentStep = $quest.map(
  (state) => questStepsMap[state.currentStepId],
);

export const $currentAnswer = $quest.map(
  (state) => state.answers[state.currentStepId] ?? '',
);

export const $started = $quest.map((state) => state.started);
export const $finished = $quest.map((state) => state.finished);
export const $completedOnce = $quest.map((state) => state.completedOnce);
export const $init = $quest.map((state) => state.init);
export const $pathToPhotosFromStartPage = $quest.map((state) => state.pathToPhotosFromStartPage);

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
