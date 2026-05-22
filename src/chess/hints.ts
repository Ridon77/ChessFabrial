import type { GameMode } from '../types/GameMode';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';
import { gameModeFromPlayerSide } from '../types/GameMode';
import {
  getAttackHints,
  getBishopColorLabel,
  getDefenseHints,
  getKbnkCornerHint,
} from '../i18n/hintTexts';
import type { Language } from '../i18n/types';
import { getWhiteBishopSquareColor } from './kbnkPosition';

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function kbnkBishopColorHint(
  fen: string,
  mode: GameMode,
  lang: Language,
): string | null {
  const bishopColor = getWhiteBishopSquareColor(fen);
  if (!bishopColor) {
    return null;
  }

  const label = getBishopColorLabel(lang, bishopColor);
  return getKbnkCornerHint(lang, mode, label);
}

function hintsForKBNK(
  fen: string | undefined,
  mode: GameMode,
  lang: Language,
): string {
  const pool =
    mode === 'defense'
      ? [...getDefenseHints(lang, 'KBNK')]
      : [...getAttackHints(lang, 'KBNK')];

  const dynamic = fen ? kbnkBishopColorHint(fen, mode, lang) : null;
  const choices = dynamic ? [...pool, dynamic] : pool;
  return pickRandom(choices);
}

/** Retorna una pista textual segons exercici i mode (sense jugada concreta). */
export function getHintForSession(
  exercise: ExerciseType,
  mode: GameMode,
  lang: Language,
  fen?: string,
): string {
  if (exercise === 'KBNK') {
    return hintsForKBNK(fen, mode, lang);
  }

  if (mode === 'defense') {
    return pickRandom(getDefenseHints(lang, exercise));
  }
  return pickRandom(getAttackHints(lang, exercise));
}

export function getHintForPlayer(
  exercise: ExerciseType,
  playerSide: PlayerSide,
  lang: Language,
  fen?: string,
): string {
  return getHintForSession(
    exercise,
    gameModeFromPlayerSide(playerSide),
    lang,
    fen,
  );
}
