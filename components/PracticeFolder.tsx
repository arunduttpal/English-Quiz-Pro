
import React from 'react';
import { CATEGORIES } from '../constants';

interface PracticeFolderProps {
  onSelectCategory: (category: string) => void;
  onBack: () => void;
  stats: any;
}

const PracticeFolder: React.FC<PracticeFolderProps> = ({ onSelectCategory, onBack, stats }) => {
  return (
    <div className="flex flex-col gap-4 pb-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-white">
          ←
        </button>
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Practice Folder</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select Category</p>
        </div>
      </div>

      {CATEGORIES.map((cat, idx) => (
        <button
          key={idx}
          onClick={() => onSelectCategory(cat.title)}
          className={`group relative flex items-center justify-between w-full rounded-3xl p-6 text-left transition-all hover:scale-[1.01] active:scale-[0.98] overflow-hidden shadow-2xl bg-gradient-to-r ${cat.gradient}`}
        >
          <div className="relative z-10 flex-grow pr-4">
            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">
              {cat.title}
            </h3>
            <p className="text-slate-100/70 text-xs font-medium max-w-[85%] leading-relaxed">
              {cat.desc}
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <div className="text-5xl filter saturate-[1.2]">
              {cat.icon}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-500"></div>
        </button>
      ))}

      <div className="mt-8 p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Global Mastery</p>
        <div className="text-3xl font-black text-white">{( (stats.score / (QUESTIONS_DATA.length * 10 || 1)) * 100 ).toFixed(1)}%</div>
        <p className="text-[10px] text-slate-600 mt-2 italic">Keep practicing to reach 100% completion</p>
      </div>
    </div>
  );
};

export default PracticeFolder;
import { QUESTIONS_DATA } from '../constants';
