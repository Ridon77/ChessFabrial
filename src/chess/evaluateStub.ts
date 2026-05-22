/**
 * Heurística genèrica per finals preparats sense lògica dedicada (Prompt 15).
 * No substitueix motors específics per KBBK, KBNK, etc.
 */
import { Chess, type Move } from 'chess.js';
import {
  edgePenalty,
  findKingSquare,
  isSquareAttacked,
  kingMobility,
  kingsDistance,
} from './evaluationHelpers';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';

function evaluateGenericAttack(after: Chess, move: Move): number {
  let score = 0;
  const blackKing = findKingSquare(after, 'b');

  if (after.inCheck()) {
    score += 300;
  }

  if (blackKing) {
    score -= kingMobility(after, 'b') * 25;
    score += edgePenalty(blackKing) * 4;
  }

  const whiteKing = findKingSquare(after, 'w');
  if (whiteKing && blackKing) {
    score += (8 - kingsDistance(after)) * 8;
  }

  if (move.to && isSquareAttacked(after, move.to) && !move.captured) {
    score -= 1_200;
  }

  return score;
}

/** Avaluació provisional per finals encara no especialitzats. */
export function evaluateStubMove(
  fen: string,
  move: Move,
  _exercise: ExerciseType,
  machineSide: PlayerSide,
): number {
  const game = new Chess(fen);
  const played = game.move(move);
  if (!played) {
    return -Infinity;
  }

  const isAttacking = machineSide === 'white';
  if (!isAttacking) {
    return evaluateGenericAttack(game, move) * 0.5;
  }

  return evaluateGenericAttack(game, move);
}
