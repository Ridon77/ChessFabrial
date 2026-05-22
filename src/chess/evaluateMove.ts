import { Chess, type Move } from 'chess.js';
import { parseSquareCoords } from './boardUtils';
import {
  DRAW_CAPTURE_SCORE,
  DRAW_SCORE,
  MATE_SCORE,
  STALEMATE_SCORE,
  centerDistance,
  edgePenalty,
  findKingSquare,
  isSquareAttacked,
  kingMobility,
  kingsDistance,
} from './evaluationHelpers';
import { evaluateKBBKMove } from './evaluateKBBK';
import { evaluateKBNKMove } from './evaluateKBNK';
import { evaluateKNNKMove } from './evaluateKNNK';
import { evaluateKRRKMove } from './evaluateKRRK';
import { evaluateStubMove } from './evaluateStub';
import { isExerciseFullyImplemented } from '../config/exerciseImplementation';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';

function evaluateDefensiveKing(
  after: Chess,
  machineColor: 'w' | 'b',
): number {
  let score = 0;

  const machineKing = findKingSquare(after, machineColor);
  if (!machineKing) return -10_000;

  if (after.inCheck()) {
    score -= 2_000;
  }

  score += kingMobility(after, machineColor) * 25;
  score -= edgePenalty(machineKing) * 3;
  score += (8 - centerDistance(machineKing)) * 8;
  score += kingsDistance(after) * 12;

  return score;
}

function evaluateKQKDefense(after: Chess, move: Move): number {
  let score = evaluateDefensiveKing(after, 'b');

  if (move.captured === 'q') {
    if (after.isInsufficientMaterial()) {
      return DRAW_CAPTURE_SCORE;
    }
    score += 40_000;
  }

  return score;
}

function evaluateKRKDefense(after: Chess, move: Move): number {
  let score = evaluateDefensiveKing(after, 'b');

  if (move.captured === 'r') {
    if (after.isInsufficientMaterial()) {
      return DRAW_CAPTURE_SCORE;
    }
    score += 40_000;
  }

  return score;
}

function evaluateKQKAttack(after: Chess, move: Move): number {
  let score = 0;
  const blackKing = findKingSquare(after, 'b');
  const whiteKing = findKingSquare(after, 'w');

  if (after.inCheck()) {
    score += 400;
  }

  if (blackKing) {
    score -= kingMobility(after, 'b') * 30;
    score += edgePenalty(blackKing) * 4;
  }

  if (whiteKing && blackKing) {
    const dist = kingsDistance(after);
    if (dist <= 4) {
      score += 15;
    }
  }

  if (move.piece === 'q' && move.to && isSquareAttacked(after, move.to)) {
    score -= 800;
  }

  return score;
}

function evaluateKRKAttack(after: Chess, move: Move): number {
  let score = 0;
  const blackKing = findKingSquare(after, 'b');

  if (after.inCheck()) {
    score += 350;
  }

  if (blackKing) {
    score -= kingMobility(after, 'b') * 28;
    score += edgePenalty(blackKing) * 5;

    const { file, rank } = parseSquareCoords(blackKing);
    if (move.piece === 'r') {
      const rookFile = parseSquareCoords(move.to).file;
      const rookRank = parseSquareCoords(move.to).rank;
      if (rookFile === file || rookRank === rank) {
        score += 60;
      }
    }
  }

  if (move.piece === 'r' && move.to && isSquareAttacked(after, move.to)) {
    score -= 1_500;
  }

  const whiteKing = findKingSquare(after, 'w');
  if (whiteKing && blackKing) {
    score += (8 - kingsDistance(after)) * 10;
  }

  return score;
}

/**
 * Avalua un moviment de la màquina (puntuació més alta = millor).
 */
export function evaluateMove(
  fen: string,
  move: Move,
  exercise: ExerciseType,
  machineSide: PlayerSide,
): number {
  const game = new Chess(fen);
  const played = game.move(move);
  if (!played) {
    return -Infinity;
  }

  const isAttacking = machineSide === 'white';

  if (game.isCheckmate()) {
    return MATE_SCORE;
  }

  if (game.isStalemate()) {
    return isAttacking ? -STALEMATE_SCORE : STALEMATE_SCORE;
  }

  if (game.isInsufficientMaterial() && !isAttacking) {
    return DRAW_SCORE;
  }

  let score = 0;

  if (exercise === 'KQK') {
    score += isAttacking
      ? evaluateKQKAttack(game, move)
      : evaluateKQKDefense(game, move);
  } else if (exercise === 'KRK') {
    score += isAttacking
      ? evaluateKRKAttack(game, move)
      : evaluateKRKDefense(game, move);
  } else if (exercise === 'KRRK') {
    score += evaluateKRRKMove(fen, move, machineSide);
  } else if (exercise === 'KBBK') {
    score += evaluateKBBKMove(fen, move, machineSide);
  } else if (exercise === 'KBNK') {
    score += evaluateKBNKMove(fen, move, machineSide);
  } else if (exercise === 'KNNK') {
    score += evaluateKNNKMove(fen, move, machineSide);
  } else if (!isExerciseFullyImplemented(exercise)) {
    score += evaluateStubMove(fen, move, exercise, machineSide);
  }

  if (isAttacking && game.inCheck()) {
    score += 50;
  }

  return score;
}
