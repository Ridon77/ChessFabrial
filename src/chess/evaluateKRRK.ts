/**
 * Heurística per al final KRRK (Rei + dues torres vs Rei).
 * Limitacions: no calcula mat de torres en profunditat ni totes les coordinacions.
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
  sharesLineWith,
} from './evaluationHelpers';
import type { PlayerSide } from '../types/PlayerSide';

const HANGING_ROOK_PENALTY = 2_500;
const CHECK_BONUS = 380;
const COORDINATION_BONUS = 65;

function evaluateKRRKAttack(after: Chess, move: Move): number {
  let score = 0;
  const blackKing = findKingSquare(after, 'b');
  const whiteKing = findKingSquare(after, 'w');
  const whiteRooks = findPieceSquares(after, 'w', 'r');

  if (after.inCheck()) {
    score += CHECK_BONUS;
    if (blackKing && kingMobility(after, 'b') > 3) {
      score -= 120;
    }
  }

  if (blackKing) {
    score -= kingMobility(after, 'b') * 32;
    score += edgePenalty(blackKing) * 6;

    const { file, rank } = parseSquareCoords(blackKing);
    if (move.piece === 'r') {
      const to = parseSquareCoords(move.to);
      if (to.file === file || to.rank === rank) {
        score += 70;
      }
    }
  }

  if (blackKing && whiteRooks.length > 0) {
    const targets = [blackKing];
    for (const rook of whiteRooks) {
      score += sharesLineWith(rook, targets) * COORDINATION_BONUS;
    }
    if (whiteRooks.length === 2) {
      const a = parseSquareCoords(whiteRooks[0]);
      const b = parseSquareCoords(whiteRooks[1]);
      if (a.file === b.file || a.rank === b.rank) {
        score += 45;
      }
    }
  }

  if (move.piece === 'r' && movedPieceIsHanging(after, move) && !move.captured) {
    score -= HANGING_ROOK_PENALTY;
  }

  if (whiteKing && blackKing) {
    score += (8 - kingsDistance(after)) * 11;
    score += kingMobility(after, 'w') * 6;
  }

  return score;
}

function evaluateKRRKDefense(after: Chess, move: Move): number {
  const blackKing = findKingSquare(after, 'b');
  if (!blackKing) return -10_000;

  let score = 0;

  if (after.inCheck()) {
    score -= 2_000;
  }

  score += kingMobility(after, 'b') * 26;
  score -= edgePenalty(blackKing) * 4;
  score += (8 - centerDistance(blackKing)) * 9;
  score += kingsDistance(after) * 10;

  if (move.piece === 'k') {
    score += kingMobility(after, 'b') * 8;
  }

  return score;
}

/** Avalua un moviment de la màquina al final KRRK. */
export function evaluateKRRKMove(
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
    return evaluateKRRKAttack(game, move);
  }

  return evaluateKRRKDefense(game, move);
}
