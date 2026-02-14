
import React from 'react';

interface MainDashboardProps {
  onPractice: () => void;
  onBookmarks: () => void;
  onWrong: () => void;
  onScoreCard: () => void;
  onMock: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ 
  onPractice, onBookmarks, onWrong, onScoreCard, onMock 
}) => {
  const tiles = [
    { label: "Practice", icon: "📋", iconBg: "bg-emerald-500", action: onPractice, desc: "Subject-wise training" },
    { label: "BookMark", icon: "🔖", iconBg: "bg-blue-500", action: onBookmarks, badge: "Saved", desc: "Your saved questions" },
    { label: "Wrong Attem.", icon: "📋", iconBg: "bg-rose-500", action: onWrong, subIcon: "❌", desc: "Mistake correction" },
    { label: "Imp. Vocab", icon: "📖", iconBg: "bg-indigo-500", action: () => alert("Vocabulary section loading..."), desc: "Word power booster" },
    { label: "Score Card", icon: "🎓", iconBg: "bg-amber-500", action: onScoreCard, desc: "Detailed analysis" },
    { label: "Mock test", icon: "📝", iconBg: "bg-slate-700", action: onMock, subIcon: "⏱️", desc: "Full exam simulation" }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-slide">
      <div className="mb-12 text-center space-y-2">
        <h1 className="text-5xl font-black tracking-tighter text-slate-800 dark:text-white">SELECT MODULE</h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Premium English Mastery Suite</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-6">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            onClick={tile.action}
            className="group flex flex-col items-center justify-center glass p-8 aspect-video rounded-[2.5rem] shadow-xl transition-all hover:-translate-y-2 active:scale-95 border hover:border-premium-500/30"
          >
            <div className={`relative w-20 h-20 rounded-2xl ${tile.iconBg} flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
              <span className="text-4xl text-white">{tile.icon}</span>
              {tile.badge && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-white text-slate-900 rounded-lg text-[9px] font-black uppercase shadow-sm">
                  {tile.badge}
                </div>
              )}
            </div>
            <div className="text-center">
              <span className="block text-slate-900 dark:text-white font-black text-lg tracking-tight uppercase">{tile.label}</span>
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 group-hover:text-premium-500 transition-colors">{tile.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
