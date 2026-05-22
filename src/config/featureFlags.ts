import { isExerciseFullyImplemented } from './exerciseImplementation';
import type { ExerciseType } from '../types/ExerciseType';
import { EXERCISE_TYPES } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';
import { PLAYER_SIDES } from '../types/PlayerSide';

/**
 * Opcions visibles a la UI abans de publicar.
 * `showPreparedExercises`: reservat per futurs finals no implementats.
 */
export const FEATURE_FLAGS = {
  showDefenseMode: false,
  showPreparedExercises: false,
} as const;

export const DEFAULT_EXERCISE: ExerciseType = 'KQK';
export const DEFAULT_PLAYER_SIDE: PlayerSide = 'white';

export const VISIBLE_EXERCISE_TYPES = EXERCISE_TYPES.filter((exercise) => {
  if (isExerciseFullyImplemented(exercise)) {
    return true;
  }
  return FEATURE_FLAGS.showPreparedExercises;
});

export const VISIBLE_PLAYER_SIDES = PLAYER_SIDES.filter((side) => {
  if (side === 'black') {
    return FEATURE_FLAGS.showDefenseMode;
  }
  return true;
});

export function normalizeExercise(exercise: ExerciseType): ExerciseType {
  if (!VISIBLE_EXERCISE_TYPES.includes(exercise)) {
    return DEFAULT_EXERCISE;
  }
  return exercise;
}

export function normalizePlayerSide(side: PlayerSide): PlayerSide {
  if (side === 'black' && !FEATURE_FLAGS.showDefenseMode) {
    return DEFAULT_PLAYER_SIDE;
  }
  return side;
}
