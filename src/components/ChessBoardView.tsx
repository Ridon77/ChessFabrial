import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Chessboard } from 'react-chessboard';
import type { SquareHandlerArgs } from 'react-chessboard';
import { isPlayerPiece } from '../chess/boardInteraction';
import { getLegalTargetSquares, isLegalMove } from '../chess/moveValidation';
import { buildEndgameCustomPiecesFromStates } from '../chess/customPieces';
import { getKingVisualStates } from '../chess/kingVisuals';
import { BOARD_MOVE_ANIMATION_MS } from '../config/boardAnimation';
import {
  buildGuidedSquareStyles,
  getGuidedArrows,
} from '../chess/guidedBoardAids';
import { MOVE_DOT_MARKER } from '../config/boardMarkers';
import { useLanguage } from '../i18n/useLanguage';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';
import type { TrainingMode } from '../types/TrainingMode';

export interface ChessBoardViewProps {
  fen: string;
  /** FEN per a imatges de rei (escac/mat); es retarden per no tallar l'animació de moviment. */
  kingVisualFen: string;
  exercise: ExerciseType;
  trainingMode: TrainingMode;
  playerSide: PlayerSide;
  boardLocked?: boolean;
  /** Mostra caselles atacades i fletxes (mode guiat). */
  guidedAidsVisible?: boolean;
  /** FEN per calcular les ajudes (pot ser la posició després de la jugada blanca). */
  guidedAidsPositionFen?: string;
  onPlayerMove?: (from: string, to: string) => void;
  onIllegalMove?: () => void;
}

function clearSelection(
  setSelectedSquare: (value: string | null) => void,
  setLegalTargets: (value: string[]) => void,
) {
  setSelectedSquare(null);
  setLegalTargets([]);
}

export function ChessBoardView({
  fen,
  kingVisualFen,
  exercise,
  trainingMode,
  playerSide,
  boardLocked = false,
  guidedAidsVisible = false,
  guidedAidsPositionFen,
  onPlayerMove,
  onIllegalMove,
}: ChessBoardViewProps) {
  const { t } = useLanguage();
  const boardOrientation: 'white' | 'black' =
    playerSide === 'black' ? 'black' : 'white';
  const canInteract = !boardLocked && Boolean(onPlayerMove);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);

  useEffect(() => {
    clearSelection(setSelectedSquare, setLegalTargets);
  }, [fen, boardLocked]);

  const selectPiece = useCallback(
    (square: string) => {
      setSelectedSquare(square);
      setLegalTargets(getLegalTargetSquares(fen, square));
    },
    [fen],
  );

  const handleSquareClick = useCallback(
    ({ piece, square }: SquareHandlerArgs) => {
      if (!canInteract) {
        return;
      }

      if (selectedSquare && legalTargets.includes(square)) {
        if (!isLegalMove(fen, selectedSquare, square)) {
          onIllegalMove?.();
          clearSelection(setSelectedSquare, setLegalTargets);
          return;
        }
        onPlayerMove?.(selectedSquare, square);
        clearSelection(setSelectedSquare, setLegalTargets);
        return;
      }

      if (piece && isPlayerPiece(piece.pieceType, playerSide)) {
        selectPiece(square);
        return;
      }

      clearSelection(setSelectedSquare, setLegalTargets);
    },
    [
      canInteract,
      fen,
      legalTargets,
      onIllegalMove,
      onPlayerMove,
      playerSide,
      selectPiece,
      selectedSquare,
    ],
  );

  const aidsFen = guidedAidsPositionFen ?? fen;
  const showGuidedAids = guidedAidsVisible && trainingMode === 'guided';

  const squareOverlayStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = showGuidedAids
      ? buildGuidedSquareStyles(aidsFen)
      : {};

    if (selectedSquare) {
      styles[selectedSquare] = {
        ...styles[selectedSquare],
        backgroundColor: 'rgba(155, 199, 0, 0.41)',
      };
    }

    return styles;
  }, [aidsFen, selectedSquare, showGuidedAids]);

  const guidedArrows = useMemo(() => {
    if (!showGuidedAids) {
      return [];
    }
    return getGuidedArrows(aidsFen, exercise);
  }, [aidsFen, exercise, showGuidedAids]);

  const legalTargetSet = useMemo(
    () => new Set(legalTargets),
    [legalTargets],
  );

  const squareRenderer = useCallback(
    ({ square, children }: SquareHandlerArgs & { children?: ReactNode }) => {
      const overlayStyle = squareOverlayStyles[square];

      return (
      <div className="chess-square-inner">
        {children}
        {overlayStyle ? (
          <div className="square-overlay" style={overlayStyle} aria-hidden />
        ) : null}
        {legalTargetSet.has(square) ? (
          <img
            src={MOVE_DOT_MARKER}
            alt=""
            className="move-target-dot"
            draggable={false}
          />
        ) : null}
      </div>
      );
    },
    [legalTargetSet, squareOverlayStyles],
  );

  const kingStates = useMemo(
    () => getKingVisualStates(kingVisualFen),
    [kingVisualFen],
  );

  const pieces = useMemo(
    () =>
      buildEndgameCustomPiecesFromStates(kingStates.white, kingStates.black),
    [kingStates.white, kingStates.black],
  );

  const options = useMemo(
    () => ({
      id: 'fabriales-endgame-board',
      position: fen,
      pieces,
      boardOrientation,
      allowDragging: false,
      allowDrawingArrows: false,
      arrows: guidedArrows,
      clearArrowsOnPositionChange: true,
      showAnimations: true,
      animationDurationInMs: BOARD_MOVE_ANIMATION_MS,
      showNotation: true,
      darkSquareStyle: { backgroundColor: '#b58863' },
      lightSquareStyle: { backgroundColor: '#f0d9b5' },
      onSquareClick: handleSquareClick,
      squareRenderer,
    }),
    [
      fen,
      pieces,
      boardOrientation,
      guidedArrows,
      handleSquareClick,
      squareRenderer,
    ],
  );

  return (
    <div
      className={`chess-board-wrapper${boardLocked ? ' chess-board-wrapper--locked' : ''}`}
      aria-label={t('board.aria')}
    >
      <Chessboard options={options} />
    </div>
  );
}
