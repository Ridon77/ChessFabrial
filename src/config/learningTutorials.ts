import { EXERCISE_TYPES } from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';
import type { LearningTutorial } from '../types/LearningTutorial';

function emptyTutorial(exerciseType: ExerciseType): LearningTutorial {
  return {
    exerciseType,
    steps: [],
  };
}

/**
 * Registre de tutorials per exercici.
 * De moment tots els finals tenen `steps: []` (mode aprenentatge pendent).
 */
export const LEARNING_TUTORIALS: Record<ExerciseType, LearningTutorial> =
  Object.fromEntries(
    EXERCISE_TYPES.map((exercise) => [exercise, emptyTutorial(exercise)]),
  ) as Record<ExerciseType, LearningTutorial>;

export function getLearningTutorial(
  exercise: ExerciseType,
): LearningTutorial {
  return LEARNING_TUTORIALS[exercise];
}

/** Tutorial definit i amb almenys un pas interactiu. */
export function hasLearningTutorial(exercise: ExerciseType): boolean {
  return getLearningTutorial(exercise).steps.length > 0;
}
