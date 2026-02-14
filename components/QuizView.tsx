
import React, { useState, useEffect, useRef } from 'react';
import { Question, UserStats } from '../types';
import { getAIExtendedExplanation } from '../services/geminiService';

declare const confetti: any;

interface QuizViewProps {
  questions: Question[];
  categoryName: string;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onFinish: (score: number, history: any[]) => void;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, categoryName, stats, setStats, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [examMode, setExamMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null || isAnswered) return;
    const isCorrect = selectedOption === currentQuestion.a;
    setIsAnswered(true);
    if (isCorrect) setCurrentScore(prev => prev + 1);
    else {
      setStats(prev => ({
        ...prev,
        wrongAttempts: prev.wrongAttempts.includes(currentQuestion.id) 
          ? prev.wrongAttempts 
          : [...prev.wrongAttempts, currentQuestion.id]
      }));
    }
    setSessionHistory(prev => [...prev, {
      questionId: currentQuestion.id,
      userAnswer: selectedOption,
      isCorrect,
      timestamp: Date.now()
    }]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setAiExplanation(null);
    } else {
      if ((currentScore / questions.length) >= 0.8) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
      onFinish(currentScore, sessionHistory);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      // Optional: keep answer state if re-visiting
    }
  };

  const toggleBookmark = () => {
    setStats(prev => {
      const isBookmarked = prev.bookmarks.includes(currentQuestion.id);
      return {
        ...prev,
        bookmarks: isBookmarked ? prev.bookmarks.filter(id => id !== currentQuestion.id) : [...prev.bookmarks, currentQuestion.id]
      };
    });
  };

  const askAI = async () => {
    setIsAiLoading(true);
    const explanation = await getAIExtendedExplanation(currentQuestion.q, currentQuestion.e, currentQuestion.o[currentQuestion.a]);
    setAiExplanation(explanation || "Analysis error.");
    setIsAiLoading(false);
  };

  return (
    <div className="h-screen w-full flex flex-col animate-in overflow-hidden max-w-[1400px] mx-auto bg-transparent">
      
      {/* 🔷 1. Premium Glass Header */}
      <header className="h-[90px] flex-shrink-0 glass flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black text-premium-500 tracking-tighter">
            ENGLISH <span className="text-slate-400 dark:text-slate-500">QUIZ PRO</span>
          </h1>
          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Category</span>
            <span className="text-sm font-semibold">{categoryName}</span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="flex-grow mx-12 hidden lg:block">
           <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-premium-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
           <div className="flex justify-between mt-1">
             <span className="text-[9px] font-bold text-slate-400">{currentIndex + 1} of {questions.length} completed</span>
             <span className="text-[9px] font-bold text-premium-500">{Math.round(progress)}% Mastery</span>
           </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timer</div>
            <div className="text-xl font-mono font-bold tabular-nums text-premium-500">{formatTime(timer)}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</div>
            <div className="text-xl font-bold text-emerald-500">{currentScore}</div>
          </div>
          <button onClick={onExit} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </header>

      {/* 🔷 2. Main Layout (70/30 Split) */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* LEFT PANEL: Question (70%) */}
        <div className={`${examMode ? 'w-full' : 'w-[70%]'} h-full flex flex-col p-8 md:p-12 transition-all duration-500 overflow-hidden`}>
           <div className="max-w-3xl w-full mx-auto flex flex-col h-full">
              <div className="mb-10 animate-in">
                 <span className="text-premium-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Question Analysis</span>
                 <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed tracking-tight">
                    {currentQuestion.q}
                 </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 flex-grow overflow-y-auto no-scrollbar pr-2 pb-8">
                 {currentQuestion.o.map((option, idx) => {
                    let cardClass = "glass border-slate-200 dark:border-slate-800 hover:border-premium-500";
                    if (isAnswered) {
                      if (idx === currentQuestion.a) cardClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400";
                      else if (idx === selectedOption) cardClass = "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 opacity-60";
                      else cardClass = "opacity-40 pointer-events-none grayscale";
                    } else if (selectedOption === idx) {
                      cardClass = "selected-gradient shadow-xl shadow-premium-500/20 scale-[1.02]";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={isAnswered}
                        className={`option-card group text-left p-6 rounded-2xl border-2 flex items-center gap-6 ${cardClass}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${selectedOption === idx ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                           {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-xl font-medium">{option}</span>
                      </button>
                    );
                 })}

                 {isAnswered && (
                   <div className="mt-8 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 animate-in">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">💡</span>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Linguistic Analysis</span>
                      </div>
                      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "{currentQuestion.e}"
                      </p>
                      <button 
                        onClick={askAI} 
                        disabled={isAiLoading}
                        className="mt-6 w-full py-4 rounded-xl border-2 border-premium-500/20 text-premium-500 font-bold hover:bg-premium-500 hover:text-white transition-all text-xs tracking-widest uppercase"
                      >
                        {isAiLoading ? 'AI SYNCING...' : '✨ Generate Detailed AI Breakdown'}
                      </button>
                      {aiExplanation && (
                        <div className="mt-6 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-premium-500/30 text-sm leading-relaxed whitespace-pre-line animate-in">
                          {aiExplanation}
                        </div>
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* RIGHT PANEL: Controls (30%) */}
        <div className={`${examMode ? 'w-0 opacity-0 pointer-events-none' : 'w-[30%]'} h-full glass border-l border-slate-200 dark:border-slate-800 p-8 flex flex-col transition-all duration-500 overflow-hidden`}>
           
           <div className="flex-grow overflow-y-auto no-scrollbar space-y-10">
              <div>
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-6">Question Map</h3>
                 <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, i) => {
                       const isCurrent = i === currentIndex;
                       const isCorrect = sessionHistory.find(h => h.questionId === _.id)?.isCorrect;
                       const isAnsweredItem = sessionHistory.some(h => h.questionId === _.id);
                       
                       let btnClass = "bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent";
                       if (isAnsweredItem) {
                          btnClass = isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white";
                       }
                       if (isCurrent) btnClass = "ring-4 ring-premium-500/30 border-premium-500 z-10 scale-110 " + (isAnsweredItem ? "" : "text-premium-500 bg-white dark:bg-slate-700");

                       return (
                          <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`aspect-square rounded-xl border-2 flex items-center justify-center font-bold text-xs transition-all ${btnClass}`}
                          >
                             {i + 1}
                          </button>
                       );
                    })}
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">Exam Utilities</h3>
                 <button 
                  onClick={toggleBookmark}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${stats.bookmarks.includes(currentQuestion.id) ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
                 >
                   <span className="text-xl">{stats.bookmarks.includes(currentQuestion.id) ? '★' : '☆'}</span>
                   <span className="text-xs font-bold uppercase tracking-widest">Bookmark Question</span>
                 </button>
                 <div className="p-4 rounded-2xl border-2 border-rose-500/20 bg-rose-500/5 text-rose-500 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest">Recent Mistakes</span>
                    <span className="text-xl font-black">{stats.wrongAttempts.length}</span>
                 </div>
              </div>
           </div>

           <div className="mt-auto space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex gap-2">
                 <button onClick={handlePrev} disabled={currentIndex === 0} className="flex-1 py-4 glass border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30">
                    Previous
                 </button>
                 <button onClick={handleNext} disabled={!isAnswered} className="flex-1 py-4 glass border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30">
                    Next
                 </button>
              </div>
              <button 
                onClick={handleCheck} 
                disabled={selectedOption === null || isAnswered}
                className="w-full py-5 rounded-2xl selected-gradient text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-premium-500/20 hover:-translate-y-1 transition-all disabled:opacity-30 disabled:translate-y-0"
              >
                Submit Answer
              </button>
              <button 
                onClick={() => setExamMode(!examMode)}
                className="w-full py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-premium-500 transition-colors"
              >
                {examMode ? 'Show Utilities (Exit Exam Mode)' : 'Enter Exam Mode (Full Width)'}
              </button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default QuizView;
