import type { PieceRenderObject } from 'react-chessboard';
import {
  kingImageSrc,
  getKingVisualStates,
  type KingVisualState,
} from './kingVisuals';
import { PIECE_IMAGE_PATHS } from './chessConstants';

function pieceImage(src: string) {
  return function PieceImg(props?: {
    fill?: string;
    square?: string;
    svgStyle?: React.CSSProperties;
  }) {
    const { svgStyle } = props ?? {};
    return (
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          ...svgStyle,
        }}
      />
    );
  };
}

/** Peces amb estats visuals de rei ja resolts (referència estable per animacions). */
export function buildEndgameCustomPiecesFromStates(
  whiteKing: KingVisualState,
  blackKing: KingVisualState,
): PieceRenderObject {
  return {
    wK: pieceImage(kingImageSrc('white', whiteKing)),
    wQ: pieceImage(PIECE_IMAGE_PATHS['white-queen']),
    wR: pieceImage(PIECE_IMAGE_PATHS['white-rook']),
    wB: pieceImage(PIECE_IMAGE_PATHS['white-bishop']),
    wN: pieceImage(PIECE_IMAGE_PATHS['white-knight']),
    bK: pieceImage(kingImageSrc('black', blackKing)),
  };
}

/** Peces dels finals del catàleg; els reis canvien segons escac / mat (Prompt 27). */
export function buildEndgameCustomPieces(fen: string): PieceRenderObject {
  const kingStates = getKingVisualStates(fen);
  return buildEndgameCustomPiecesFromStates(kingStates.white, kingStates.black);
}
