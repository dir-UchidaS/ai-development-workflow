import type { Board, Tetromino } from '@/app/types/tetris';

interface GameBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
}

export function GameBoard({ board, currentPiece }: GameBoardProps) {
  const displayBoard = board.map(row => [...row]);

  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;
          if (
            boardY >= 0 &&
            boardY < board.length &&
            boardX >= 0 &&
            boardX < board[0].length
          ) {
            displayBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
  }

  return (
    <div
      className="inline-grid gap-[1px] bg-slate-700 p-1 rounded-lg"
      style={{
        gridTemplateColumns: `repeat(${board[0].length}, 1.5rem)`,
      }}
    >
      {displayBoard.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className="w-6 h-6 border border-slate-600 rounded-sm"
            style={{
              backgroundColor: cell || '#1e293b',
            }}
          />
        ))
      )}
    </div>
  );
}
