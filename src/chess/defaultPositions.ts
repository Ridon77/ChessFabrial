import type { ExerciseType } from '../types/ExerciseType';

/** Posicions segures per defecte. Torn blanques. */
export const DEFAULT_EXERCISE_FENS: Record<ExerciseType, string> = {
  KQK: '4k3/8/8/8/8/8/3QK2/8 w - - 0 1',
  KRK: '4k3/8/8/8/8/8/R3K3/8 w - - 0 1',
  KRRK: '4k3/8/8/8/8/8/R3K1R/8 w - - 0 1',
  KBBK: '4k3/8/8/8/8/4BB2/4K3/8 w - - 0 1',
  KBNK: '4k3/8/8/8/8/3NBK2/8/8 w - - 0 1',
  KNNK: '4k3/8/8/8/8/3NNK2/8/8 w - - 0 1',
};
