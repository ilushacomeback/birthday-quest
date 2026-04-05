import type { INITIAL_STEP_ID } from './constants';

export type SoundName =
  | 'click'
  | 'success'
  | 'error'
  | 'engine'
  | 'electro'
  | 'failedEngine'
  | 'typewriter';

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
  | 'secret'
  | 'joke';

export type QuestButtonVariant = 'default' | 'error';

export type TQuestButton = {
  label: string;
  sound?: SoundName;
  nextStepId: QuestStepId;
  variant?: QuestButtonVariant;
};

export type BaseStep = {
  id: QuestStepId;
  lines: string[];
  loadingLines?: string[];
  prevStepId?: QuestStepId;
  noBackBtn?: boolean
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

type Image = {
  src: string;
  description?: string;
};

export type CarouselStep = {
  id: 'memories';
  type: 'carousel';
  images: Image[];
  buttons: TQuestButton[];
  prevStepId: QuestStepId;
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
