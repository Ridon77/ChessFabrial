import { isExerciseFullyImplemented } from './exerciseImplementation';
import { hasLearningTutorial } from './learningTutorials';
import type { TrainingMode } from '../types/TrainingMode';
import type { ExerciseType } from '../types/ExerciseType';

export const DEFAULT_TRAINING_MODE: TrainingMode = 'hard';

export interface TrainingModeAvailability {
  hard: boolean;
  guided: boolean;
  learning: boolean;
}

/** Mode dur: disponible si l'exercici està implementat. */
export function isHardModeAvailable(exercise: ExerciseType): boolean {
  return isExerciseFullyImplemented(exercise);
}

/** Mode guiat: disponible segons exercici (KBNK i KNNK pendents). */
export function isGuidedModeAvailable(exercise: ExerciseType): boolean {
  if (!isExerciseFullyImplemented(exercise)) {
    return false;
  }
  return exercise !== 'KBNK' && exercise !== 'KNNK';
}

/** Mode aprenentatge: disponible només si l'exercici té tutorial definit. */
export function isLearningModeAvailable(exercise: ExerciseType): boolean {
  if (!isExerciseFullyImplemented(exercise)) {
    return false;
  }
  return hasLearningTutorial(exercise);
}

export function getTrainingModeAvailability(
  exercise: ExerciseType,
): TrainingModeAvailability {
  return {
    hard: isHardModeAvailable(exercise),
    guided: isGuidedModeAvailable(exercise),
    learning: isLearningModeAvailable(exercise),
  };
}

export function isTrainingModeAvailable(
  exercise: ExerciseType,
  mode: TrainingMode,
): boolean {
  const availability = getTrainingModeAvailability(exercise);
  return availability[mode];
}
