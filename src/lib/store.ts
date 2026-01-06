import { create } from 'zustand'
import { localStorageService } from '@/lib/storage'
import { defaultNimetSyllabus } from '@/lib/nimcet-syllabus-data'

// Spaced repetition intervals in days (after topic completion)
const REVISION_INTERVALS = [1, 4, 7, 14, 30] // Day 1, Day 4, Day 7, Day 14, Day 30

export type Screen =
  | 'dashboard'
  | 'pomodoro'
  | 'tasks'
  | 'analytics'
  | 'nimcet'
  | 'ai'
  | 'achievements'
  | 'settings'


export type TaskCategory = 'NIMCET' | 'BCA' | 'Personal'
export type TaskPriority = 'low' | 'medium' | 'high'
export type AIEngine = 'gemini' | 'chatgpt'
export type PomodoroBackgroundType = 'color' | 'gradient' | 'image'
export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export interface PomodoroBackground {
  type: PomodoroBackgroundType
  value: string
}

export interface TopicStatus {
  id: string
  subject: string
  chapter: string
  topic: string
  status: 'Not Started' | 'In Progress' | 'Practiced' | 'Revised'
  priority: 'high' | 'medium' | 'low' | null
}

export interface RevisionTask {
  id: string
  topicId: string
  topicName: string
  subjectName: string
  chapterName: string
  scheduledFor: string
  status: 'pending' | 'done'
  revisionNumber?: number
}


export interface Notification {
  id: string
  type: 'study_reminder' | 'habit_reminder' | 'session_missed' | 'daily_summary' | 'priority_alert'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface CustomMusicTrack {
  id: string
  name: string
  fileUrl: string
  addedAt: string
}


export interface DailyRoutineItem {
  id: string
  subject: string
  scheduledTime: string
  completed: boolean
  type: 'focus' | 'practice' | 'review'
}

export interface Task {
  id: string
  title: string
  category: TaskCategory
  priority: TaskPriority
  dueDate?: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

export interface Habit {
  id: string
  title: string
  streak: number
  lastCompleted?: string
  weeklyHistory: boolean[]
  reminderTime?: string
}

export interface StudySession {
  id: string
  startTime: string
  endTime?: string
  duration: number
  subject?: string
  chapter?: string
  category: 'NIMCET' | 'BCA'
  type: 'focus' | 'practice'
}

export interface TestResult {
  id: string
  testName: string
  subject: string
  score: number
  totalScore: number
  date: string
  type: 'full' | 'topic' | 'chapter'
}

export interface ChapterStatus {
  id: string
  chapter: string
  subject: string
  status: 'Not Started' | 'In Progress' | 'Revised' | 'Practiced'
}

export interface Resource {
  id: string
  title: string
  type: 'pdf' | 'note' | 'video' | 'link'
  url: string
  subject: string
  chapter?: string
  addedAt: string
}

export interface Badge {
  id: string
  title: string
  description: string
  category: 'streak' | 'pomodoro' | 'habit' | 'syllabus' | 'test' | 'focus'
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress: number
  target: number
}

export interface AIInsight {
  id: string
  type: 'summary' | 'strength' | 'weakness' | 'plan' | 'chat'
  content: string
  date: string
}

// Default badges
const DEFAULT_BADGES: Badge[] = [
  // Streak badges
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Study for 3 days in a row',
    category: 'streak',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    target: 3,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Study for 7 days in a row',
    category: 'streak',
    icon: '⚔️',
    unlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Study for 30 days in a row',
    category: 'streak',
    icon: '👑',
    unlocked: false,
    progress: 0,
    target: 30,
  },
  // Pomodoro badges
  {
    id: 'pomodoro-10',
    title: 'Getting Started',
    description: 'Complete 10 Pomodoro sessions',
    category: 'pomodoro',
    icon: '🍅',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'pomodoro-50',
    title: 'Focus Pro',
    description: 'Complete 50 Pomodoro sessions',
    category: 'pomodoro',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'pomodoro-100',
    title: 'Deep Focus Legend',
    description: 'Complete 100 Pomodoro sessions',
    category: 'pomodoro',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    target: 100,
  },
  // Focus time badges
  {
    id: 'focus-10h',
    title: '10 Hours',
    description: 'Study for 10 hours total',
    category: 'focus',
    icon: '⏱️',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'focus-100h',
    title: 'Century',
    description: 'Study for 100 hours total',
    category: 'focus',
    icon: '💯',
    unlocked: false,
    progress: 0,
    target: 100,
  },
  {
    id: 'focus-500h',
    title: 'Half a Grand',
    description: 'Study for 500 hours total',
    category: 'focus',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    target: 500,
  },
  // Test badges
  {
    id: 'test-5',
    title: 'Test Beginner',
    description: 'Complete 5 mock tests',
    category: 'test',
    icon: '📝',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: 'test-25',
    title: 'Test Champion',
    description: 'Complete 25 mock tests',
    category: 'test',
    icon: '🎖️',
    unlocked: false,
    progress: 0,
    target: 25,
  },
  // Syllabus badges
  {
    id: 'syllabus-50',
    title: 'Halfway There',
    description: 'Complete 50% of syllabus',
    category: 'syllabus',
    icon: '📚',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'syllabus-100',
    title: 'Syllabus Master',
    description: 'Complete 100% of syllabus',
    category: 'syllabus',
    icon: '🎓',
    unlocked: false,
    progress: 0,
    target: 100,
  },
]

interface AppState {
  // Navigation
  currentScreen: Screen
  setCurrentScreen: (screen: Screen) => void

  // User
  userName: string
  setUserName: (name: string) => void

  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  // Habits
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
  addHabit: (habit: Omit<Habit, 'id' | 'weeklyHistory'>) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  toggleHabitDay: (id: string, dayIndex: number) => void

  // Study Sessions
  studySessions: StudySession[]
  setStudySessions: (sessions: StudySession[]) => void
  addStudySession: (session: Omit<StudySession, 'id' | 'startTime'>) => void
  updateStudySession: (id: string, updates: Partial<StudySession>) => void

  // Test Results
  testResults: TestResult[]
  setTestResults: (results: TestResult[]) => void
  addTestResult: (result: Omit<TestResult, 'id'>) => void

  // Syllabus
  syllabusProgress: ChapterStatus[]
  setSyllabusProgress: (progress: ChapterStatus[]) => void
  updateChapterStatus: (id: string, status: ChapterStatus['status']) => void

  // Topics (NIMCET hierarchy)
  topics: TopicStatus[]
  setTopics: (topics: TopicStatus[]) => void
  addTopic: (topic: Omit<TopicStatus, 'id'>) => void
  updateTopicStatus: (id: string, status: TopicStatus['status']) => void

  // Revision Tasks
  revisionTasks: RevisionTask[]
  setRevisionTasks: (tasks: RevisionTask[]) => void
  updateRevisionTask: (id: string, updates: Partial<RevisionTask>) => void

  // Resources
  resources: Resource[]
  setResources: (resources: Resource[]) => void
  addResource: (resource: Omit<Resource, 'id' | 'addedAt'>) => void
  deleteResource: (id: string) => void

  // Achievements
  badges: Badge[]
  setBadges: (badges: Badge[]) => void
  unlockBadge: (id: string) => void
  updateBadgeProgress: (id: string, progress: number) => void
  checkAndUnlockBadges: () => void

  // AI Insights
  aiInsights: AIInsight[]
  setAIInsights: (insights: AIInsight[]) => void
  addAIInsight: (insight: Omit<AIInsight, 'id' | 'date'>) => void

  // Stats
  todayStudyTime: number
  setTodayStudyTime: (time: number) => void
  currentStreak: number
  setCurrentStreak: (streak: number) => void

  // Notifications
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void

  // Daily Routine
  dailyRoutine: DailyRoutineItem[]
  setDailyRoutine: (routine: DailyRoutineItem[]) => void

  // Custom Music
  customMusicTracks: CustomMusicTrack[]
  setCustomMusicTracks: (tracks: CustomMusicTrack[]) => void
  addCustomMusicTrack: (track: Omit<CustomMusicTrack, 'id' | 'addedAt'>) => void
  removeCustomMusicTrack: (id: string) => void

  // Pomodoro
  activeSession: StudySession | null
  setActiveSession: (session: StudySession | null) => void
  pomodoroBackground: PomodoroBackground
  setPomodoroBackground: (bg: PomodoroBackground) => void
  selectedMusicTrack: string
  setSelectedMusicTrack: (trackId: string) => void

  // Settings
  pomodoroWorkTime: number
  setPomodoroWorkTime: (time: number) => void
  pomodoroShortBreak: number
  setPomodoroShortBreak: (time: number) => void
  pomodoroLongBreak: number
  setPomodoroLongBreak: (time: number) => void
  autoStartPomodoro: boolean
  setAutoStartPomodoro: (enabled: boolean) => void
  autoLogStudyTime: boolean
  setAutoLogStudyTime: (enabled: boolean) => void
  aiEnabled: boolean
  setAIEnabled: (enabled: boolean) => void
  aiEngine: AIEngine
  setAIEngine: (engine: AIEngine) => void

  // Sync
  autoSyncEnabled: boolean
  setAutoSyncEnabled: (enabled: boolean) => void
  lastSyncTimestamp: number
  setLastSyncTimestamp: (timestamp: number) => void
}

export const useStore = create<AppState>((set, get) => ({
  // Navigation
  currentScreen: localStorageService.get('lastScreen') as Screen || 'dashboard',
  setCurrentScreen: (screen) => {
    set({ currentScreen: screen })
    localStorageService.set('lastScreen', screen)
  },

  // User
  userName: 'Aditya Anand',
  setUserName: (name) => {
    set({ userName: name })
    localStorageService.set('userName', name)
  },

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({
    tasks: [
      ...state.tasks,
      {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
    ],
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    ),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),

  // Habits
  habits: [],
  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => set((state) => ({
    habits: [
      ...state.habits,
      {
        ...habit,
        id: crypto.randomUUID(),
        weeklyHistory: [false, false, false, false, false, false],
      },
    ],
  })),
  updateHabit: (id, updates) => set((state) => ({
    habits: state.habits.map((habit) =>
      habit.id === id ? { ...habit, ...updates } : habit
    ),
  })),
  deleteHabit: (id) => set((state) => ({
    habits: state.habits.filter((habit) => habit.id !== id),
  })),
  toggleHabitDay: (id, dayIndex) => set((state) => ({
    habits: state.habits.map((habit) =>
      habit.id === id
        ? {
          ...habit,
          weeklyHistory: habit.weeklyHistory.map((completed, i) =>
            i === dayIndex ? !completed : completed
          ),
        }
        : habit
    ),
  })),

  // Study Sessions
  studySessions: [],
  setStudySessions: (sessions) => set({ studySessions: sessions }),
  addStudySession: (session) => set((state) => ({
    studySessions: [
      ...state.studySessions,
      {
        ...session,
        id: crypto.randomUUID(),
        startTime: new Date().toISOString(),
      },
    ],
  })),
  updateStudySession: (id, updates) => set((state) => ({
    studySessions: state.studySessions.map((session) =>
      session.id === id ? { ...session, ...updates } : session
    ),
  })),

  // Test Results
  testResults: [],
  setTestResults: (results) => set({ testResults: results }),
  addTestResult: (result) => set((state) => ({
    testResults: [
      ...state.testResults,
      { ...result, id: crypto.randomUUID() },
    ],
  })),

  // Syllabus
  syllabusProgress: [],
  setSyllabusProgress: (progress) => set({ syllabusProgress: progress }),
  updateChapterStatus: (id, status) => set((state) => ({
    syllabusProgress: state.syllabusProgress.map((chapter) =>
      chapter.id === id ? { ...chapter, status } : chapter
    ),
  })),

  // Topics - auto-load syllabus if empty
  topics: defaultNimetSyllabus,
  setTopics: (topics) => set({ topics }),
  addTopic: (topic) => set((state) => ({
    topics: [
      ...state.topics,
      {
        ...topic,
        id: crypto.randomUUID(),
      },
    ],
  })),
  updateTopicStatus: (id, status) => {
    const state = get()
    const topic = state.topics.find(t => t.id === id)

    // Update the topic status
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    }))

    // If status changed to 'Revised', schedule spaced repetition revisions
    if (status === 'Revised' && topic) {
      const now = new Date()
      const newRevisionTasks: RevisionTask[] = REVISION_INTERVALS.map((days, index) => {
        const scheduledDate = new Date(now)
        scheduledDate.setDate(scheduledDate.getDate() + days)
        return {
          id: crypto.randomUUID(),
          topicId: topic.id,
          topicName: topic.topic,
          subjectName: topic.subject,
          chapterName: topic.chapter,
          scheduledFor: scheduledDate.toISOString(),
          status: 'pending' as const,
          revisionNumber: index + 1,
        }
      })

      // Add notification for immediate review
      get().addNotification({
        type: 'study_reminder',
        title: '📚 Topic Completed!',
        message: `Great job completing "${topic.topic}"! Do a quick review now, then revisions are scheduled for Days 1, 4, 7, 14, and 30.`,
        priority: 'high',
      })

      // Add revision tasks to the store
      set((state) => ({
        revisionTasks: [...state.revisionTasks, ...newRevisionTasks],
      }))
    }
  },

  // Revision Tasks
  revisionTasks: [],
  setRevisionTasks: (tasks) => set({ revisionTasks: tasks }),
  updateRevisionTask: (id, updates) => set((state) => ({
    revisionTasks: state.revisionTasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    ),
  })),


  // Resources
  resources: [],
  setResources: (resources) => set({ resources }),
  addResource: (resource) => set((state) => ({
    resources: [
      ...state.resources,
      {
        ...resource,
        id: crypto.randomUUID(),
        addedAt: new Date().toISOString(),
      },
    ],
  })),
  deleteResource: (id) => set((state) => ({
    resources: state.resources.filter((resource) => resource.id !== id),
  })),

  // Achievements
  badges: DEFAULT_BADGES,
  setBadges: (badges) => set({ badges }),
  unlockBadge: (id) => set((state) => ({
    badges: state.badges.map((badge) =>
      badge.id === id
        ? { ...badge, unlocked: true, unlockedAt: new Date().toISOString() }
        : badge
    ),
  })),
  updateBadgeProgress: (id, progress) => set((state) => ({
    badges: state.badges.map((badge) =>
      badge.id === id ? { ...badge, progress } : badge
    ),
  })),
  checkAndUnlockBadges: () => {
    const state = get()
    const { currentStreak, studySessions, testResults, todayStudyTime } = state

    // Calculate total study time in hours
    const totalStudyTime = studySessions.reduce((acc, session) => acc + session.duration, 0) / 3600
    const totalPomodoros = studySessions.filter(s => s.type === 'focus').length
    const totalTests = testResults.length

    // Check streak badges
    const streakBadges = ['streak-3', 'streak-7', 'streak-30']
    streakBadges.forEach(badgeId => {
      const badge = state.badges.find(b => b.id === badgeId)
      if (badge && !badge.unlocked && currentStreak >= badge.target) {
        get().unlockBadge(badgeId)
      } else if (badge) {
        get().updateBadgeProgress(badgeId, Math.min(currentStreak, badge.target))
      }
    })

    // Check pomodoro badges
    const pomodoroBadges = ['pomodoro-10', 'pomodoro-50', 'pomodoro-100']
    pomodoroBadges.forEach(badgeId => {
      const badge = state.badges.find(b => b.id === badgeId)
      if (badge && !badge.unlocked && totalPomodoros >= badge.target) {
        get().unlockBadge(badgeId)
      } else if (badge) {
        get().updateBadgeProgress(badgeId, Math.min(totalPomodoros, badge.target))
      }
    })

    // Check focus time badges
    const focusBadges = ['focus-10h', 'focus-100h', 'focus-500h']
    focusBadges.forEach(badgeId => {
      const badge = state.badges.find(b => b.id === badgeId)
      if (badge && !badge.unlocked && totalStudyTime >= badge.target) {
        get().unlockBadge(badgeId)
      } else if (badge) {
        get().updateBadgeProgress(badgeId, Math.min(totalStudyTime, badge.target))
      }
    })

    // Check test badges
    const testBadges = ['test-5', 'test-25']
    testBadges.forEach(badgeId => {
      const badge = state.badges.find(b => b.id === badgeId)
      if (badge && !badge.unlocked && totalTests >= badge.target) {
        get().unlockBadge(badgeId)
      } else if (badge) {
        get().updateBadgeProgress(badgeId, Math.min(totalTests, badge.target))
      }
    })
  },

  // AI Insights
  aiInsights: [],
  setAIInsights: (insights) => set({ aiInsights: insights }),
  addAIInsight: (insight) => set((state) => ({
    aiInsights: [
      ...state.aiInsights,
      { ...insight, id: crypto.randomUUID(), date: new Date().toISOString() },
    ],
  })),

  // Stats
  todayStudyTime: localStorageService.get('todayStudyTime') as number || 0,
  setTodayStudyTime: (time) => {
    set({ todayStudyTime: time })
    localStorageService.set('todayStudyTime', time)
  },
  currentStreak: localStorageService.get('currentStreak') as number || 0,
  setCurrentStreak: (streak) => {
    set({ currentStreak: streak })
    localStorageService.set('currentStreak', streak)
  },

  // Notifications
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        read: false,
      },
    ],
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    ),
  })),
  clearNotifications: () => set({ notifications: [] }),

  // Daily Routine
  dailyRoutine: [],
  setDailyRoutine: (routine) => set({ dailyRoutine: routine }),

  // Custom Music
  customMusicTracks: [],
  setCustomMusicTracks: (tracks) => set({ customMusicTracks: tracks }),
  addCustomMusicTrack: (track) => set((state) => ({
    customMusicTracks: [
      ...state.customMusicTracks,
      {
        ...track,
        id: crypto.randomUUID(),
        addedAt: new Date().toISOString(),
      },
    ],
  })),
  removeCustomMusicTrack: (id) => set((state) => ({
    customMusicTracks: state.customMusicTracks.filter((track) => track.id !== id),
  })),

  // Pomodoro
  activeSession: null,
  setActiveSession: (session) => set({ activeSession: session }),
  pomodoroBackground: {
    type: 'gradient',
    value: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
  },
  setPomodoroBackground: (bg) => {
    set({ pomodoroBackground: bg })
    localStorageService.set('pomodoroBackground', bg)
  },
  selectedMusicTrack: 'none',
  setSelectedMusicTrack: (trackId) => {
    set({ selectedMusicTrack: trackId })
    localStorageService.set('selectedMusicTrack', trackId)
  },

  // Settings
  pomodoroWorkTime: localStorageService.get('pomodoroWorkTime') as number || 25,
  setPomodoroWorkTime: (time) => {
    set({ pomodoroWorkTime: time })
    localStorageService.set('pomodoroWorkTime', time)
  },
  pomodoroShortBreak: localStorageService.get('pomodoroShortBreak') as number || 5,
  setPomodoroShortBreak: (time) => {
    set({ pomodoroShortBreak: time })
    localStorageService.set('pomodoroShortBreak', time)
  },
  pomodoroLongBreak: localStorageService.get('pomodoroLongBreak') as number || 15,
  setPomodoroLongBreak: (time) => {
    set({ pomodoroLongBreak: time })
    localStorageService.set('pomodoroLongBreak', time)
  },
  autoStartPomodoro: localStorageService.get('autoStartPomodoro') as boolean || false,
  setAutoStartPomodoro: (enabled) => {
    set({ autoStartPomodoro: enabled })
    localStorageService.set('autoStartPomodoro', enabled)
  },
  autoLogStudyTime: localStorageService.get('autoLogStudyTime') as boolean || true,
  setAutoLogStudyTime: (enabled) => {
    set({ autoLogStudyTime: enabled })
    localStorageService.set('autoLogStudyTime', enabled)
  },
  aiEnabled: localStorageService.get('aiEnabled') as boolean || true,
  setAIEnabled: (enabled) => {
    set({ aiEnabled: enabled })
    localStorageService.set('aiEnabled', enabled)
  },
  aiEngine: localStorageService.get('aiEngine') as AIEngine || 'gemini',
  setAIEngine: (engine) => {
    set({ aiEngine: engine })
    localStorageService.set('aiEngine', engine)
  },

  // Sync
  autoSyncEnabled: localStorageService.get('autoSyncEnabled') as boolean || false,
  setAutoSyncEnabled: (enabled) => {
    set({ autoSyncEnabled: enabled })
    localStorageService.set('autoSyncEnabled', enabled)
  },
  lastSyncTimestamp: localStorageService.get('lastSyncTimestamp') as number || 0,
  setLastSyncTimestamp: (timestamp) => {
    set({ lastSyncTimestamp: timestamp })
    localStorageService.set('lastSyncTimestamp', timestamp)
  },
}))
