import type { PieceRenderObject } from 'react-chessboard';
import { kingImageSrc, getKingVisualStates } from './kingVisuals';
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

/** Peces dels finals del catàleg; els reis canvien segons escac / mat (Prompt 27). */
export function buildEndgameCustomPieces(fen: string): PieceRenderObject {
  const kingStates = getKingVisualStates(fen);

  return {
    wK: pieceImage(kingImageSrc('white', kingStates.white)),
    wQ: pieceImage(PIECE_IMAGE_PATHS['white-queen']),
    wR: pieceImage(PIECE_IMAGE_PATHS['white-rook']),
    wB: pieceImage(PIECE_IMAGE_PATHS['white-bishop']),
    wN: pieceImage(PIECE_IMAGE_PATHS['white-knight']),
    bK: pieceImage(kingImageSrc('black', kingStates.black)),
  };
}
