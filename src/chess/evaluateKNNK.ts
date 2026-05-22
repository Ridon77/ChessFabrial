/**
 * Heurística per al final KNNK (Rei + dos cavalls vs Rei).
 * Mode especial: el mat no és forçable; la màquina busca coordinació i ofegat, no perfecció.
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
import { isCornerSquare } from './kbnkPosition';
import type { PlayerSide } from '../types/PlayerSide';

const CHECK_BONUS = 320;
const KNIGHT_COORDINATION_BONUS = 45;
const HANGING_KNIGHT_PENALTY = 1_800;
const CORNER_BONUS_ATTACK = 55;

function knightsPressureOnKing(knights: string[], king: string): number {
  const k = parseSquareCoords(king);
  let score = 0;

  for (const knight of knights) {
    const n = parseSquareCoords(knight);
    const dist = Math.max(Math.abs(n.file - k.file), Math.abs(n.rank - k.rank));
    if (dist <= 4) {
      score += KNIGHT_COORDINATION_BONUS;
    }
  }

  if (knights.length === 2) {
    const a = parseSquareCoords(knights[0]);
    const b = parseSquareCoords(knights[1]);
    const between =
      Math.abs(a.file - b.file) <= 3 && Math.abs(a.rank - b.rank) <= 3;
    if (between) {
      score += 30;
    }
  }

  return score;
}

function evaluateKNNKAttack(after: Chess, move: Move): number {
  let score = 0;
  const blackKing = findKingSquare(after, 'b');
  const whiteKing = findKingSquare(after, 'w');
  const whiteKnights = findPieceSquares(after, 'w', 'n');

  if (after.inCheck()) {
    score += CHECK_BONUS;
    if (blackKing && kingMobility(after, 'b') > 2) {
      score -= 80;
    }
  }

  if (blackKing) {
    score -= kingMobility(after, 'b') * 28;
    score += edgePenalty(blackKing) * 5;
    if (isCornerSquare(blackKing)) {
      score += CORNER_BONUS_ATTACK;
    }
    score += knightsPressureOnKing(whiteKnights, blackKing);
  }

  if (move.piece === 'n' && movedPieceIsHanging(after, move) && !move.captured) {
    score -= HANGING_KNIGHT_PENALTY;
  }

  if (whiteKing && blackKing) {
    score += (8 - kingsDistance(after)) * 12;
    score += kingMobility(after, 'w') * 7;
  }

  return score;
}

function evaluateKNNKDefense(after: Chess, move: Move): number {
  const blackKing = findKingSquare(after, 'b');
  const whiteKnights = findPieceSquares(after, 'w', 'n');
  if (!blackKing) return -10_000;

  let score = 0;

  if (after.inCheck()) {
    score -= 2_000;
  }

  score += kingMobility(after, 'b') * 30;
  score += (8 - centerDistance(blackKing)) * 9;
  score -= edgePenalty(blackKing) * 4;

  if (isCornerSquare(blackKing)) {
    score -= 70;
  }

  score -= knightsPressureOnKing(whiteKnights, blackKing) * 0.6;
  score += kingsDistance(after) * 6;

  if (move.piece === 'k') {
    score += kingMobility(after, 'b') * 12;
  }

  return score;
}

/** Avalua un moviment de la màquina al final KNNK. */
export function evaluateKNNKMove(
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
    return evaluateKNNKAttack(game, move);
  }

  return evaluateKNNKDefense(game, move);
}
