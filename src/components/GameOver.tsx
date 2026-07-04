interface GameOverProps {
  score: number;
  hiScore: number;
  onRestart: () => void;
}

export function GameOver({ score, hiScore, onRestart }: GameOverProps) {
  const isNewBest = score >= hiScore && score > 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
      <div className="bg-gray-900 rounded-2xl p-8 text-center shadow-2xl border border-gray-700 max-w-xs w-full mx-4">
        <h2 className="text-2xl font-bold mb-2">Game Over</h2>
        {isNewBest && (
          <p className="text-yellow-400 font-bold text-sm mb-3 animate-pop">New Best!</p>
        )}
        <div className="flex justify-center gap-6 mb-6">
          <div>
            <div className="text-xs text-gray-400 uppercase">Score</div>
            <div className="text-3xl font-bold tabular-nums">{score}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase">Best</div>
            <div className="text-3xl font-bold tabular-nums text-yellow-400">{hiScore}</div>
          </div>
        </div>
        <button
          onClick={onRestart}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl active:scale-95 transition-transform duration-160 ease-out"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
