interface ControlsProps {
  onStart: () => void;
  onPause: () => void;
  isGameOver: boolean;
  isPaused: boolean;
  hasStarted: boolean;
}

export function Controls({
  onStart,
  onPause,
  isGameOver,
  isPaused,
  hasStarted,
}: ControlsProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Controls</h3>
      <div className="space-y-2 text-sm text-slate-300 mb-4">
        <div className="flex justify-between">
          <span>Move:</span>
          <span className="text-slate-100">← →</span>
        </div>
        <div className="flex justify-between">
          <span>Rotate:</span>
          <span className="text-slate-100">↑</span>
        </div>
        <div className="flex justify-between">
          <span>Soft Drop:</span>
          <span className="text-slate-100">↓</span>
        </div>
        <div className="flex justify-between">
          <span>Hard Drop:</span>
          <span className="text-slate-100">Space</span>
        </div>
      </div>
      <div className="space-y-2">
        {!hasStarted || isGameOver ? (
          <button
            onClick={onStart}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
          >
            {isGameOver ? 'Restart' : 'Start Game'}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-semibold"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  );
}
