'use client'

import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useStore, Screen } from '@/lib/store'
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  BarChart3,
  BookMarked,
  Brain,
  Award,
  Settings,
  Bell,
  Menu,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const screens: { id: Screen; icon: any; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'pomodoro', icon: Timer, label: 'Focus' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'nimcet', icon: BookMarked, label: 'NIMCET' },
  { id: 'ai', icon: Brain, label: 'AI' },
  { id: 'achievements', icon: Award, label: 'Achievements' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile()
  const currentScreen = useStore((s) => s.currentScreen)
  const setCurrentScreen = useStore((s) => s.setCurrentScreen)
  const notifications = useStore((s) => s.notifications)
  const markNotificationRead = useStore((s) => s.markNotificationRead)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Keyboard navigation (Alt + 1–8)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault()
        const idx = Number(e.key) - 1
        if (screens[idx]) setCurrentScreen(screens[idx].id)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCurrentScreen])

  const NavItem = ({ screen }: { screen: (typeof screens)[0] }) => {
    const Icon = screen.icon
    const active = currentScreen === screen.id

    return (
      <button
        onClick={() => setCurrentScreen(screen.id)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300',
          active
            ? 'nav-active bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white font-medium shadow-lg shadow-purple-500/10'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className={cn("h-5 w-5", active && "text-purple-400")} />
        <span className="hidden lg:inline">{screen.label}</span>
        {active && <Sparkles className="h-3 w-3 ml-auto text-cyan-400 animate-pulse" />}
      </button>
    )
  }

  const NotificationDropdown = () => {
    const sorted = [...notifications].sort((a, b) =>
      a.priority === 'high' && b.priority !== 'high' ? -1 : 0
    )

    const iconFor = (p: string) => {
      if (p === 'high') return <AlertCircle className="h-3 w-3 text-red-500" />
      if (p === 'medium') return <Bell className="h-3 w-3 text-yellow-500" />
      return null
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 glass-card border-white/10">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
              <span className="text-sm font-medium">Notifications</span>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    notifications.forEach((n) => markNotificationRead(n.id))
                  }
                  className="text-purple-400 hover:text-purple-300"
                >
                  Mark all
                </Button>
              )}
            </div>

            {sorted.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sorted.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    onSelect={() => markNotificationRead(n.id)}
                    className="hover:bg-white/5 rounded-lg"
                  >
                    <div className="flex items-start gap-2 w-full">
                      {iconFor(n.priority)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.message}
                        </p>
                      </div>
                      <X className="h-4 w-4 opacity-40" />
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen relative">
        {/* Background Orbs */}
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />

        <header className="flex items-center justify-between p-4 border-b border-white/10 glass-sidebar">
          <h1 className="text-xl font-bold gradient-text playfair">StudyFlow</h1>
          <NotificationDropdown />
        </header>

        <main className="flex-1 overflow-auto p-4">{children}</main>

        <nav className="flex justify-around border-t border-white/10 p-2 glass-sidebar shrink-0 safe-area-bottom">
          {screens.slice(0, 4).map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentScreen(s.id)}
              className={cn(
                "text-xs flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[60px]",
                currentScreen === s.id ? "text-purple-400 bg-white/5" : "text-slate-500"
              )}
            >
              <s.icon className="h-5 w-5 mx-auto" />
              <span className="text-[10px] font-medium">{s.label}</span>
            </button>
          ))}

          {/* More Menu for remaining screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "text-xs flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[60px]",
                  screens.slice(4).some(s => s.id === currentScreen) ? "text-purple-400 bg-white/5" : "text-slate-500"
                )}
              >
                <Menu className="h-5 w-5 mx-auto" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/10 mb-2 w-48">
              {screens.slice(4).map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => setCurrentScreen(s.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 cursor-pointer",
                    currentScreen === s.id ? "bg-purple-500/10 text-purple-400" : ""
                  )}
                >
                  <s.icon className="h-4 w-4" />
                  <span>{s.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    )
  }

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Glassmorphic Sidebar */}
      <aside className="w-72 glass-sidebar p-6 space-y-2 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold gradient-text playfair">StudyFlow</h1>
          <p className="text-xs text-slate-500 mt-1">Your AI-Powered Study Companion</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {screens.map((s) => (
            <NavItem key={s.id} screen={s} />
          ))}
        </nav>

        {/* Pro Badge */}
        <div className="glass-card p-4 text-center">
          <div className="text-purple-400 font-semibold text-sm">✨ Pro Features</div>
          <p className="text-xs text-slate-500 mt-1">AI insights enabled</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between glass-sidebar">
          <h2 className="font-semibold text-lg gradient-text">
            {screens.find((s) => s.id === currentScreen)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <Button size="icon" variant="ghost" className="hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
