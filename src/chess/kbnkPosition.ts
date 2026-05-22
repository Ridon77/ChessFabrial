import { isLightSquare, parseBoardPieces } from './boardUtils';

export type BishopSquareColor = 'light' | 'dark';

const CORNER_SQUARES = ['a1', 'h1', 'a8', 'h8'] as const;

export function isCornerSquare(square: string): boolean {
  return (CORNER_SQUARES as readonly string[]).includes(square);
}

/** Color de la casella de l'alfil blanc (clara o fosca). */
export function getWhiteBishopSquareColor(fen: string): BishopSquareColor | null {
  const pieces = parseBoardPieces(fen);
  for (const [square, piece] of pieces) {
    if (piece === 'B') {
      return isLightSquare(square) ? 'light' : 'dark';
    }
  }
  return null;
}

export function bishopSquareColorLabel(color: BishopSquareColor): string {
  return color === 'light' ? 'clares' : 'foses';
}

export function cornerMatchesBishopColor(
  corner: string,
  bishopColor: BishopSquareColor,
): boolean {
  return bishopColor === 'light'
    ? isLightSquare(corner)
    : !isLightSquare(corner);
}

export function kingOnBishopMateCorner(
  kingSquare: string,
  bishopColor: BishopSquareColor,
): boolean {
  return (
    isCornerSquare(kingSquare) && cornerMatchesBishopColor(kingSquare, bishopColor)
  );
}

export function kingOnWrongBishopCorner(
  kingSquare: string,
  bishopColor: BishopSquareColor,
): boolean {
  return (
    isCornerSquare(kingSquare) && !cornerMatchesBishopColor(kingSquare, bishopColor)
  );
}
