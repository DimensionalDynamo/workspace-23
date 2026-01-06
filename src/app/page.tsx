'use client'

import { AppLayout } from '@/components/app-layout'
import { DashboardScreen } from '@/screens/dashboard-screen'
import { PomodoroScreen } from '@/screens/pomodoro-screen'
import { TasksHabitsScreen } from '@/screens/tasks-habits-screen'
import { AnalyticsScreen } from '@/screens/analytics-screen'
import { AIScreen } from '@/screens/ai-screen'
import { AchievementsScreen } from '@/screens/achievements-screen'
import { SettingsScreen } from '@/screens/settings-screen'
import { useStore } from '@/lib/store'

export default function Home() {
  const currentScreen = useStore((state) => state.currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />
      case 'pomodoro':
        return <PomodoroScreen />
      case 'tasks':
        return <TasksHabitsScreen />
      case 'analytics':
        return <AnalyticsScreen />
      case 'ai':
        return <AIScreen />
      case 'achievements':
        return <AchievementsScreen />
      case 'settings':
        return <SettingsScreen />
      default:
        return <DashboardScreen />
    }
  }

  return <AppLayout>{renderScreen()}</AppLayout>
}
