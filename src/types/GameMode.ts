import type { PlayerSide } from './PlayerSide';

/** Mode d'entrenament derivat del bàndol del jugador. */
export type GameMode = 'attack' | 'defense';

export const GAME_MODES: readonly GameMode[] = ['attack', 'defense'] as const;

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  attack: 'Mode atac',
  defense: 'Mode defensa',
};

/** `white` → atac; `black` → defensa. */
export function gameModeFromPlayerSide(side: PlayerSide): GameMode {
  return side === 'white' ? 'attack' : 'defense';
}

/** `attack` → blanques; `defense` → negres. */
export function playerSideFromGameMode(mode: GameMode): PlayerSide {
  return mode === 'attack' ? 'white' : 'black';
}
