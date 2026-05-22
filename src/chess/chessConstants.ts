import { EXERCISE_DEFINITIONS } from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';

/** Peces atacants (blanques) i defensor (negres) per a cada exercici. */
export const EXERCISE_PIECES: Record<
  ExerciseType,
  { white: string[]; black: string[] }
> = Object.fromEntries(
  Object.entries(EXERCISE_DEFINITIONS).map(([code, def]) => [
    code,
    { white: [...def.whitePieces], black: [...def.blackPieces] },
  ]),
) as Record<ExerciseType, { white: string[]; black: string[] }>;

const piecesBase = `${import.meta.env.BASE_URL}pieces/`;

function piecePath(filename: string): string {
  return `${piecesBase}${filename}`;
}

/** Imatges de peces a public/pieces/ (respecta VITE_BASE_PATH en producció). */
export const PIECE_IMAGE_PATHS = {
  'white-king': piecePath('white-king.png'),
  'white-queen': piecePath('white-queen.png'),
  'white-rook': piecePath('white-rook.png'),
  'white-bishop': piecePath('white-bishop.png'),
  'white-knight': piecePath('white-knight.png'),
  'white-pawn': piecePath('white-pawn.png'),
  'black-king': piecePath('black-king.png'),
  'black-queen': piecePath('black-queen.png'),
  'black-rook': piecePath('black-rook.png'),
  'black-bishop': piecePath('black-bishop.png'),
  'black-knight': piecePath('black-knight.png'),
  'black-pawn': piecePath('black-pawn.png'),
} as const;

/** Reis en escac (`-m`) i escac i mat (`-cm`) — Prompt 27. */
export const KING_SPECIAL_IMAGE_PATHS = {
  'king-white-m': piecePath('king-white-m.png'),
  'king-black-m': piecePath('king-black-m.png'),
  'king-white-cm': piecePath('king-white-cm.png'),
  'king-black-cm': piecePath('king-black-cm.png'),
} as const;

/** Peces necessàries als finals del catàleg (blanques atacants + rei negre). */
export const ACTIVE_PIECE_IMAGE_KEYS = [
  'white-king',
  'white-queen',
  'white-rook',
  'white-bishop',
  'white-knight',
  'black-king',
] as const satisfies readonly (keyof typeof PIECE_IMAGE_PATHS)[];
