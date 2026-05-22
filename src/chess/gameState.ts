import { Chess } from 'chess.js';
import type { GameStatus } from '../types/ChessTypes';
import type { PlayerSide } from '../types/PlayerSide';

export interface GameSnapshot {
  fen: string;
  status: GameStatus;
  inCheck: boolean;
  turn: 'w' | 'b';
  /** Motiu de taules (només material insuficient; no regla dels 50 moviments). */
  drawReason: string | null;
}

export function createGame(fen: string): Chess {
  return new Chess(fen);
}

export function getMachineSide(playerSide: PlayerSide): PlayerSide {
  return playerSide === 'white' ? 'black' : 'white';
}

export function isPlayerTurn(game: Chess, playerSide: PlayerSide): boolean {
  const turn = game.turn();
  return playerSide === 'white' ? turn === 'w' : turn === 'b';
}

export function isMachineTurn(fen: string, playerSide: PlayerSide): boolean {
  const game = createGame(fen);
  return !isPlayerTurn(game, playerSide);
}

/** Comprova si el rei del color indicat està en escac. */
export function isKingInCheck(fen: string, color: 'w' | 'b'): boolean {
  const parts = fen.trim().split(/\s+/);
  parts[1] = color;
  try {
    return new Chess(parts.join(' ')).inCheck();
  } catch {
    return false;
  }
}

/** Bàndol que ha fet mat (null si no hi ha mat). */
export function getCheckmateWinner(fen: string): 'w' | 'b' | null {
  const game = createGame(fen);
  if (!game.isCheckmate()) {
    return null;
  }
  return game.turn() === 'w' ? 'b' : 'w';
}

/** Motiu de taules en català (exclou 50 moviments i triple repetició). */
export function getDrawReason(game: Chess): string | null {
  if (game.isInsufficientMaterial()) {
    return 'Material insuficient';
  }
  return null;
}

export function deriveGameStatus(game: Chess): GameStatus {
  if (game.isCheckmate()) {
    return 'checkmate';
  }
  if (game.isStalemate()) {
    return 'stalemate';
  }
  if (getDrawReason(game)) {
    return 'draw';
  }
  return 'playing';
}

export function toSnapshot(game: Chess): GameSnapshot {
  return {
    fen: game.fen(),
    status: deriveGameStatus(game),
    inCheck: game.inCheck(),
    turn: game.turn(),
    drawReason: getDrawReason(game),
  };
}

export function snapshotFromFen(fen: string): GameSnapshot {
  return toSnapshot(createGame(fen));
}
