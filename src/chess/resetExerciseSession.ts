import { createRandomPosition } from './createRandomPosition';
import type { GameStatus } from '../types/ChessTypes';
import type { ExerciseType } from '../types/ExerciseType';

export interface ExerciseSessionState {
  fen: string;
  status: GameStatus;
}

/** Reinicia l'exercici i genera una posició (torn blanques). */
export function resetExerciseSession(exercise: ExerciseType): ExerciseSessionState {
  const fen = createRandomPosition(exercise);
  return {
    fen,
    status: 'playing',
  };
}
