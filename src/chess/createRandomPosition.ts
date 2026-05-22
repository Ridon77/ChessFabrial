import { Chess } from 'chess.js';
import {
  ALL_SQUARES,
  buildFenFromPlacement,
  isDarkSquare,
  isLightSquare,
  kingsAreAdjacentSquares,
  shuffle,
} from './boardUtils';
import { EXERCISE_PIECES } from './chessConstants';
import { DEFAULT_EXERCISE_FENS } from './defaultPositions';
import { isKBBKPlacementValid } from './kbbkPosition';
import { validatePosition } from './validatePosition';
import {
  getWeightedBlackKingSquare,
  pickRandomSquare,
} from './weightedBlackKingSquare';
import type { ExerciseType } from '../types/ExerciseType';

const MAX_GENERATION_ATTEMPTS = 100;
const MAX_KBBK_ATTEMPTS = 180;

function pickWhiteKingSquare(
  blackKingSquare: string,
  used: Set<string>,
): string | null {
  const candidates = ALL_SQUARES.filter(
    (sq) => !used.has(sq) && !kingsAreAdjacentSquares(sq, blackKingSquare),
  );
  return pickRandomSquare(candidates);
}

function generateKBBKCandidate(): string | null {
  const blackKingSquare = getWeightedBlackKingSquare();
  const used = new Set<string>([blackKingSquare]);
  const whiteKingSquare = pickWhiteKingSquare(blackKingSquare, used);

  if (!whiteKingSquare) {
    return null;
  }

  used.add(whiteKingSquare);

  const lightCandidates = shuffle(
    ALL_SQUARES.filter((sq) => !used.has(sq) && isLightSquare(sq)),
  );
  const darkCandidates = shuffle(
    ALL_SQUARES.filter((sq) => !used.has(sq) && isDarkSquare(sq)),
  );

  if (lightCandidates.length === 0 || darkCandidates.length === 0) {
    return null;
  }

  const placement = new Map<string, string>([
    [whiteKingSquare, 'K'],
    [blackKingSquare, 'k'],
    [lightCandidates[0], 'B'],
    [darkCandidates[0], 'B'],
  ]);

  if (!isKBBKPlacementValid(placement)) {
    return null;
  }

  return buildFenFromPlacement(placement);
}

function generateCandidate(exercise: ExerciseType): string | null {
  if (exercise === 'KBBK') {
    return generateKBBKCandidate();
  }

  const blackKingSquare = getWeightedBlackKingSquare();
  const used = new Set<string>([blackKingSquare]);
  const whiteKingSquare = pickWhiteKingSquare(blackKingSquare, used);

  if (!whiteKingSquare) {
    return null;
  }

  used.add(whiteKingSquare);

  const spec = EXERCISE_PIECES[exercise];
  const otherPieces = [...spec.white, ...spec.black].filter(
    (piece) => piece !== 'K' && piece !== 'k',
  );

  const remainingSquares = shuffle(
    ALL_SQUARES.filter((sq) => !used.has(sq)),
  );

  if (remainingSquares.length < otherPieces.length) {
    return null;
  }

  const placement = new Map<string, string>([
    [whiteKingSquare, 'K'],
    [blackKingSquare, 'k'],
  ]);

  otherPieces.forEach((piece, index) => {
    placement.set(remainingSquares[index], piece);
  });

  return buildFenFromPlacement(placement);
}

/**
 * Genera una posició aleatòria legal per a l'exercici (torn blanques `w`).
 * El rei negre es col·loca amb zones ponderades (Prompt 28).
 * Si no es troba cap posició vàlida, retorna una posició segura per defecte.
 */
export function createRandomPosition(exercise: ExerciseType): string {
  const maxAttempts =
    exercise === 'KBBK' ? MAX_KBBK_ATTEMPTS : MAX_GENERATION_ATTEMPTS;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = generateCandidate(exercise);
    if (!candidate) {
      continue;
    }

    const result = validatePosition(candidate, exercise);
    if (result.valid) {
      return result.fen;
    }
  }

  const fallback = DEFAULT_EXERCISE_FENS[exercise];
  try {
    return new Chess(fallback).fen();
  } catch {
    return fallback;
  }
}
