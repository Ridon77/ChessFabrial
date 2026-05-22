import { Chess } from 'chess.js';
import { evaluateMove } from './evaluateMove';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';

export interface MachineMoveInput {
  fen: string;
  exercise: ExerciseType;
  machineSide: PlayerSide;
}

/**
 * Tria i executa el millor moviment legal de la màquina segons heurística.
 */
export function machineMove({
  fen,
  exercise,
  machineSide,
}: MachineMoveInput): string | null {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });

  if (moves.length === 0) {
    return null;
  }

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const score = evaluateMove(fen, move, exercise, machineSide);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  game.move(bestMove);
  return game.fen();
}
