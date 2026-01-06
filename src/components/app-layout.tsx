'use client'

import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useStore, Screen } from '@/lib/store'
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  BarChart3,
  Brain,
  Award,
  Settings,
  Bell,
  Menu,
  X,
  AlertCircle,
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

  // Keyboard navigation (Alt + 1–7)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= '1' && e.key <= '7') {
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
          'flex items-center gap-3 px-3 py-2 w-full rounded-lg transition',
          active
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className="h-5 w-5" />
        <span className="hidden lg:inline">{screen.label}</span>
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2 border-b pb-2">
              <span className="text-sm font-medium">Notifications</span>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    notifications.forEach((n) => markNotificationRead(n.id))
                  }
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
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-primary">FocusFlow</h1>
          <NotificationDropdown />
        </header>

        <main className="flex-1 overflow-auto">{children}</main>

        <nav className="flex justify-around border-t p-2">
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentScreen(s.id)}
              className="text-xs"
            >
              <s.icon className="h-5 w-5 mx-auto" />
              {s.label}
            </button>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4 space-y-1">
        {screens.map((s) => (
          <NavItem key={s.id} screen={s} />
        ))}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b px-6 flex items-center justify-between">
          <h2 className="font-semibold">
            {screens.find((s) => s.id === currentScreen)?.label}
          </h2>
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <Button size="icon" variant="ghost">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
