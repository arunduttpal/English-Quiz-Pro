
import React from 'react';
import { UserStats } from '../types';

interface ResultViewProps {
  stats: UserStats;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ stats, onHome }) => {
  const latestHistory = stats.history.slice(-10); // Look at recent performance
  const correctCount = latestHistory.filter(h => h.isCorrect).length;
  const accuracy = (correctCount / latestHistory.length) * 100;

  return (
    <div className="text-center space-y-8 animate-in zoom-in duration-500 max-w-lg mx-auto">
      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold text-white">Quiz Completed!</h2>
        <p className="text-slate-400">Great job on finishing your practice session.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-2xl">
          <div className="text-3xl font-bold text-indigo-400">{correctCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Correct Answers</div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="text-3xl font-bold text-cyan-400">{accuracy.toFixed(0)}%</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Recent Accuracy</div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl space-y-4">
        <div className="text-xl font-semibold">Keep the momentum going!</div>
        <p className="text-slate-400 text-sm">
          You've now answered a total of <span className="text-white font-bold">{stats.totalAnswered}</span> questions across all your sessions.
        </p>
        <div className="flex gap-4 pt-4">
          <button 
            onClick={onHome}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      <div className="pt-8">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Analysis</h3>
        <div className="flex justify-center gap-2">
          {latestHistory.map((h, i) => (
            <div 
              key={i} 
              className={`w-6 h-6 rounded-full ${h.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} shadow-lg opacity-80`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
