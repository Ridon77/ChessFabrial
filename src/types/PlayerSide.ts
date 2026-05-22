/** Bàndol que juga l'usuari. */
export type PlayerSide = 'white' | 'black';

export const PLAYER_SIDES: readonly PlayerSide[] = ['white', 'black'] as const;

/** Blanques: entrenar l'atac. Negres: entrenar la defensa. */
export const PLAYER_SIDE_DESCRIPTIONS: Record<PlayerSide, string> = {
  white: 'El jugador entrena l\'atac (blanques)',
  black: 'El jugador entrena la defensa (negres)',
};

/** Textos per al selector de bàndol (Prompt 4). */
export const PLAYER_SIDE_LABELS: Record<PlayerSide, string> = {
  white: 'Entrenar atac: jugar amb blanques',
  black: 'Entrenar defensa: jugar amb negres',
};
