import { applyInitialMachineTurn } from './gameFlow';
import { resetExerciseSession } from './resetExerciseSession';
import type { GameStatus } from '../types/ChessTypes';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';

export interface SessionUiState {
  exercise: ExerciseType;
  playerSide: PlayerSide;
  fen: string;
  status: GameStatus;
  drawReason: string | null;
  playerMoveCount: number;
}

/** Prepara l'estat inicial d'una sessió (posició + torn de màquina si cal). */
export function bootstrapSession(
  exercise: ExerciseType,
  playerSide: PlayerSide,
): SessionUiState {
  const session = resetExerciseSession(exercise);
  const flow = applyInitialMachineTurn(session.fen, exercise, playerSide);

  return {
    exercise,
    playerSide,
    fen: flow.snapshot.fen,
    status: flow.snapshot.status,
    drawReason: flow.snapshot.drawReason,
    playerMoveCount: 0,
  };
}
