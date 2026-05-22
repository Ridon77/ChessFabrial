import type { ExerciseType } from '../types/ExerciseType';

/** Finals amb generació de posicions i heurística de màquina completes. */
export const FULLY_IMPLEMENTED_EXERCISES: readonly ExerciseType[] = [
  'KQK',
  'KRK',
  'KRRK',
  'KBBK',
  'KBNK',
  'KNNK',
] as const;

export function isExerciseFullyImplemented(
  exercise: ExerciseType,
): exercise is (typeof FULLY_IMPLEMENTED_EXERCISES)[number] {
  return (FULLY_IMPLEMENTED_EXERCISES as readonly ExerciseType[]).includes(
    exercise,
  );
}
