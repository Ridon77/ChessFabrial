import { Chess } from 'chess.js';
import { kingsAreAdjacentOnBoard, parseBoardPieces } from './boardUtils';
import { whiteBishopsOnOppositeSquareColors } from './kbbkPosition';
import { isKingInCheck } from './gameState';
import { EXERCISE_PIECES } from './chessConstants';
import type { ExerciseType } from '../types/ExerciseType';
import type { PositionResult } from '../types/ChessTypes';

function countPiecesOnBoard(pieces: Map<string, string>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const piece of pieces.values()) {
    counts[piece] = (counts[piece] ?? 0) + 1;
  }
  return counts;
}

function expectedPieceCounts(exercise: ExerciseType): Record<string, number> {
  const spec = EXERCISE_PIECES[exercise];
  const expected: Record<string, number> = {};

  for (const piece of spec.white) {
    expected[piece] = (expected[piece] ?? 0) + 1;
  }
  for (const piece of spec.black) {
    expected[piece] = (expected[piece] ?? 0) + 1;
  }

  return expected;
}

function pieceCountsMatch(
  actual: Record<string, number>,
  expected: Record<string, number>,
): boolean {
  const keys = new Set([...Object.keys(actual), ...Object.keys(expected)]);
  for (const key of keys) {
    if ((actual[key] ?? 0) !== (expected[key] ?? 0)) {
      return false;
    }
  }
  return true;
}

/** Valida que una posició sigui legal i jugable per a l'exercici. */
export function validatePosition(
  fen: string,
  exercise: ExerciseType,
): PositionResult {
  const parts = fen.trim().split(/\s+/);

  if (parts.length < 2 || parts[1] !== 'w') {
    return { fen, valid: false };
  }

  const pieces = parseBoardPieces(fen);
  const spec = EXERCISE_PIECES[exercise];
  const expectedCount = spec.white.length + spec.black.length;

  if (pieces.size !== expectedCount) {
    return { fen, valid: false };
  }

  if (!pieceCountsMatch(countPiecesOnBoard(pieces), expectedPieceCounts(exercise))) {
    return { fen, valid: false };
  }

  if (kingsAreAdjacentOnBoard(pieces)) {
    return { fen, valid: false };
  }

  if (
    exercise === 'KBBK' &&
    !whiteBishopsOnOppositeSquareColors(pieces)
  ) {
    return { fen, valid: false };
  }

  let game: Chess;
  try {
    game = new Chess(fen);
  } catch {
    return { fen, valid: false };
  }

  if (game.isCheckmate() || game.isStalemate()) {
    return { fen, valid: false };
  }

  if (game.inCheck() || isKingInCheck(fen, 'b')) {
    return { fen, valid: false };
  }

  return { fen: game.fen(), valid: true };
}
