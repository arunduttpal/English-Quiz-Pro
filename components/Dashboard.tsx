
import React from 'react';

interface DashboardProps {
  onPractice: () => void;
  onBookmarks: () => void;
  onWrong: () => void;
  onScoreCard: () => void;
  onMock: () => void;
  stats: any;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onPractice, onBookmarks, onWrong, onScoreCard, onMock, stats 
}) => {
  const tiles = [
    { 
      label: "Practice", 
      icon: "📚",
      color: "bg-emerald-500",
      desc: "Topic-wise Learning",
      action: onPractice 
    },
    { 
      label: "BookMark", 
      icon: "🔖",
      color: "bg-amber-500",
      desc: "Saved Questions",
      action: onBookmarks 
    },
    { 
      label: "Wrong Attem.", 
      icon: "❌",
      color: "bg-rose-500",
      desc: "Review Errors",
      action: onWrong 
    },
    { 
      label: "Imp. Vocab", 
      icon: "📖",
      color: "bg-indigo-500",
      desc: "Word Power",
      action: () => alert("Vocabulary section loading...") 
    },
    { 
      label: "Score Card", 
      icon: "📊",
      color: "bg-cyan-500",
      desc: "Performance Stats",
      action: onScoreCard 
    },
    { 
      label: "Mock test", 
      icon: "⏱️",
      color: "bg-slate-700",
      desc: "Full Exam Simulation",
      action: onMock 
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 animate-in">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-slate-800 dark:text-white mb-2">MASTER ENGLISH</h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">Premium Exam Interface</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            onClick={tile.action}
            className="flex flex-col items-start p-8 rounded-[2.5rem] glass dark:border-white/5 transition-all hover:scale-105 active:scale-95 group shadow-xl hover:shadow-2xl border border-transparent hover:border-premium-500/30"
          >
            <div className={`w-16 h-16 rounded-2xl ${tile.color} flex items-center justify-center text-3xl shadow-lg mb-6 group-hover:rotate-12 transition-transform`}>
              {tile.icon}
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black tracking-tight text-slate-800 dark:text-white group-hover:text-premium-500 transition-colors">
                {tile.label}
              </span>
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                {tile.desc}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
