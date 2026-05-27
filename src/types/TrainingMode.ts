export type TrainingMode = 'hard' | 'guided' | 'learning';

export const TRAINING_MODES: readonly TrainingMode[] = [
  'hard',
  'guided',
  'learning',
] as const;
