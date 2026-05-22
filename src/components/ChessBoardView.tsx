import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Chessboard } from 'react-chessboard';
import type { SquareHandlerArgs } from 'react-chessboard';
import { isPlayerPiece } from '../chess/boardInteraction';
import { getLegalTargetSquares, isLegalMove } from '../chess/moveValidation';
import { buildEndgameCustomPiecesFromStates } from '../chess/customPieces';
import { getKingVisualStates } from '../chess/kingVisuals';
import { BOARD_MOVE_ANIMATION_MS } from '../config/boardAnimation';
import { MOVE_DOT_MARKER } from '../config/boardMarkers';
import { useLanguage } from '../i18n/useLanguage';
import type { PlayerSide } from '../types/PlayerSide';

export interface ChessBoardViewProps {
  fen: string;
  /** FEN per a imatges de rei (escac/mat); es retarden per no tallar l'animació de moviment. */
  kingVisualFen: string;
  playerSide: PlayerSide;
  boardLocked?: boolean;
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
  playerSide,
  boardLocked = false,
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

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }): boolean => {
      if (!canInteract || !targetSquare) {
        return false;
      }

      if (!isLegalMove(fen, sourceSquare, targetSquare)) {
        onIllegalMove?.();
        return false;
      }

      onPlayerMove?.(sourceSquare, targetSquare);
      clearSelection(setSelectedSquare, setLegalTargets);
      return true;
    },
    [canInteract, fen, onPlayerMove, onIllegalMove],
  );

  const canDragPiece = useCallback(
    ({ piece }: { piece: { pieceType: string }; isSparePiece: boolean }) => {
      if (!canInteract) {
        return false;
      }
      return isPlayerPiece(piece.pieceType, playerSide);
    },
    [canInteract, playerSide],
  );

  const squareStyles = useMemo(() => {
    if (!selectedSquare) {
      return {};
    }
    return {
      [selectedSquare]: {
        backgroundColor: 'rgba(155, 199, 0, 0.41)',
      },
    };
  }, [selectedSquare]);

  const legalTargetSet = useMemo(
    () => new Set(legalTargets),
    [legalTargets],
  );

  const squareRenderer = useCallback(
    ({ square, children }: SquareHandlerArgs & { children?: ReactNode }) => (
      <div className="chess-square-inner">
        {children}
        {legalTargetSet.has(square) ? (
          <img
            src={MOVE_DOT_MARKER}
            alt=""
            className="move-target-dot"
            draggable={false}
          />
        ) : null}
      </div>
    ),
    [legalTargetSet],
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
      allowDragging: canInteract,
      allowDragOffBoard: false,
      allowDrawingArrows: false,
      showAnimations: true,
      animationDurationInMs: BOARD_MOVE_ANIMATION_MS,
      showNotation: true,
      darkSquareStyle: { backgroundColor: '#b58863' },
      lightSquareStyle: { backgroundColor: '#f0d9b5' },
      squareStyles,
      canDragPiece,
      onPieceDrop: handlePieceDrop,
      onSquareClick: handleSquareClick,
      squareRenderer,
    }),
    [
      fen,
      pieces,
      boardOrientation,
      canInteract,
      canDragPiece,
      handlePieceDrop,
      handleSquareClick,
      squareRenderer,
      squareStyles,
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
