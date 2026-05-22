import {
  isLightSquare,
  kingsAreAdjacentOnBoard,
} from './boardUtils';

/** Els dos alfils blancs han d'estar en caselles de color diferent (alfils oposats). */
export function whiteBishopsOnOppositeSquareColors(
  pieces: Map<string, string>,
): boolean {
  const bishopSquares: string[] = [];

  for (const [square, piece] of pieces) {
    if (piece === 'B') {
      bishopSquares.push(square);
    }
  }

  if (bishopSquares.length !== 2) {
    return false;
  }

  const [first, second] = bishopSquares;
  return isLightSquare(first) !== isLightSquare(second);
}

export function isKBBKPlacementValid(pieces: Map<string, string>): boolean {
  if (kingsAreAdjacentOnBoard(pieces)) {
    return false;
  }

  return whiteBishopsOnOppositeSquareColors(pieces);
}
