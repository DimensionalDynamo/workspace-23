// Local storage utilities for FocusFlow 2026

export interface LocalStorageData {
  // App Settings
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  motionIntensity: 'low' | 'medium' | 'high'

  // Pomodoro Settings
  pomodoroWorkTime: number
  pomodoroShortBreak: number
  pomodoroLongBreak: number
  autoStartPomodoro: boolean
  autoLogStudyTime: boolean

  // AI Settings
  aiEnabled: boolean
  geminiApiKey: string
  openaiApiKey: string
  aiEngine: 'gemini' | 'chatgpt'

  // Navigation
  lastScreen: string

  // Study Data
  totalStudyTime: number
  todayStudyTime: number
  currentStreak: number
  longestStreak: number

  // User
  userName: string

  // Pomodoro
  pomodoroBackground: { type: string; value: string }
  selectedMusicTrack: string

  // Sync
  autoSyncEnabled: boolean
  lastSyncTimestamp: number
}


const DEFAULT_STORAGE: LocalStorageData = {
  theme: 'system',
  accentColor: 'default',
  motionIntensity: 'medium',

  pomodoroWorkTime: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  autoStartPomodoro: false,
  autoLogStudyTime: true,

  aiEnabled: true,
  geminiApiKey: 'AIzaSyDFelmlkunv3xbVeLlrHYSSW7MJDA7H_9c',
  openaiApiKey: 'sk-1234uvwxabcd5678uvwxabcd1234uvwxabcd5678',
  aiEngine: 'gemini',

  lastScreen: 'dashboard',

  totalStudyTime: 0,
  todayStudyTime: 0,
  currentStreak: 0,
  longestStreak: 0,

  userName: 'Aditya Anand',
  pomodoroBackground: { type: 'gradient', value: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' },
  selectedMusicTrack: 'none',

  // Sync
  autoSyncEnabled: false,
  lastSyncTimestamp: 0,
}


export const localStorageService = {
  // Get a value from local storage
  get<K extends keyof LocalStorageData>(key: K): LocalStorageData[K] {
    if (typeof window === 'undefined') {
      return DEFAULT_STORAGE[key]
    }

    try {
      const item = window.localStorage.getItem(`focusflow_${key}`)
      return item !== null ? JSON.parse(item) : DEFAULT_STORAGE[key]
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return DEFAULT_STORAGE[key]
    }
  },

  // Set a value in local storage
  set<K extends keyof LocalStorageData>(key: K, value: LocalStorageData[K]): void {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(`focusflow_${key}`, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error)
    }
  },

  // Remove a value from local storage
  remove(key: keyof LocalStorageData): void {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.removeItem(`focusflow_${key}`)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  },

  // Get all settings
  getAllSettings(): Partial<LocalStorageData> {
    const settings: Partial<LocalStorageData> = {}
    for (const key in DEFAULT_STORAGE) {
      settings[key as keyof LocalStorageData] = this.get(key as keyof LocalStorageData)
    }
    return settings
  },

  // Clear all data
  clearAll(): void {
    if (typeof window === 'undefined') return

    try {
      Object.keys(DEFAULT_STORAGE).forEach(key => {
        window.localStorage.removeItem(`focusflow_${key}`)
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  // Export all data as JSON
  exportData(): string {
    const data = this.getAllSettings()
    return JSON.stringify(data, null, 2)
  },

  // Import data from JSON
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as Partial<LocalStorageData>
      for (const key in data) {
        this.set(key as keyof LocalStorageData, data[key as keyof LocalStorageData])
      }
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  },
}

// IndexedDB utilities for larger data storage
export class IndexedDBService {
  private dbName = 'FocusFlowDB'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create stores
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('habits')) {
          db.createObjectStore('habits', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('studySessions')) {
          db.createObjectStore('studySessions', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('testResults')) {
          db.createObjectStore('testResults', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('syllabus')) {
          db.createObjectStore('syllabus', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('resources')) {
          db.createObjectStore('resources', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('aiInsights')) {
          db.createObjectStore('aiInsights', { keyPath: 'id' })
        }
      }
    })
  }

  async getAll(storeName: string): Promise<any[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async add(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async put(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clearStore(storeName: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const indexedDB = new IndexedDBService()
