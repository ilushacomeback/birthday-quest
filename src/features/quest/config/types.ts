import type { INITIAL_STEP_ID } from "./constants";


export type QuestStepId =
  | typeof INITIAL_STEP_ID
  | 'beer-question'
  | 'beer-found'
  | 'car-question'
  | 'car-found'
  | 'debt-question'
  | 'debt-found'
  | 'engine-start'
  | 'memories'
  | 'carpet-question'
  | 'final'
  | 'completed'
  | 'secret';

export type TQuestButton = {
  label: string;
  sound?: string;
  nextStepId: QuestStepId;
};

export type BaseStep = {
  id: QuestStepId;
  lines: string[];
  loadingLines?: string[];
};

export type DefaultStep = BaseStep & {
  type: 'default';
  buttons: TQuestButton[];
};

export type AnswerStep = BaseStep & {
  type: 'answer';
  hint?: string;
  acceptedAnswers: string[];
  submitLabel: string;
  successSound?: string;
  errorSound?: string;
  nextStepId: QuestStepId;
};

export type CarouselStep = {
  id: 'memories';
  type: 'carousel';
  images: string[];
  captions: string[];
  buttons: TQuestButton[];
};

export type CompletedStep = {
  id: 'completed';
  type: 'completed';
};

export type SecretStep = {
  id: 'secret';
  type: 'secret';
  lines: string[];
};

export type QuestStep =
  | DefaultStep
  | AnswerStep
  | CarouselStep
  | CompletedStep
  | SecretStep;
