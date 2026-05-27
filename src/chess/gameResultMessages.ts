import { gameModeFromPlayerSide } from '../types/GameMode';
import type { GameMode } from '../types/GameMode';
import type { GameResultOutcome } from '../types/GameResult';
import type { GameStatus } from '../types/ChessTypes';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';
import type { TrainingMode } from '../types/TrainingMode';
import { isSpecialExercise } from '../types/ExerciseType';
import {
  gameModeShortKey,
  trainingModeKey,
  translate,
  translateDrawReason,
  type TranslationKey,
} from '../i18n/translations';
import type { Language } from '../i18n/types';

export type PlayerResultOutcome = Exclude<GameResultOutcome, 'aborted'>;

const RESULT_TITLE_KEYS: Record<PlayerResultOutcome, TranslationKey> = {
  win: 'result.win',
  draw: 'result.draw',
  loss: 'result.loss',
};

export function getResultTitle(
  lang: Language,
  outcome: PlayerResultOutcome,
): string {
  return translate(lang, RESULT_TITLE_KEYS[outcome]);
}

export function getModeLabelShort(lang: Language, mode: GameMode): string {
  return translate(lang, gameModeShortKey(mode));
}

export function getTrainingModeLabel(
  lang: Language,
  trainingMode: TrainingMode,
): string {
  return translate(lang, trainingModeKey(trainingMode));
}

export function getResultBriefMessage(
  lang: Language,
  outcome: PlayerResultOutcome,
  status: GameStatus,
  exercise: ExerciseType,
  drawReason: string | null,
): string {
  if (outcome === 'win') {
    if (status === 'checkmate' && isSpecialExercise(exercise)) {
      return translate(lang, 'result.winSpecial');
    }
    if (status === 'checkmate') {
      return translate(lang, 'result.winCheckmate');
    }
    return translate(lang, 'result.winGeneric');
  }

  if (outcome === 'draw') {
    if (status === 'stalemate') {
      return translate(lang, 'result.drawStalemate');
    }
    const reason = translateDrawReason(lang, drawReason);
    if (reason) {
      return translate(lang, 'result.drawWithReason', { reason });
    }
    return translate(lang, 'result.drawGeneric');
  }

  return translate(lang, 'result.lossCheckmate');
}

export interface GameEndModalData {
  outcome: PlayerResultOutcome;
  exercise: ExerciseType;
  mode: GameMode;
  trainingMode: TrainingMode;
  playerMoves: number;
  status: 'checkmate' | 'stalemate' | 'draw';
  drawReason: string | null;
}

export function buildGameEndModalData(
  active: {
    exerciseType: ExerciseType;
    playerSide: PlayerSide;
    trainingMode: TrainingMode;
    playerMoves: number;
  },
  outcome: PlayerResultOutcome,
  status: 'checkmate' | 'stalemate' | 'draw',
  drawReason: string | null,
): GameEndModalData {
  return {
    outcome,
    exercise: active.exerciseType,
    mode: gameModeFromPlayerSide(active.playerSide),
    trainingMode: active.trainingMode,
    playerMoves: active.playerMoves,
    status,
    drawReason,
  };
}
