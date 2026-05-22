export const BOARD_FILES = 'abcdefgh';

export const ALL_SQUARES: string[] = BOARD_FILES.split('').flatMap((file) =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((rank) => `${file}${rank}`),
);

export function parseSquareCoords(square: string): { file: number; rank: number } {
  return {
    file: square.charCodeAt(0) - 97,
    rank: Number(square[1]),
  };
}

/** Casella clara (a1 és fosca). */
export function isLightSquare(square: string): boolean {
  const { file, rank } = parseSquareCoords(square);
  return (file + rank) % 2 === 0;
}

export function isDarkSquare(square: string): boolean {
  return !isLightSquare(square);
}

export function squaresOfColor(color: 'light' | 'dark'): string[] {
  return ALL_SQUARES.filter((square) =>
    color === 'light' ? isLightSquare(square) : isDarkSquare(square),
  );
}

export function kingsAreAdjacentSquares(
  whiteKing: string,
  blackKing: string,
): boolean {
  const a = parseSquareCoords(whiteKing);
  const b = parseSquareCoords(blackKing);
  return Math.abs(a.file - b.file) <= 1 && Math.abs(a.rank - b.rank) <= 1;
}

export function parseBoardPieces(fen: string): Map<string, string> {
  const boardPart = fen.split(' ')[0];
  const ranks = boardPart.split('/');
  const pieces = new Map<string, string>();

  for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
    const rank = 8 - rankIndex;
    let fileIndex = 0;

    for (const char of ranks[rankIndex]) {
      if (char >= '1' && char <= '8') {
        fileIndex += Number(char);
      } else {
        const file = BOARD_FILES[fileIndex];
        pieces.set(`${file}${rank}`, char);
        fileIndex += 1;
      }
    }
  }

  return pieces;
}

export function kingsAreAdjacentOnBoard(pieces: Map<string, string>): boolean {
  let whiteKing: string | null = null;
  let blackKing: string | null = null;

  for (const [square, piece] of pieces) {
    if (piece === 'K') {
      whiteKing = square;
    }
    if (piece === 'k') {
      blackKing = square;
    }
  }

  if (!whiteKing || !blackKing) {
    return true;
  }

  return kingsAreAdjacentSquares(whiteKing, blackKing);
}

export function buildFenFromPlacement(placement: Map<string, string>): string {
  const ranks: string[] = [];

  for (let rank = 8; rank >= 1; rank -= 1) {
    let row = '';
    let empty = 0;

    for (const file of BOARD_FILES) {
      const square = `${file}${rank}`;
      const piece = placement.get(square);

      if (piece) {
        if (empty > 0) {
          row += String(empty);
          empty = 0;
        }
        row += piece;
      } else {
        empty += 1;
      }
    }

    if (empty > 0) {
      row += String(empty);
    }

    ranks.push(row);
  }

  return `${ranks.join('/')} w - - 0 1`;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
