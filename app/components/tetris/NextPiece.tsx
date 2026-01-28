import type { Tetromino } from '@/app/types/tetris';

interface NextPieceProps {
  nextPiece: Tetromino | null;
}

export function NextPiece({ nextPiece }: NextPieceProps) {
  if (!nextPiece) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Next</h3>
        <div className="w-24 h-24 bg-slate-700 rounded flex items-center justify-center">
          <span className="text-slate-500">-</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-2">Next</h3>
      <div className="inline-grid gap-[1px] bg-slate-700 p-2 rounded">
        <div
          className="grid gap-[1px]"
          style={{
            gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1.25rem)`,
          }}
        >
          {nextPiece.shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="w-5 h-5 border border-slate-600 rounded-sm"
                style={{
                  backgroundColor: cell ? nextPiece.color : '#1e293b',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
