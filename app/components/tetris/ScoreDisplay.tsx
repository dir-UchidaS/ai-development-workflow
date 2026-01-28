interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-2">Score</h3>
      <div className="text-3xl font-bold text-blue-400">{score}</div>
    </div>
  );
}
