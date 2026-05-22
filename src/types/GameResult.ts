import type { GameMode } from './GameMode';
import type { ExerciseType } from './ExerciseType';
import type { PlayerSide } from './PlayerSide';

export type GameResultOutcome = 'win' | 'draw' | 'loss' | 'aborted';

/** Resultat d'una partida dins la sessió actual (sense persistència). */
export interface GameResult {
  exerciseType: ExerciseType;
  playerSide: PlayerSide;
  mode: GameMode;
  result: GameResultOutcome;
  moves: number;
  playerMoves: number;
  machineMoves: number;
  totalMoves: number;
  startedAt: number;
  endedAt: number;
}

export interface SessionStats {
  results: GameResult[];
}

export interface SessionStatsSummary {
  total: number;
  wins: number;
  draws: number;
  losses: number;
  aborted: number;
}
