import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyInitialMachineTurn,
  applyMachineTurn,
  applyPlayerMoveOnly,
  isBoardPlayable,
  MACHINE_THINKING_DELAY_MS,
  shouldScheduleMachineMove,
} from './chess/gameFlow';
import { BOARD_MOVE_ANIMATION_MS } from './config/boardAnimation';
import { DEFAULT_PLAYER_SIDE } from './config/featureFlags';
import { snapshotFromFen } from './chess/gameState';
import { resetExerciseSession } from './chess/resetExerciseSession';
import {
  appendGameResult,
  buildGameResult,
  createEmptySessionStats,
  isTerminalGameStatus,
  outcomeFromGameEnd,
  startActiveGame,
  type ActiveGameRecord,
} from './chess/sessionStats';
import { ChessBoardView } from './components/ChessBoardView';
import {
  GameStatus,
  type FeedbackNotice,
} from './components/GameStatus';
import { HintBox } from './components/HintBox';
import { HomeScreen } from './components/HomeScreen';
import { GameBoardActions } from './components/GameBoardActions';
import { SessionHomeSummary } from './components/SessionHomeSummary';
import { GameResultModal } from './components/GameResultModal';
import { LanguageSelector } from './components/LanguageSelector';
import { SessionStatsPanel } from './components/SessionStatsPanel';
import {
  buildGameEndModalData,
  type GameEndModalData,
} from './chess/gameResultMessages';
import type { GameSnapshot } from './chess/gameState';
import { useLanguage } from './i18n/useLanguage';
import type { SessionStats } from './types/GameResult';
import type { GameStatus as Status } from './types/ChessTypes';
import type { ExerciseType } from './types/ExerciseType';
import type { PlayerSide } from './types/PlayerSide';
import { isExerciseFullyImplemented } from './config/exerciseImplementation';
import './App.css';

const FEEDBACK_DURATION_MS = 3000;

type AppScreen = 'home' | 'game';

function App() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [sessionStats, setSessionStats] = useState<SessionStats>(createEmptySessionStats);
  const [exercise, setExercise] = useState<ExerciseType>('KQK');
  const [playerSide, setPlayerSide] = useState<PlayerSide>(DEFAULT_PLAYER_SIDE);
  const [fen, setFen] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [drawReason, setDrawReason] = useState<string | null>(null);
  const [playerMoveCount, setPlayerMoveCount] = useState(0);
  const [feedbackNotice, setFeedbackNotice] = useState<FeedbackNotice>(null);
  const [hintSessionKey, setHintSessionKey] = useState(0);

  const [gameEndModal, setGameEndModal] = useState<GameEndModalData | null>(null);

  const activeGameRef = useRef<ActiveGameRecord | null>(null);
  const gameRecordedRef = useRef(false);
  const modalShownForGameRef = useRef<number | null>(null);
  const machineMoveTimeoutRef = useRef<number | null>(null);
  const moveAnimationTimeoutRef = useRef<number | null>(null);
  const kingVisualTimeoutRef = useRef<number | null>(null);

  const [isMachineThinking, setIsMachineThinking] = useState(false);
  const [isAnimatingMove, setIsAnimatingMove] = useState(false);
  const [kingVisualFen, setKingVisualFen] = useState<string | null>(null);

  const clearPendingMachineMove = useCallback(() => {
    if (machineMoveTimeoutRef.current !== null) {
      window.clearTimeout(machineMoveTimeoutRef.current);
      machineMoveTimeoutRef.current = null;
    }
    setIsMachineThinking(false);
  }, []);

  const clearMoveAnimation = useCallback(() => {
    if (moveAnimationTimeoutRef.current !== null) {
      window.clearTimeout(moveAnimationTimeoutRef.current);
      moveAnimationTimeoutRef.current = null;
    }
    if (kingVisualTimeoutRef.current !== null) {
      window.clearTimeout(kingVisualTimeoutRef.current);
      kingVisualTimeoutRef.current = null;
    }
    setIsAnimatingMove(false);
  }, []);

  const clearBoardTimers = useCallback(() => {
    clearPendingMachineMove();
    clearMoveAnimation();
  }, [clearPendingMachineMove, clearMoveAnimation]);

  const scheduleKingVisualUpdate = useCallback((targetFen: string) => {
    if (kingVisualTimeoutRef.current !== null) {
      window.clearTimeout(kingVisualTimeoutRef.current);
    }
    kingVisualTimeoutRef.current = window.setTimeout(() => {
      kingVisualTimeoutRef.current = null;
      setKingVisualFen(targetFen);
    }, BOARD_MOVE_ANIMATION_MS);
  }, []);

  const applySnapshot = useCallback((snapshot: GameSnapshot) => {
    setFen(snapshot.fen);
    setStatus(snapshot.status);
    setDrawReason(snapshot.drawReason);
  }, []);

  const runAfterMoveAnimation = useCallback((afterAnimation: () => void) => {
    if (moveAnimationTimeoutRef.current !== null) {
      window.clearTimeout(moveAnimationTimeoutRef.current);
    }
    setIsAnimatingMove(true);
    moveAnimationTimeoutRef.current = window.setTimeout(() => {
      moveAnimationTimeoutRef.current = null;
      setIsAnimatingMove(false);
      afterAnimation();
    }, BOARD_MOVE_ANIMATION_MS);
  }, []);

  const applySnapshotAnimated = useCallback(
    (snapshot: GameSnapshot, afterAnimation?: () => void) => {
      applySnapshot(snapshot);
      scheduleKingVisualUpdate(snapshot.fen);
      runAfterMoveAnimation(afterAnimation ?? (() => undefined));
    },
    [applySnapshot, runAfterMoveAnimation, scheduleKingVisualUpdate],
  );

  const recordGame = useCallback((result: 'win' | 'draw' | 'loss' | 'aborted') => {
    const active = activeGameRef.current;
    if (!active || gameRecordedRef.current) {
      return;
    }

    const entry = buildGameResult(active, result);
    setSessionStats((stats) => appendGameResult(stats, entry));
    gameRecordedRef.current = true;
    activeGameRef.current = null;
  }, []);

  const abortActiveGameIfNeeded = useCallback(() => {
    if (activeGameRef.current && !gameRecordedRef.current && status === 'playing') {
      recordGame('aborted');
    }
  }, [recordGame, status]);

  useEffect(
    () => () => {
      clearPendingMachineMove();
      clearMoveAnimation();
    },
    [clearPendingMachineMove, clearMoveAnimation],
  );

  const startPosition = useCallback(
    (
      nextExercise: ExerciseType,
      nextPlayerSide: PlayerSide,
      notice: FeedbackNotice = null,
      abortPrevious = true,
    ) => {
      clearBoardTimers();

      if (abortPrevious) {
        abortActiveGameIfNeeded();
      }

      const session = resetExerciseSession(nextExercise);
      const initialFen = session.fen;
      const flow = applyInitialMachineTurn(
        initialFen,
        nextExercise,
        nextPlayerSide,
      );

      let active = startActiveGame(nextExercise, nextPlayerSide);
      if (flow.snapshot.fen !== initialFen) {
        active = { ...active, machineMoves: 1 };
      }

      activeGameRef.current = active;
      gameRecordedRef.current = false;
      modalShownForGameRef.current = null;
      setGameEndModal(null);
      setPlayerMoveCount(0);

      setExercise(nextExercise);
      setPlayerSide(nextPlayerSide);
      setFeedbackNotice(notice);
      setHintSessionKey((key) => key + 1);
      applySnapshot(flow.snapshot);
      setKingVisualFen(flow.snapshot.fen);

      if (flow.snapshot.fen !== initialFen) {
        runAfterMoveAnimation(() => undefined);
      }

      setScreen('game');
    },
    [
      abortActiveGameIfNeeded,
      applySnapshot,
      clearBoardTimers,
      runAfterMoveAnimation,
    ],
  );

  useEffect(() => {
    if (!feedbackNotice) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setFeedbackNotice(null);
    }, FEEDBACK_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [feedbackNotice]);

  useEffect(() => {
    const active = activeGameRef.current;
    if (!active || gameRecordedRef.current || !fen) {
      return;
    }

    if (!isTerminalGameStatus(status)) {
      return;
    }

    const outcome = outcomeFromGameEnd(status, playerSide, fen);
    if (!outcome || outcome === 'aborted') {
      return;
    }

    if (modalShownForGameRef.current === active.startedAt) {
      return;
    }

    modalShownForGameRef.current = active.startedAt;
    const terminalStatus =
      status === 'checkmate' || status === 'stalemate' || status === 'draw'
        ? status
        : 'draw';

    setGameEndModal(
      buildGameEndModalData(active, outcome, terminalStatus, drawReason),
    );
    recordGame(outcome);
  }, [status, fen, playerSide, drawReason, recordGame]);

  const handleSelectExercise = (selected: ExerciseType) => {
    if (!isExerciseFullyImplemented(selected)) {
      return;
    }
    startPosition(selected, DEFAULT_PLAYER_SIDE, null, false);
  };

  const goToHome = useCallback(() => {
    clearBoardTimers();
    setGameEndModal(null);
    setScreen('home');
    setFeedbackNotice(null);
    setKingVisualFen(null);
  }, [clearBoardTimers]);

  const handleAbortGame = useCallback(() => {
    if (activeGameRef.current && !gameRecordedRef.current) {
      recordGame('aborted');
    }
    goToHome();
  }, [recordGame, goToHome]);

  const handleGoHomeFinished = useCallback(() => {
    goToHome();
  }, [goToHome]);

  const handleViewBoard = () => {
    setGameEndModal(null);
  };

  const handleGoHomeFromModal = () => {
    goToHome();
  };

  const handleReplayFromModal = useCallback(() => {
    startPosition(exercise, playerSide, null, false);
  }, [exercise, playerSide, startPosition]);

  const handleNewPosition = () => {
    startPosition(exercise, playerSide, 'newPosition');
  };

  const handleRestart = () => {
    startPosition(exercise, playerSide);
  };

  const scheduleMachineMove = useCallback(
    (fenAfterPlayer: string, gameId: number) => {
      setIsMachineThinking(true);

      machineMoveTimeoutRef.current = window.setTimeout(() => {
        machineMoveTimeoutRef.current = null;

        const currentActive = activeGameRef.current;
        if (!currentActive || currentActive.startedAt !== gameId) {
          setIsMachineThinking(false);
          return;
        }

        const machineSnapshot = applyMachineTurn(
          fenAfterPlayer,
          exercise,
          playerSide,
        );

        activeGameRef.current = {
          ...currentActive,
          machineMoves: currentActive.machineMoves + 1,
        };
        setIsMachineThinking(false);
        applySnapshotAnimated(machineSnapshot);
      }, MACHINE_THINKING_DELAY_MS);
    },
    [applySnapshotAnimated, exercise, playerSide],
  );

  const handlePlayerMove = useCallback(
    (from: string, to: string) => {
      clearBoardTimers();

      const currentFen = fen ?? '';
      const result = applyPlayerMoveOnly({
        fen: currentFen,
        from,
        to,
        playerSide,
      });

      if (!result || !activeGameRef.current) {
        return;
      }

      const active = activeGameRef.current;
      const updatedAfterPlayer: ActiveGameRecord = {
        ...active,
        playerMoves: active.playerMoves + 1,
      };
      activeGameRef.current = updatedAfterPlayer;
      setPlayerMoveCount(updatedAfterPlayer.playerMoves);

      const needsMachine = shouldScheduleMachineMove(result.snapshot, playerSide);
      const gameId = active.startedAt;

      applySnapshotAnimated(result.snapshot, () => {
        if (needsMachine) {
          scheduleMachineMove(result.snapshot.fen, gameId);
        }
      });
    },
    [
      fen,
      playerSide,
      clearBoardTimers,
      applySnapshotAnimated,
      scheduleMachineMove,
    ],
  );

  const handleIllegalMove = () => {
    setFeedbackNotice('illegal');
  };

  const boardLocked =
    isAnimatingMove ||
    isMachineThinking ||
    status !== 'playing' ||
    !fen ||
    !isBoardPlayable(snapshotFromFen(fen), playerSide);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-bar">
          <div className="app-header-brand">
            <h1>{t('app.title')}</h1>
            <p className="app-subtitle">{t('app.subtitle')}</p>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {screen === 'home' ? (
        <div className="home-page">
          <HomeScreen onSelectExercise={handleSelectExercise} />
          <SessionHomeSummary stats={sessionStats} />
        </div>
      ) : (
        <main className="app-main">
          <section className="app-controls">
            <SessionStatsPanel stats={sessionStats} compact />
            <GameStatus
              exercise={exercise}
              playerSide={playerSide}
              status={status}
              fen={fen ?? ''}
              drawReason={drawReason}
              playerMoveCount={playerMoveCount}
              feedbackNotice={feedbackNotice}
              suppressResultAlert={gameEndModal !== null}
              isMachineThinking={isMachineThinking}
              onNewPosition={handleNewPosition}
              onRestart={handleRestart}
            />
            <HintBox
              key={`${hintSessionKey}-${exercise}-${playerSide}`}
              exercise={exercise}
              playerSide={playerSide}
              fen={fen ?? undefined}
              disabled={status !== 'playing' || isMachineThinking || isAnimatingMove}
            />
          </section>

          <section className="app-board">
            {fen ? (
              <ChessBoardView
                fen={fen}
                kingVisualFen={kingVisualFen ?? fen}
                playerSide={playerSide}
                boardLocked={boardLocked}
                onPlayerMove={handlePlayerMove}
                onIllegalMove={handleIllegalMove}
              />
            ) : (
              <div className="board-placeholder" aria-label={t('board.aria')}>
                <p>{t('board.loading')}</p>
              </div>
            )}
            <GameBoardActions
              isPlaying={status === 'playing'}
              onAbort={handleAbortGame}
              onGoHome={handleGoHomeFinished}
            />
          </section>

          {gameEndModal && (
            <GameResultModal
              data={gameEndModal}
              onReplay={handleReplayFromModal}
              onViewBoard={handleViewBoard}
              onGoHome={handleGoHomeFromModal}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default App;
