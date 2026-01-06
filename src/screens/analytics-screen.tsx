'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/lib/store'
import { BarChart3 } from 'lucide-react'

export function AnalyticsScreen() {
  const { studySessions, testResults, syllabusProgress } = useStore()

  const totalStudyHours = Math.round(
    studySessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 3600,
  )
  const testsTaken = testResults.length
  const syllabusCompleted = syllabusProgress.filter((c) => c.status !== 'Not Started').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Study metrics and progress</p>
        </div>
        <BarChart3 className="h-6 w-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-sm">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudyHours} hrs</div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-sm">Tests Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testsTaken}</div>
            <p className="text-xs text-muted-foreground">All recorded tests</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-sm">Syllabus Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syllabusCompleted}</div>
            <p className="text-xs text-muted-foreground">Chapters started/completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
