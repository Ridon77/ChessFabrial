import type { PlayerSide } from '../types/PlayerSide';

/** `pieceType` de react-chessboard (p. ex. `wK`, `bR`). */
export function isPlayerPiece(
  pieceType: string,
  playerSide: PlayerSide,
): boolean {
  const isWhite = pieceType.startsWith('w');
  return playerSide === 'white' ? isWhite : pieceType.startsWith('b');
}
