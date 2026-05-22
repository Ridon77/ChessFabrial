import { PIECE_IMAGE_PATHS } from '../chess/chessConstants';
import { EXERCISE_DEFINITIONS } from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';

const WHITE_PIECE_IMAGES: Record<string, string> = {
  K: PIECE_IMAGE_PATHS['white-king'],
  Q: PIECE_IMAGE_PATHS['white-queen'],
  R: PIECE_IMAGE_PATHS['white-rook'],
  B: PIECE_IMAGE_PATHS['white-bishop'],
  N: PIECE_IMAGE_PATHS['white-knight'],
};

/** Imatges de peces blanques atacants + rei negre per a la miniatura del botó. */
export function getExercisePieceIcons(exercise: ExerciseType): {
  white: string[];
  blackKing: string;
} {
  const def = EXERCISE_DEFINITIONS[exercise];
  const white = def.whitePieces
    .filter((p) => p !== 'K')
    .map((p) => WHITE_PIECE_IMAGES[p])
    .filter(Boolean);

  const hasWhiteKing = def.whitePieces.includes('K');
  if (hasWhiteKing) {
    white.unshift(WHITE_PIECE_IMAGES.K);
  }

  return {
    white,
    blackKing: PIECE_IMAGE_PATHS['black-king'],
  };
}
