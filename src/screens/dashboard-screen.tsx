'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Clock,
  Calendar,
  Timer,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Play,
  Plus,
  FileCheck,
  RefreshCw,
  Flame,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { format, subDays } from 'date-fns'

const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Focus on being productive instead of busy.",
  "Your future is created by what you do today, not tomorrow.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "Small daily improvements are the key to staggering long-term results.",
]

const NIMCET_DATE = new Date('2026-07-03T00:00:00')

export function DashboardScreen() {
  const {
    todayStudyTime,
    currentStreak,
    badges,
    setCurrentScreen,
    userName,
    studySessions,
    testResults,
    syllabusProgress,
  } = useStore()

  // State to track hydration and current time
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [quoteIndex, setQuoteIndex] = useState(0)

  // On mount, set current time and start timer (client-only)
  useEffect(() => {
    setCurrentTime(new Date()) // Set initial time after hydration
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // If currentTime is null, render placeholder to avoid hydration mismatch
  if (!currentTime) {
    return <div>Loading...</div>
  }

  // Calculate REAL data from store
  const year2026Progress = calculateYearProgress()
  const nimcetCountdown = calculateNIMCETCountdown()

  // Calculate NIMCET syllabus progress dynamically
  const nimcetChapters = syllabusProgress.filter(c => c.subject === 'Mathematics')
  const nimcetCompleted = nimcetChapters.filter(c => c.status !== 'Not Started').length
  const nimcetProgress = nimcetChapters.length > 0 ? Math.round((nimcetCompleted / nimcetChapters.length) * 100) : 0

  // Calculate test data dynamically
  const fullTests = testResults.filter(t => t.type === 'full').length
  const topicTests = testResults.filter(t => t.type === 'topic').length
  const chapterTests = testResults.filter(t => t.type === 'chapter').length
  const testScores = testResults.map(t => t.score)
  const avgScore = testScores.length > 0 ? (testScores.reduce((a, b) => a + b, 0) / testScores.length) : 0
  const bestScore = testScores.length > 0 ? Math.max(...testScores) : 0
  const recentScore = testScores.length > 0 ? testScores[testScores.length - 1] : 0

  // Calculate weekly average from study sessions
  const last7Days = subDays(new Date(), 7)
  const recentSessions = studySessions.filter(s => {
    const sessionDate = new Date(s.startTime)
    return sessionDate >= last7Days
  })
  const weeklyTotalSeconds = recentSessions.reduce((acc, s) => acc + (s.duration || 0), 0)
  const weeklyAvgHours = recentSessions.length > 0 ? Number((weeklyTotalSeconds / 3600 / 7).toFixed(1)) : 0

  // Get recent unlocked badges (max 5)
  const recentBadges = badges
    .filter(b => b.unlocked)
    .sort((a, b) => (b.unlockedAt || '').localeCompare(a.unlockedAt || ''))
    .slice(0, 5)

  const handleRefreshQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)
  }

  return (
    <div className="space-y-6">
      {/* Header with User Name & Live Time */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text playfair">
            Hello, {userName}
          </h1>
          <p className="text-slate-400 mt-1">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums gradient-text">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Countdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Year 2026 Progress */}
        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Year 2026 Progress
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {year2026Progress.daysPassed} days passed
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              {year2026Progress.daysLeft} days remaining
            </div>
            <Progress value={year2026Progress.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {year2026Progress.percentage.toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        {/* NIMCET Countdown */}
        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                NIMCET 2026 Countdown
              </div>
            </CardTitle>
            <Badge variant="secondary">{nimcetCountdown.days}d</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">{nimcetCountdown.days}</div>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{nimcetCountdown.hours}</div>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{nimcetCountdown.minutes}</div>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Target: July 3, 2026
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Study Progress */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* NIMCET Syllabus */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">NIMCET Syllabus</span>
              <span className="text-sm text-muted-foreground">
                {nimcetChapters.length > 0 ? `${nimcetCompleted} of ${nimcetChapters.length} chapters` : 'No data yet'}
              </span>
            </div>
            <Progress value={nimcetProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{nimcetProgress}% complete</span>
            </div>
          </div>

          {/* BCA Syllabus placeholder */}
          <div className="p-4 bg-muted/30 rounded-lg border-dashed">
            <p className="text-sm text-center text-muted-foreground">
              BCA syllabus tracking coming soon
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mock Test Tracker */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Mock Test Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 stat-card">
              <div className="text-2xl font-bold text-primary">{fullTests}</div>
              <p className="text-xs text-muted-foreground">Full Tests</p>
            </div>
            <div className="text-center p-3 stat-card">
              <div className="text-2xl font-bold text-primary">{topicTests}</div>
              <p className="text-xs text-muted-foreground">Topic Tests</p>
            </div>
            <div className="text-center p-3 stat-card">
              <div className="text-2xl font-bold text-primary">{chapterTests}</div>
              <p className="text-xs text-muted-foreground">Chapter Tests</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Average Score</span>
              <span className="font-semibold">{testScores.length > 0 ? `${avgScore.toFixed(1)}%` : '-'}</span>
            </div>
            <Progress value={avgScore} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Best: {testScores.length > 0 ? `${bestScore}%` : '-'}</span>
              <span>Recent: {testScores.length > 0 ? `${recentScore}%` : '-'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Study</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(todayStudyTime)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Goal: 6 hours
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyAvgHours}h</div>
            <p className="text-xs text-muted-foreground mt-1">
              {recentSessions.length > 0 ? 'Based on last 7 days' : 'No sessions yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentStreak > 0 ? 'Keep it going! 🔥' : 'Start your streak today!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => setCurrentScreen('pomodoro')}
              className="flex flex-col items-center gap-2 h-20 glow-button border-0"
            >
              <Play className="h-5 w-5" />
              <span className="text-xs">Start Focus</span>
            </Button>
            <Button
              onClick={() => setCurrentScreen('tasks')}
              variant="outline"
              className="flex flex-col items-center gap-2 h-20"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Task</span>
            </Button>
            <Button
              onClick={() => setCurrentScreen('tasks')}
              variant="outline"
              className="flex flex-col items-center gap-2 h-20"
            >
              <FileCheck className="h-5 w-5" />
              <span className="text-xs">Log Test</span>
            </Button>
            <Button
              onClick={() => setCurrentScreen('achievements')}
              variant="outline"
              className="flex flex-col items-center gap-2 h-20"
            >
              <Award className="h-5 w-5" />
              <span className="text-xs">Badges</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="glass-card border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-lg font-medium italic text-muted-foreground playfair">
                "{motivationalQuotes[quoteIndex]}"
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefreshQuote}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recently Unlocked Badges */}
      {recentBadges.length > 0 && (
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-base">Recently Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentBadges.map((badge) => (
                <Card key={badge.id} className="stat-card border-0">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{badge.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper functions
function calculateYearProgress() {
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1)

  const daysPassed = Math.floor((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = Math.floor((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
  const daysLeft = totalDays - daysPassed
  const percentage = (daysPassed / totalDays) * 100

  return { daysPassed, daysLeft, percentage }
}

function calculateNIMCETCountdown() {
  const now = new Date()
  const diff = NIMCET_DATE.getTime() - now.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes }
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
