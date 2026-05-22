/** Final d'entrenament: mat contra rei sol (blanques atacants, negres defensor). */
export type ExerciseType = 'KQK' | 'KRK' | 'KRRK' | 'KBBK' | 'KBNK' | 'KNNK';

export type ExerciseDifficulty = 'easy' | 'basic' | 'advanced' | 'expert' | 'special';

export interface ExerciseDefinition {
  code: ExerciseType;
  label: string;
  description: string;
  whitePieces: readonly string[];
  blackPieces: readonly string[];
  difficulty: ExerciseDifficulty;
  forceableMate: boolean;
  mateNote?: string;
}

export const EXERCISE_DIFFICULTY_LABELS: Record<ExerciseDifficulty, string> = {
  easy: 'Fàcil',
  basic: 'Bàsic',
  advanced: 'Avançat',
  expert: 'Molt avançat',
  special: 'Especial',
};

/** Catàleg únic de finals (codi, textos, peces, dificultat, mat forçable). */
export const EXERCISE_DEFINITIONS: Record<ExerciseType, ExerciseDefinition> = {
  KQK: {
    code: 'KQK',
    label: 'Rei + Reina contra Rei',
    description: 'Rei blanc + Reina blanca contra Rei negre',
    whitePieces: ['K', 'Q'],
    blackPieces: ['k'],
    difficulty: 'easy',
    forceableMate: true,
  },
  KRK: {
    code: 'KRK',
    label: 'Rei + Torre contra Rei',
    description: 'Rei blanc + Torre blanca contra Rei negre',
    whitePieces: ['K', 'R'],
    blackPieces: ['k'],
    difficulty: 'basic',
    forceableMate: true,
  },
  KRRK: {
    code: 'KRRK',
    label: 'Rei + dues torres contra Rei',
    description: 'Rei blanc + dues torres blanques contra Rei negre',
    whitePieces: ['K', 'R', 'R'],
    blackPieces: ['k'],
    difficulty: 'easy',
    forceableMate: true,
  },
  KBBK: {
    code: 'KBBK',
    label: 'Rei + dos alfils contra Rei',
    description: 'Rei blanc + dos alfils blancs contra Rei negre',
    whitePieces: ['K', 'B', 'B'],
    blackPieces: ['k'],
    difficulty: 'advanced',
    forceableMate: true,
    mateNote: 'Cal coordinar els alfils i el rei; les caselles de color importen.',
  },
  KBNK: {
    code: 'KBNK',
    label: 'Rei + alfil + cavall contra Rei',
    description: 'Rei blanc + Alfil + Cavall blancs contra Rei negre',
    whitePieces: ['K', 'B', 'N'],
    blackPieces: ['k'],
    difficulty: 'expert',
    forceableMate: true,
    mateNote: 'Mat forçable però tècnicament el més difícil dels finals elementals.',
  },
  KNNK: {
    code: 'KNNK',
    label: 'Rei + dos cavalls contra Rei',
    description: 'Rei blanc + dos cavalls blancs contra Rei negre',
    whitePieces: ['K', 'N', 'N'],
    blackPieces: ['k'],
    difficulty: 'special',
    forceableMate: false,
    mateNote: 'No es pot forçar mat contra rei sol; útil per practicar coordinació.',
  },
};

export const EXERCISE_TYPES: readonly ExerciseType[] = [
  'KQK',
  'KRK',
  'KRRK',
  'KBBK',
  'KBNK',
  'KNNK',
] as const;

export const EXERCISE_DESCRIPTIONS: Record<ExerciseType, string> =
  Object.fromEntries(
    EXERCISE_TYPES.map((code) => [code, EXERCISE_DEFINITIONS[code].description]),
  ) as Record<ExerciseType, string>;

export const EXERCISE_LABELS: Record<ExerciseType, string> = Object.fromEntries(
  EXERCISE_TYPES.map((code) => [code, EXERCISE_DEFINITIONS[code].label]),
) as Record<ExerciseType, string>;

/** Avís didàctic per al final KNNK (mat possible però no forçable). */
export const KNNK_DIDACTIC_NOTICE =
  'Aquest final és especial: el mat existeix, però no es pot forçar contra una defensa correcta.';

export function isSpecialExercise(exercise: ExerciseType): boolean {
  return !EXERCISE_DEFINITIONS[exercise].forceableMate;
}

/** Tema de pistes per a cada final (capa didàctica). */
export const EXERCISE_HINT_TOPICS: Record<ExerciseType, string> = {
  KQK: 'reina',
  KRK: 'torre',
  KRRK: 'dues torres',
  KBBK: 'dos alfils',
  KBNK: 'alfil i cavall',
  KNNK: 'dos cavalls',
};

/** Noms per a la documentació (README). */
export const EXERCISE_README_NAMES: Record<ExerciseType, string> = {
  KQK: 'Rei + Dama contra Rei',
  KRK: 'Rei + Torre contra Rei',
  KRRK: 'Rei + dues Torres contra Rei',
  KBBK: 'Rei + dos Alfils contra Rei',
  KBNK: 'Rei + Alfil + Cavall contra Rei',
  KNNK: 'Rei + dos Cavalls contra Rei',
};

/** Text per a GameStatus i documentació. */
export function getExerciseMateLabel(exercise: ExerciseType): string {
  if (exercise === 'KNNK') {
    return 'No, contra defensa perfecta';
  }
  if (isSpecialExercise(exercise)) {
    return 'Mode especial';
  }
  return 'Sí';
}
