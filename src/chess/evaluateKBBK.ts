/**
 * Heurística per al final KBBK (Rei + dos alfils vs Rei).
 * Limitacions: no modela el mat de dos alfils en profunditat ni totes les diagonals.
 */
import { Chess, type Move } from 'chess.js';
import { parseSquareCoords } from './boardUtils';
import {
  centerDistance,
  edgePenalty,
  findKingSquare,
  findPieceSquares,
  kingMobility,
  kingsDistance,
  movedPieceIsHanging,
} from './evaluationHelpers';
import type { PlayerSide } from '../types/PlayerSide';

const HANGING_BISHOP_PENALTY = 2_200;
const CHECK_BONUS = 360;
const DIAGONAL_BONUS = 55;
const CORNER_PENALTY_ATTACK = 50;

function onSameDiagonal(squareA: string, squareB: string): boolean {
  const a = parseSquareCoords(squareA);
  const b = parseSquareCoords(squareB);
  return Math.abs(a.file - b.file) === Math.abs(a.rank - b.rank);
}

function isCornerSquare(square: string): boolean {
  const { file, rank } = parseSquareCoords(square);
  const rankIndex = rank - 1;
  return (
    (file === 0 || file === 7) && (rankIndex === 0 || rankIndex === 7)
  );
}

function bishopDiagonalPressure(
  bishops: string[],
  targetKing: string,
): number {
  let score = 0;
  for (const bishop of bishops) {
    if (onSameDiagonal(bishop, targetKing)) {
      score += DIAGONAL_BONUS;
    }
  }
  return score;
}

function kingNearBishopDiagonal(
  king: string,
  bishops: string[],
): number {
  let penalty = 0;
  for (const bishop of bishops) {
    if (onSameDiagonal(king, bishop)) {
      penalty += 35;
    }
  }
  return penalty;
}

function evaluateKBBKAttack(after: Chess, move: Move): number {
  let score = 0;
  const blackKing = findKingSquare(after, 'b');
  const whiteKing = findKingSquare(after, 'w');
  const whiteBishops = findPieceSquares(after, 'w', 'b');

  if (after.inCheck()) {
    score += CHECK_BONUS;
    if (blackKing && kingMobility(after, 'b') > 2) {
      score -= 100;
    }
  }

  if (blackKing) {
    score -= kingMobility(after, 'b') * 30;
    score += edgePenalty(blackKing) * 7;
    if (isCornerSquare(blackKing)) {
      score += CORNER_PENALTY_ATTACK;
    }
    score += bishopDiagonalPressure(whiteBishops, blackKing);
  }

  if (move.piece === 'b' && movedPieceIsHanging(after, move) && !move.captured) {
    score -= HANGING_BISHOP_PENALTY;
  }

  if (whiteKing && blackKing) {
    score += (8 - kingsDistance(after)) * 14;
    score += kingMobility(after, 'w') * 8;
  }

  return score;
}

function evaluateKBBKDefense(after: Chess, move: Move): number {
  const blackKing = findKingSquare(after, 'b');
  const whiteKing = findKingSquare(after, 'w');
  if (!blackKing) return -10_000;

  let score = 0;
  const whiteBishops = findPieceSquares(after, 'w', 'b');

  if (after.inCheck()) {
    score -= 2_000;
  }

  score += kingMobility(after, 'b') * 28;
  score -= edgePenalty(blackKing) * 5;
  score += (8 - centerDistance(blackKing)) * 10;

  if (isCornerSquare(blackKing)) {
    score -= 80;
  }

  if (whiteKing) {
    score += kingsDistance(after) * 8;
  }

  score -= kingNearBishopDiagonal(blackKing, whiteBishops);

  if (move.piece === 'k') {
    score += kingMobility(after, 'b') * 10;
  }

  return score;
}

/** Avalua un moviment de la màquina al final KBBK. */
export function evaluateKBBKMove(
  fen: string,
  move: Move,
  machineSide: PlayerSide,
): number {
  const game = new Chess(fen);
  const played = game.move(move);
  if (!played) {
    return -Infinity;
  }

  if (machineSide === 'white') {
    return evaluateKBBKAttack(game, move);
  }

  return evaluateKBBKDefense(game, move);
}
