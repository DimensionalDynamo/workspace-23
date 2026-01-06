// src/types/index.ts

export interface AppSettings {
  key: 'userSettings';
  username: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  motionIntensity: number;
  pomodoroDefaults: {
    workMinutes: number;
    shortBreakMinutes: number;
    longBreakMinutes: number;
    autoStart: boolean;
  };
  aiProvider: 'gemini' | 'chatgpt';
}

export interface PomodoroSession {
  id?: number;
  startTime: number; // Unix timestamp
  endTime: number; // Unix timestamp
  duration: number; // in seconds
  subject?: string;
  chapter?: string;
  isPartial: boolean;
}

export type TaskCategory = 'NIMCET' | 'BCA' | 'Personal';

export interface Task {
  id?: number;
  title: string;
  category: TaskCategory;
  priority: 'low' | 'medium' | 'high';
  dueDate: number; // Unix timestamp
  isCompleted: boolean;
  createdAt: number; // Unix timestamp
}

export interface Habit {
  id?: number;
  title: string;
  createdAt: number; // Unix timestamp
}

export interface HabitCompletion {
  id?: number;
  habitId: number;
  date: number; // Unix timestamp (just the date part)
}

export interface Resource {
  id?: number;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'other';
  data: Blob; // The actual file data
  createdAt: number; // Unix timestamp
}

export type ProgressState = 'Not Started' | 'In Progress' | 'Practiced' | 'Revised';

export interface SyllabusTopic {
  id: string; // e.g., 'math-algebra-functions'
  name: string;
  progress: ProgressState;
}

export interface SyllabusChapter {
  id: string; // e.g., 'math-algebra'
  name:string;
  topics: SyllabusTopic[];
}

export interface SyllabusSubject {
  id: string; // e.g., 'math'
  name: string;
  chapters: SyllabusChapter[];
}

export interface MockTest {
  id?: number;
  date: number; // Unix timestamp
  totalScore: number;
  timeTaken: number; // in minutes
  subjectScores: Record<string, number>; // subjectId -> score
  chapterScores: Record<string, number>; // chapterId -> score
  notes?: string;
}

export interface AIInsight {
  id?: number;
  provider: 'gemini' | 'chatgpt';
  prompt: string;
  response: string;
  timestamp: number; // Unix timestamp
}

export type AchievementBadge =
  | 'first-task'
  | 'ten-tasks'
  | 'chapter-complete'
  | 'subject-master'
  | 'focus-hour-1'
  | 'focus-hour-10'
  | 'perfect-score-mock'
  | 'revision-streak-7'
  | 'all-badges';


export interface Achievement {
  id: AchievementBadge;
  unlockedAt: number | null; // Unix timestamp
}
