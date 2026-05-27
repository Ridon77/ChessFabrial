import type { GameMode } from '../types/GameMode';
import { GAME_MODES } from '../types/GameMode';
import type { ExerciseType } from '../types/ExerciseType';
import type { GameResult, SessionStats } from '../types/GameResult';
import type { TrainingMode } from '../types/TrainingMode';
import { TRAINING_MODES } from '../types/TrainingMode';
import {
  exerciseLabelKey,
  gameModeKey,
  trainingModeKey,
  translate,
} from '../i18n/translations';
import type { Language } from '../i18n/types';

export interface ModeStatsBreakdown {
  mode: GameMode;
  label: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  aborted: number;
}

export interface ExerciseModeTableRow {
  exerciseType: ExerciseType;
  exerciseLabel: string;
  mode: GameMode;
  modeLabel: string;
  trainingMode: TrainingMode;
  trainingModeLabel: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  aborted: number;
  avgMovesInWins: number | null;
  bestWinMoves: number | null;
}

function emptyModeBreakdown(lang: Language, mode: GameMode): ModeStatsBreakdown {
  return {
    mode,
    label: translate(lang, gameModeKey(mode)),
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    aborted: 0,
  };
}

export function getModeBreakdown(
  stats: SessionStats,
  lang: Language,
): ModeStatsBreakdown[] {
  const byMode = new Map<GameMode, ModeStatsBreakdown>();

  for (const mode of GAME_MODES) {
    byMode.set(mode, emptyModeBreakdown(lang, mode));
  }

  for (const entry of stats.results) {
    const row = byMode.get(entry.mode)!;
    row.played += 1;
    if (entry.result === 'win') row.wins += 1;
    else if (entry.result === 'draw') row.draws += 1;
    else if (entry.result === 'loss') row.losses += 1;
    else if (entry.result === 'aborted') row.aborted += 1;
  }

  return GAME_MODES.map((mode) => byMode.get(mode)!);
}

export function hasAnyAborted(stats: SessionStats): boolean {
  return stats.results.some((entry) => entry.result === 'aborted');
}

function roundAverage(total: number, count: number): number | null {
  if (count === 0) {
    return null;
  }
  return Math.round((total / count) * 10) / 10;
}

export function getExerciseModeTable(
  stats: SessionStats,
  lang: Language,
): ExerciseModeTableRow[] {
  const groups = new Map<string, GameResult[]>();

  for (const entry of stats.results) {
    const key = `${entry.exerciseType}:${entry.mode}:${entry.trainingMode}`;
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }

  const rows: ExerciseModeTableRow[] = [];

  for (const [key, games] of groups) {
    const [exerciseType, mode, trainingMode] = key.split(':') as [
      ExerciseType,
      GameMode,
      TrainingMode,
    ];
    const wins = games.filter((g) => g.result === 'win');
    const winMoves = wins.map((g) => g.moves);

    rows.push({
      exerciseType,
      exerciseLabel: translate(lang, exerciseLabelKey(exerciseType)),
      mode,
      modeLabel: translate(lang, gameModeKey(mode)),
      trainingMode,
      trainingModeLabel: translate(lang, trainingModeKey(trainingMode)),
      played: games.length,
      wins: games.filter((g) => g.result === 'win').length,
      draws: games.filter((g) => g.result === 'draw').length,
      losses: games.filter((g) => g.result === 'loss').length,
      aborted: games.filter((g) => g.result === 'aborted').length,
      avgMovesInWins: roundAverage(
        winMoves.reduce((sum, m) => sum + m, 0),
        winMoves.length,
      ),
      bestWinMoves: winMoves.length > 0 ? Math.min(...winMoves) : null,
    });
  }

  return rows.sort((a, b) => {
    if (a.exerciseLabel !== b.exerciseLabel) {
      return a.exerciseLabel.localeCompare(b.exerciseLabel, lang);
    }
    if (a.modeLabel !== b.modeLabel) {
      return a.modeLabel.localeCompare(b.modeLabel, lang);
    }
    const trainingOrder = TRAINING_MODES.indexOf(a.trainingMode)
      - TRAINING_MODES.indexOf(b.trainingMode);
    if (trainingOrder !== 0) {
      return trainingOrder;
    }
    return a.trainingModeLabel.localeCompare(b.trainingModeLabel, lang);
  });
}

export function getChartMaxValue(byMode: ModeStatsBreakdown[]): number {
  let max = 1;
  for (const mode of byMode) {
    max = Math.max(max, mode.wins, mode.draws, mode.losses, mode.aborted);
  }
  return max;
}
