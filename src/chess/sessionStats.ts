import { getCheckmateWinner } from './gameState';
import { gameModeFromPlayerSide } from '../types/GameMode';
import type { GameMode } from '../types/GameMode';
import type { GameResult, GameResultOutcome, SessionStats, SessionStatsSummary } from '../types/GameResult';
import type { GameStatus } from '../types/ChessTypes';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';

export interface ActiveGameRecord {
  exerciseType: ExerciseType;
  playerSide: PlayerSide;
  mode: GameMode;
  startedAt: number;
  playerMoves: number;
  machineMoves: number;
}

export function createEmptySessionStats(): SessionStats {
  return { results: [] };
}

export function summarizeSessionStats(stats: SessionStats): SessionStatsSummary {
  const summary: SessionStatsSummary = {
    total: stats.results.length,
    wins: 0,
    draws: 0,
    losses: 0,
    aborted: 0,
  };

  for (const entry of stats.results) {
    if (entry.result === 'win') summary.wins += 1;
    else if (entry.result === 'draw') summary.draws += 1;
    else if (entry.result === 'loss') summary.losses += 1;
    else if (entry.result === 'aborted') summary.aborted += 1;
  }

  return summary;
}

/** Determina el resultat del jugador segons l'estat final i el mode. */
export function outcomeFromGameEnd(
  status: GameStatus,
  playerSide: PlayerSide,
  fen: string,
): GameResultOutcome | null {
  const mode = gameModeFromPlayerSide(playerSide);

  if (status === 'checkmate') {
    const winner = getCheckmateWinner(fen);
    if (!winner) {
      return null;
    }

    if (mode === 'attack') {
      return winner === 'w' ? 'win' : 'loss';
    }

    return winner === 'b' ? 'win' : 'loss';
  }

  if (status === 'stalemate' || status === 'draw') {
    return 'draw';
  }

  return null;
}

export function buildGameResult(
  active: ActiveGameRecord,
  result: GameResultOutcome,
  endedAt: number = Date.now(),
): GameResult {
  const playerMoves = active.playerMoves;
  const machineMoves = active.machineMoves;

  return {
    exerciseType: active.exerciseType,
    playerSide: active.playerSide,
    mode: active.mode,
    result,
    moves: playerMoves,
    playerMoves,
    machineMoves,
    totalMoves: playerMoves + machineMoves,
    startedAt: active.startedAt,
    endedAt,
  };
}

export function appendGameResult(
  stats: SessionStats,
  entry: GameResult,
): SessionStats {
  return {
    results: [...stats.results, entry],
  };
}

export function startActiveGame(
  exerciseType: ExerciseType,
  playerSide: PlayerSide,
): ActiveGameRecord {
  return {
    exerciseType,
    playerSide,
    mode: gameModeFromPlayerSide(playerSide),
    startedAt: Date.now(),
    playerMoves: 0,
    machineMoves: 0,
  };
}

export function isTerminalGameStatus(status: GameStatus): boolean {
  return status === 'checkmate' || status === 'stalemate' || status === 'draw';
}
