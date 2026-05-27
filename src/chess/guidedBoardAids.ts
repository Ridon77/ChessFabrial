import type { CSSProperties } from 'react';
import { Chess } from 'chess.js';
import { BOARD_FILES, parseBoardPieces, parseSquareCoords } from './boardUtils';
import type { ExerciseType } from '../types/ExerciseType';

export interface BoardArrow {
  startSquare: string;
  endSquare: string;
  color: string;
}

const GUIDED_ARROW_COLOR = 'rgba(46, 125, 50, 0.65)';
const GUIDED_ATTACK_OVERLAY = 'rgba(144, 238, 144, 0.5)';

const ROOK_DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const BISHOP_DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
const QUEEN_DIRS: ReadonlyArray<readonly [number, number]> = [
  ...ROOK_DIRS,
  ...BISHOP_DIRS,
];
const KNIGHT_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];

function squareKey(file: number, rank: number): string | null {
  if (file < 0 || file > 7 || rank < 1 || rank > 8) {
    return null;
  }
  return `${BOARD_FILES[file]}${rank}`;
}

function addRayAttacks(
  from: string,
  dirs: ReadonlyArray<readonly [number, number]>,
  pieces: Map<string, string>,
  attacked: Set<string>,
): void {
  const { file, rank } = parseSquareCoords(from);

  for (const [df, dr] of dirs) {
    let f = file + df;
    let r = rank + dr;

    while (true) {
      const sq = squareKey(f, r);
      if (!sq) {
        break;
      }
      if (sq !== from) {
        attacked.add(sq);
      }
      if (pieces.has(sq)) {
        break;
      }
      f += df;
      r += dr;
    }
  }
}

function addKnightAttacks(from: string, attacked: Set<string>): void {
  const { file, rank } = parseSquareCoords(from);

  for (const [df, dr] of KNIGHT_OFFSETS) {
    const sq = squareKey(file + df, rank + dr);
    if (sq) {
      attacked.add(sq);
    }
  }
}

function addKingAttacks(from: string, attacked: Set<string>): void {
  const { file, rank } = parseSquareCoords(from);

  for (let df = -1; df <= 1; df += 1) {
    for (let dr = -1; dr <= 1; dr += 1) {
      if (df === 0 && dr === 0) {
        continue;
      }
      const sq = squareKey(file + df, rank + dr);
      if (sq) {
        attacked.add(sq);
      }
    }
  }
}

export function getWhiteControlledSquares(game: Chess): string[] {
  const pieces = parseBoardPieces(game.fen());
  const attacked = new Set<string>();

  for (const [square, piece] of pieces) {
    if (piece === piece.toLowerCase()) {
      continue;
    }

    switch (piece) {
      case 'Q':
        addRayAttacks(square, QUEEN_DIRS, pieces, attacked);
        break;
      case 'R':
        addRayAttacks(square, ROOK_DIRS, pieces, attacked);
        break;
      case 'B':
        addRayAttacks(square, BISHOP_DIRS, pieces, attacked);
        break;
      case 'N':
        addKnightAttacks(square, attacked);
        break;
      case 'K':
        addKingAttacks(square, attacked);
        break;
      default:
        break;
    }
  }

  return [...attacked];
}

/**
 * Caselles controlades per les blanques a partir del FEN actual.
 * Aquest càlcul usa patrons de control de peça (pseudo-control), no només jugades legals.
 */
export function getWhiteAttackedSquares(fen: string): Set<string> {
  return new Set(getWhiteControlledSquares(new Chess(fen)));
}

function getFarthestSquareOnRay(
  from: string,
  dir: readonly [number, number],
  pieces: Map<string, string>,
): string {
  const { file, rank } = parseSquareCoords(from);
  let f = file + dir[0];
  let r = rank + dir[1];
  let last = from;

  while (true) {
    const sq = squareKey(f, r);
    if (!sq) {
      break;
    }
    last = sq;
    if (pieces.has(sq) && sq !== from) {
      break;
    }
    f += dir[0];
    r += dir[1];
  }

  return last;
}

export function getGuidedArrows(
  fen: string,
  exercise: ExerciseType,
): BoardArrow[] {
  const pieces = parseBoardPieces(fen);
  const arrows: BoardArrow[] = [];

  const addRookArrows = (square: string) => {
    for (const dir of ROOK_DIRS) {
      const end = getFarthestSquareOnRay(square, dir, pieces);
      if (end !== square) {
        arrows.push({
          startSquare: square,
          endSquare: end,
          color: GUIDED_ARROW_COLOR,
        });
      }
    }
  };

  const addBishopArrows = (square: string) => {
    for (const dir of BISHOP_DIRS) {
      const end = getFarthestSquareOnRay(square, dir, pieces);
      if (end !== square) {
        arrows.push({
          startSquare: square,
          endSquare: end,
          color: GUIDED_ARROW_COLOR,
        });
      }
    }
  };

  for (const [square, piece] of pieces) {
    if (piece === 'R' && (exercise === 'KRK' || exercise === 'KRRK')) {
      addRookArrows(square);
    }
    if (piece === 'B' && exercise === 'KBBK') {
      addBishopArrows(square);
    }
  }

  return arrows;
}

/** Torn de les blanques al FEN (jugador pot moure). */
export function isWhiteToMove(fen: string): boolean {
  return fen.trim().split(/\s+/)[1] === 'w';
}

export function buildGuidedSquareStyles(fen: string): Record<string, CSSProperties> {
  const styles: Record<string, CSSProperties> = {};

  for (const square of getWhiteAttackedSquares(fen)) {
    styles[square] = { backgroundColor: GUIDED_ATTACK_OVERLAY };
  }

  return styles;
}
