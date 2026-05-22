import { isKingInCheck, isMachineTurn, getCheckmateWinner } from '../chess/gameState';
import { gameModeFromPlayerSide } from '../types/GameMode';
import { useLanguage } from '../i18n/useLanguage';
import {
  difficultyKey,
  exerciseLabelKey,
  gameModeKey,
  getMateLabel,
  translateDrawReason,
} from '../i18n/translations';
import {
  EXERCISE_DEFINITIONS,
  isSpecialExercise,
} from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';
import type { GameStatus as Status } from '../types/ChessTypes';
import type { PlayerSide } from '../types/PlayerSide';

export type FeedbackNotice = 'illegal' | 'newPosition' | null;

interface GameStatusProps {
  exercise: ExerciseType;
  playerSide: PlayerSide;
  status: Status;
  fen: string;
  drawReason?: string | null;
  playerMoveCount: number;
  feedbackNotice?: FeedbackNotice;
  suppressResultAlert?: boolean;
  isMachineThinking?: boolean;
  onNewPosition: () => void;
  onRestart: () => void;
}

export function GameStatus({
  exercise,
  playerSide,
  status,
  fen,
  drawReason = null,
  playerMoveCount,
  feedbackNotice = null,
  suppressResultAlert = false,
  isMachineThinking = false,
  onNewPosition,
  onRestart,
}: GameStatusProps) {
  const { t, language } = useLanguage();
  const mode = gameModeFromPlayerSide(playerSide);
  const def = EXERCISE_DEFINITIONS[exercise];

  const roleHint =
    exercise === 'KNNK'
      ? playerSide === 'white'
        ? t('gameStatus.roleKNNKWhite')
        : t('gameStatus.roleKNNKBlack')
      : playerSide === 'white'
        ? t('gameStatus.roleWhite')
        : t('gameStatus.roleBlack');

  const turn = isMachineThinking
    ? t('gameStatus.machineThinking')
    : status === 'playing' && fen
      ? isMachineTurn(fen, playerSide)
        ? t('gameStatus.turnMachine')
        : t('gameStatus.turnPlayer')
      : '';

  let check: string | null = null;
  if (status === 'playing' && fen) {
    const playerColor: 'w' | 'b' = playerSide === 'white' ? 'w' : 'b';
    const opponentColor = playerColor === 'w' ? 'b' : 'w';
    if (isKingInCheck(fen, playerColor)) {
      check = t('gameStatus.checkOwn');
    } else if (playerSide === 'white' && isKingInCheck(fen, opponentColor)) {
      check = t('gameStatus.checkBlack');
    }
  }

  let result: string | null = null;
  if (status === 'checkmate' && fen) {
    const winner = getCheckmateWinner(fen);
    const playerColor = playerSide === 'white' ? 'w' : 'b';
    if (winner === playerColor) {
      result = isSpecialExercise(exercise)
        ? t('gameStatus.winSpecial')
        : t('gameStatus.winCheckmate');
    } else {
      result = t('gameStatus.lossCheckmate');
    }
  } else if (status === 'stalemate') {
    result = t('gameStatus.stalemate');
  } else if (status === 'draw') {
    const reason = translateDrawReason(language, drawReason);
    result = reason
      ? t('gameStatus.drawWithReason', { reason })
      : t('gameStatus.draw');
  }

  const feedback =
    feedbackNotice === 'illegal'
      ? t('gameStatus.feedbackIllegal')
      : feedbackNotice === 'newPosition'
        ? t('gameStatus.feedbackNewPosition')
        : null;

  return (
    <section className="game-status-panel" aria-live="polite">
      <h2 className="game-status-title">{t('gameStatus.title')}</h2>

      <dl className="game-status-list">
        <div className="game-status-row">
          <dt>{t('gameStatus.final')}</dt>
          <dd>{t(exerciseLabelKey(exercise))}</dd>
        </div>
        <div className="game-status-row">
          <dt>{t('gameStatus.difficulty')}</dt>
          <dd>{t(difficultyKey(def.difficulty))}</dd>
        </div>
        <div className="game-status-row">
          <dt>{t('gameStatus.forcedMate')}</dt>
          <dd>
            {getMateLabel(language, exercise, isSpecialExercise(exercise), def.forceableMate)}
          </dd>
        </div>
        <div className="game-status-row">
          <dt>{t('gameStatus.mode')}</dt>
          <dd>{t(gameModeKey(mode))}</dd>
        </div>
        <div className="game-status-row">
          <dt>{t('gameStatus.side')}</dt>
          <dd>{playerSide === 'white' ? t('side.white') : t('side.black')}</dd>
        </div>
        <div className="game-status-row">
          <dt>{t('gameStatus.objective')}</dt>
          <dd>{roleHint}</dd>
        </div>
        {turn && (
          <div className="game-status-row">
            <dt>{t('gameStatus.turn')}</dt>
            <dd>{turn}</dd>
          </div>
        )}
        <div className="game-status-row">
          <dt>{t('gameStatus.moves')}</dt>
          <dd>{playerMoveCount}</dd>
        </div>
      </dl>

      {feedback && (
        <p className="game-status-alert game-status-alert--info">{feedback}</p>
      )}

      {isMachineThinking && (
        <p className="game-status-alert game-status-alert--thinking">
          {t('gameStatus.machineThinking')}
        </p>
      )}

      {check && !isMachineThinking && (
        <p className="game-status-alert game-status-alert--check">{check}</p>
      )}

      {result && !suppressResultAlert && (
        <p className="game-status-alert game-status-alert--result">{result}</p>
      )}

      {status === 'idle' && (
        <p className="game-status-idle">{t('gameStatus.idle')}</p>
      )}

      <div className="game-status-actions">
        <button type="button" className="btn-action" onClick={onNewPosition}>
          {t('gameStatus.newPosition')}
        </button>
        <button type="button" className="btn-action btn-action--secondary" onClick={onRestart}>
          {t('gameStatus.restart')}
        </button>
      </div>
    </section>
  );
}
