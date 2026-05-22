export type {
  ExerciseType,
  ExerciseDifficulty,
  ExerciseDefinition,
} from './ExerciseType';
export {
  EXERCISE_TYPES,
  EXERCISE_DEFINITIONS,
  EXERCISE_DESCRIPTIONS,
  EXERCISE_LABELS,
  EXERCISE_DIFFICULTY_LABELS,
  KNNK_DIDACTIC_NOTICE,
  EXERCISE_HINT_TOPICS,
  EXERCISE_README_NAMES,
  isSpecialExercise,
  getExerciseMateLabel,
} from './ExerciseType';

export type { PlayerSide } from './PlayerSide';
export {
  PLAYER_SIDES,
  PLAYER_SIDE_DESCRIPTIONS,
  PLAYER_SIDE_LABELS,
} from './PlayerSide';

export type { GameMode } from './GameMode';
export {
  GAME_MODES,
  GAME_MODE_LABELS,
  gameModeFromPlayerSide,
  playerSideFromGameMode,
} from './GameMode';

export type {
  GameResult,
  GameResultOutcome,
  SessionStats,
  SessionStatsSummary,
} from './GameResult';

export type { GameStatus, GameConfig, PositionResult } from './ChessTypes';
export {
  createGameConfig,
  isConsistentGameConfig,
} from './ChessTypes';
