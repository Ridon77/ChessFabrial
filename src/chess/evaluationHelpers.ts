import { Chess, type Move } from 'chess.js';
import { parseSquareCoords } from './boardUtils';

export const MATE_SCORE = 100_000;
export const STALEMATE_SCORE = 50_000;
export const DRAW_CAPTURE_SCORE = 90_000;
export const DRAW_SCORE = 48_000;

export function centerDistance(square: string): number {
  const { file, rank } = parseSquareCoords(square);
  const rankIndex = rank - 1;
  return Math.abs(file - 3.5) + Math.abs(rankIndex - 3.5);
}

export function edgePenalty(square: string): number {
  const { file, rank } = parseSquareCoords(square);
  const rankIndex = rank - 1;
  const onEdge = file === 0 || file === 7 || rankIndex === 0 || rankIndex === 7;
  const onCorner =
    (file === 0 || file === 7) && (rankIndex === 0 || rankIndex === 7);
  if (onCorner) return 40;
  if (onEdge) return 20;
  return 0;
}

export function findKingSquare(game: Chess, color: 'w' | 'b'): string | null {
  const board = game.board();
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank][file];
      if (!piece) continue;
      if (piece.color === color && piece.type === 'k') {
        return `${String.fromCharCode(97 + file)}${8 - rank}`;
      }
    }
  }
  return null;
}

export function findPieceSquares(
  game: Chess,
  color: 'w' | 'b',
  type: 'r' | 'q' | 'b' | 'n',
): string[] {
  const squares: string[] = [];
  const board = game.board();
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank][file];
      if (piece && piece.color === color && piece.type === type) {
        squares.push(`${String.fromCharCode(97 + file)}${8 - rank}`);
      }
    }
  }
  return squares;
}

export function kingMobility(game: Chess, color: 'w' | 'b'): number {
  const king = findKingSquare(game, color);
  if (!king) return 0;
  return game.moves({ verbose: true }).filter((m) => m.from === king).length;
}

export function kingsDistance(game: Chess): number {
  const white = findKingSquare(game, 'w');
  const black = findKingSquare(game, 'b');
  if (!white || !black) return 0;
  const a = parseSquareCoords(white);
  const b = parseSquareCoords(black);
  return Math.abs(a.file - b.file) + Math.abs(a.rank - b.rank);
}

/** La casella està atacada pel bàndol que té el torn després del moviment. */
export function isSquareAttacked(game: Chess, square: string): boolean {
  return game.moves({ verbose: true }).some((m) => m.to === square);
}

/** Després de jugar `move`, la peça a `move.to` queda sense defensa? */
export function movedPieceIsHanging(after: Chess, move: Move): boolean {
  if (!move.to) return false;
  return isSquareAttacked(after, move.to);
}

export function sharesLineWith(
  square: string,
  targets: string[],
): number {
  const { file, rank } = parseSquareCoords(square);
  let count = 0;
  for (const target of targets) {
    const t = parseSquareCoords(target);
    if (file === t.file || rank === t.rank) {
      count += 1;
    }
  }
  return count;
}
