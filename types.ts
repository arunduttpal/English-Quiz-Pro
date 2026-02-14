
export interface Question {
  id: number;
  q: string;
  o: string[];
  a: number;
  e: string;
  category: string;
}

export interface UserStats {
  score: number;
  totalAnswered: number;
  bookmarks: number[];
  wrongAttempts: number[];
  history: {
    questionId: number;
    userAnswer: number;
    isCorrect: boolean;
    timestamp: number;
  }[];
}

export enum AppMode {
  MAIN_DASHBOARD = 'MAIN_DASHBOARD',
  PRACTICE_FOLDER = 'PRACTICE_FOLDER',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}

export interface Category {
  title: string;
  desc: string;
  icon: string;
  gradient: string;
}
