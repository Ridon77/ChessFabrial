/**
 * Heurística per al final KBNK (Rei + alfil + cavall vs Rei).
 * Limitacions: no executa el mat W manoeuvre ni variants profundes; és una primera aproximació.
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
import {
  getWhiteBishopSquareColor,
  kingOnBishopMateCorner,
  kingOnWrongBishopCorner,
  type BishopSquareColor,
} from './kbnkPosition';
import type { PlayerSide } from '../types/PlayerSide';

const CHECK_BONUS = 340;
const DIAGONAL_BONUS = 50;
const KNIGHT_NEAR_KING_BONUS = 40;
const HANGING_MINOR_PENALTY = 2_000;
const CORNER_MATE_BONUS = 90;
const WRONG_CORNER_PENALTY = 70;

function onSameDiagonal(squareA: string, squareB: string): boolean {
  const a = parseSquareCoords(squareA);
  const b = parseSquareCoords(squareB);
  return Math.abs(a.file - b.file) === Math.abs(a.rank - b.rank);
}

function knightNearKing(knights: string[], king: string): number {
  const k = parseSquareCoords(king);
  let score = 0;
  for (const knight of knights) {
    const n = parseSquareCoords(knight);
    const dist = Math.max(Math.abs(n.file - k.file), Math.abs(n.rank - k.rank));
    if (dist <= 3) {
      score += KNIGHT_NEAR_KING_BONUS;
    }
  }
  return score;
}

function evaluateKBNKAttack(
  after: Chess,
  move: Move,
  bishopColor: BishopSquareColor | null,
): number {
  let score = 0;
  const blackKing = findKingSquare(after, 'b');
  const whiteKing = findKingSquare(after, 'w');
  const whiteBishop = findPieceSquares(after, 'w', 'b')[0];
  const whiteKnights = findPieceSquares(after, 'w', 'n');

  if (after.inCheck()) {
    score += CHECK_BONUS;
    if (blackKing && kingMobility(after, 'b') > 2) {
      score -= 90;
    }
  }

  if (blackKing) {
    score -= kingMobility(after, 'b') * 30;
    score += edgePenalty(blackKing) * 5;

    if (bishopColor) {
      if (kingOnBishopMateCorner(blackKing, bishopColor)) {
        score += CORNER_MATE_BONUS;
      }
      if (kingOnWrongBishopCorner(blackKing, bishopColor)) {
        score -= WRONG_CORNER_PENALTY;
      }
    }

    if (whiteBishop && onSameDiagonal(whiteBishop, blackKing)) {
      score += DIAGONAL_BONUS;
    }

    score += knightNearKing(whiteKnights, blackKing);
  }

  if (
    (move.piece === 'b' || move.piece === 'n') &&
    movedPieceIsHanging(after, move) &&
    !move.captured
  ) {
    score -= HANGING_MINOR_PENALTY;
  }

  if (whiteKing && blackKing) {
    score += (8 - kingsDistance(after)) * 15;
    score += kingMobility(after, 'w') * 9;
  }

  return score;
}

function evaluateKBNKDefense(
  after: Chess,
  move: Move,
  bishopColor: BishopSquareColor | null,
): number {
  const blackKing = findKingSquare(after, 'b');
  const whiteKing = findKingSquare(after, 'w');
  if (!blackKing) return -10_000;

  let score = 0;
  const whiteBishop = findPieceSquares(after, 'w', 'b')[0];

  if (after.inCheck()) {
    score -= 2_000;
  }

  score += kingMobility(after, 'b') * 27;
  score += (8 - centerDistance(blackKing)) * 8;
  score -= edgePenalty(blackKing) * 3;

  if (bishopColor) {
    if (kingOnBishopMateCorner(blackKing, bishopColor)) {
      score -= 100;
    }
    if (kingOnWrongBishopCorner(blackKing, bishopColor)) {
      score += 55;
    }
  }

  if (whiteKing) {
    score += kingsDistance(after) * 9;
  }

  if (whiteBishop && onSameDiagonal(whiteBishop, blackKing)) {
    score -= 30;
  }

  if (move.piece === 'k') {
    score += kingMobility(after, 'b') * 10;
  }

  return score;
}

/** Avalua un moviment de la màquina al final KBNK. */
export function evaluateKBNKMove(
  fen: string,
  move: Move,
  machineSide: PlayerSide,
): number {
  const game = new Chess(fen);
  const played = game.move(move);
  if (!played) {
    return -Infinity;
  }

  const bishopColor = getWhiteBishopSquareColor(game.fen());

  if (machineSide === 'white') {
    return evaluateKBNKAttack(game, move, bishopColor);
  }

  return evaluateKBNKDefense(game, move, bishopColor);
}
