import { gameModeFromPlayerSide } from './GameMode';
import type { ExerciseType } from './ExerciseType';
import type { GameMode } from './GameMode';
import type { PlayerSide } from './PlayerSide';

export type GameStatus =
  | 'idle'
  | 'playing'
  | 'checkmate'
  | 'stalemate'
  | 'draw';

/** Configuració d'una sessió d'entrenament. */
export interface GameConfig {
  exercise: ExerciseType;
  playerSide: PlayerSide;
  mode: GameMode;
}

export interface PositionResult {
  fen: string;
  valid: boolean;
}

/** Crea una configuració amb el mode coherent amb el bàndol del jugador. */
export function createGameConfig(
  exercise: ExerciseType,
  playerSide: PlayerSide,
): GameConfig {
  return {
    exercise,
    playerSide,
    mode: gameModeFromPlayerSide(playerSide),
  };
}

export function isConsistentGameConfig(config: GameConfig): boolean {
  return config.mode === gameModeFromPlayerSide(config.playerSide);
}
