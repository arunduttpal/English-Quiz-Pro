
import React, { useState, useEffect } from 'react';
import { AppMode, UserStats, Question } from './types';
import { QUESTIONS_DATA } from './constants';
import Dashboard from './components/Dashboard';
import PracticeFolder from './components/PracticeFolder';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.MAIN_DASHBOARD);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('english_quiz_stats_v2');
    return saved ? JSON.parse(saved) : {
      score: 0,
      totalAnswered: 0,
      bookmarks: [],
      wrongAttempts: [],
      history: []
    };
  });

  useEffect(() => {
    localStorage.setItem('english_quiz_stats_v2', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSelectPractice = () => setMode(AppMode.PRACTICE_FOLDER);
  const handleBackToMain = () => setMode(AppMode.MAIN_DASHBOARD);

  const handleSelectCategory = (categoryTitle: string) => {
    const filtered = QUESTIONS_DATA.filter(q => q.category === categoryTitle);
    if (filtered.length === 0) {
      alert(`Section "${categoryTitle}" is coming soon!`);
      return;
    }
    setCurrentCategory(categoryTitle);
    setActiveQuestions([...filtered].sort(() => Math.random() - 0.5));
    setMode(AppMode.QUIZ);
  };

  const startSpecialSession = (type: 'bookmarks' | 'wrong' | 'mock') => {
    let filtered: Question[] = [];
    if (type === 'bookmarks') {
      filtered = QUESTIONS_DATA.filter(q => stats.bookmarks.includes(q.id));
      setCurrentCategory('My Bookmarks');
    } else if (type === 'wrong') {
      filtered = QUESTIONS_DATA.filter(q => stats.wrongAttempts.includes(q.id));
      setCurrentCategory('Review Mistakes');
    } else {
      filtered = [...QUESTIONS_DATA].sort(() => Math.random() - 0.5).slice(0, 20);
      setCurrentCategory('Full Mock Test');
    }

    if (filtered.length === 0) {
      alert("No questions found for this session!");
      return;
    }

    setActiveQuestions(filtered);
    setMode(AppMode.QUIZ);
  };

  const handleQuizFinish = (sessionScore: number, sessionHistory: any[]) => {
    setStats(prev => ({
      ...prev,
      score: prev.score + sessionScore,
      totalAnswered: prev.totalAnswered + sessionHistory.length,
      history: [...prev.history, ...sessionHistory]
    }));
    setMode(AppMode.RESULTS);
  };

  return (
    <div className="h-screen w-full flex flex-col transition-colors duration-300">
      {/* Settings Bar (Floating Toggle) */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-12 h-12 rounded-full glass shadow-xl flex items-center justify-center text-xl hover:scale-110 transition-transform"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>

      <main className="flex-grow flex flex-col overflow-hidden">
        {mode === AppMode.MAIN_DASHBOARD && (
          <div className="flex-grow overflow-y-auto no-scrollbar">
            <Dashboard 
              onPractice={handleSelectPractice}
              onBookmarks={() => startSpecialSession('bookmarks')}
              onWrong={() => startSpecialSession('wrong')}
              onScoreCard={() => setMode(AppMode.RESULTS)}
              onMock={() => startSpecialSession('mock')}
              stats={stats}
            />
          </div>
        )}

        {mode === AppMode.PRACTICE_FOLDER && (
          <div className="flex-grow overflow-y-auto no-scrollbar p-8">
             <div className="max-w-4xl mx-auto">
                <PracticeFolder 
                  onSelectCategory={handleSelectCategory}
                  onBack={handleBackToMain}
                  stats={stats}
                />
             </div>
          </div>
        )}

        {mode === AppMode.QUIZ && (
          <QuizView 
            questions={activeQuestions} 
            categoryName={currentCategory}
            stats={stats}
            setStats={setStats}
            onFinish={handleQuizFinish}
            onExit={() => setMode(AppMode.PRACTICE_FOLDER)}
          />
        )}

        {mode === AppMode.RESULTS && (
          <div className="flex-grow flex items-center justify-center p-8">
            <ResultView 
              stats={stats}
              onHome={handleBackToMain}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
