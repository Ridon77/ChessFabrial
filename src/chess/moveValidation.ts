import { Chess, type Square } from 'chess.js';

/** Comprova si un moviment és legal segons chess.js. */
export function isLegalMove(
  fen: string,
  from: string,
  to: string,
): boolean {
  const game = new Chess(fen);
  try {
    const move = game.move({ from, to, promotion: 'q' });
    return move !== null;
  } catch {
    return false;
  }
}

/** Caselles de destinació legals per a una peça a `from`. */
export function getLegalTargetSquares(fen: string, from: string): string[] {
  const game = new Chess(fen);
  try {
    const moves = game.moves({ square: from as Square, verbose: true });
    return moves.map((move) => move.to);
  } catch {
    return [];
  }
}

/** Aplica un moviment i retorna el nou FEN, o null si és il·legal. */
export function applyMove(
  fen: string,
  from: string,
  to: string,
): string | null {
  const game = new Chess(fen);
  try {
    const move = game.move({ from, to, promotion: 'q' });
    if (!move) {
      return null;
    }
    return game.fen();
  } catch {
    return null;
  }
}
