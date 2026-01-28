import type { Tetromino, TetrominoType, Board, Position } from '@/app/types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0',
  J: '#0000f0',
  L: '#f0a000',
  O: '#f0f000',
  S: '#00f000',
  T: '#a000f0',
  Z: '#f00000',
};

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

export function createRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    type,
    shape: TETROMINO_SHAPES[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINO_SHAPES[type][0].length / 2), y: 0 },
    color: TETROMINO_COLORS[type],
  };
}

export function isValidPosition(
  board: Board,
  piece: Tetromino,
  position: Position
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX] !== null)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function mergePieceToBoard(board: Board, piece: Tetromino): Board {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard: Board = [];
  let linesCleared = 0;

  for (let y = 0; y < board.length; y++) {
    if (board[y].every(cell => cell !== null)) {
      linesCleared++;
    } else {
      newBoard.push([...board[y]]);
    }
  }

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }

  return { newBoard, linesCleared };
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );

  return {
    ...piece,
    shape: newShape,
  };
}

export function calculateScore(linesCleared: number): number {
  const scores = [0, 100, 300, 500, 800];
  return scores[Math.min(linesCleared, scores.length - 1)];
}
