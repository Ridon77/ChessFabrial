import { createGame, isKingInCheck } from './gameState';
import { KING_SPECIAL_IMAGE_PATHS, PIECE_IMAGE_PATHS } from './chessConstants';

export type KingVisualState = 'normal' | 'check' | 'checkmate';

export function getKingVisualStates(fen: string): Record<'white' | 'black', KingVisualState> {
  const game = createGame(fen);
  let white: KingVisualState = 'normal';
  let black: KingVisualState = 'normal';

  if (game.isCheckmate()) {
    if (game.turn() === 'w') {
      white = 'checkmate';
    } else {
      black = 'checkmate';
    }
    return { white, black };
  }

  if (isKingInCheck(fen, 'w')) {
    white = 'check';
  }
  if (isKingInCheck(fen, 'b')) {
    black = 'check';
  }

  return { white, black };
}

export function kingImageSrc(color: 'white' | 'black', state: KingVisualState): string {
  if (state === 'checkmate') {
    return color === 'white'
      ? KING_SPECIAL_IMAGE_PATHS['king-white-cm']
      : KING_SPECIAL_IMAGE_PATHS['king-black-cm'];
  }
  if (state === 'check') {
    return color === 'white'
      ? KING_SPECIAL_IMAGE_PATHS['king-white-m']
      : KING_SPECIAL_IMAGE_PATHS['king-black-m'];
  }
  return PIECE_IMAGE_PATHS[`${color}-king`];
}
