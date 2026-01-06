'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
  Sparkles,
  Send,
  TrendingUp,
  Target,
  Calendar,
  Bot,
  Loader2,
  Zap,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

export function AIScreen() {
  const {
    studySessions,
    testResults,
    tasks,
    habits,
    syllabusProgress,
    aiEnabled,
    aiEngine,
    aiInsights,
    addAIInsight,
    addTask,
    setAIEngine,
    setAIEnabled,
  } = useStore()

  const [activeTab, setActiveTab] = useState('summary')
  const [summary, setSummary] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [studyPlan, setStudyPlan] = useState('')
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([])
  const [chatInput, setChatInput] = useState('')
  const [pendingAction, setPendingAction] = useState<{
    type: string
    content: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [showEngineSwitch, setShowEngineSwitch] = useState(false)

  const formatContent = (content: string) =>
    content.split('\n').map((line, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {line}
      </p>
    ))

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">AI Insights & Planning</h1>
          <p className="text-muted-foreground text-sm">
            AI-powered study assistance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline">{aiEngine}</Badge>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowEngineSwitch(!showEngineSwitch)}
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Switch
          </Button>

          <Label className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <Switch
              checked={aiEnabled}
              onCheckedChange={setAIEnabled}
            />
          </Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {/* CHAT TAB */}
        <TabsContent value="chat" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Study Chat
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ask questions, clear doubts, or get strategies.
              </p>

              {/* 🔥 FIXED: moved OUTSIDE <p> */}
              {aiEnabled && pendingAction && (
                <div className="p-3 bg-yellow-500/10 border rounded-lg flex gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1 text-sm">
                    AI suggests an action. Review before confirming.
                  </div>
                </div>
              )}

              <ScrollArea className="h-[400px] border rounded-md p-4">
                <div className="space-y-4">
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={
                        m.role === 'user'
                          ? 'text-right'
                          : 'text-left'
                      }
                    >
                      <div className="inline-block bg-muted px-3 py-2 rounded-lg text-sm">
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) =>
                    setChatInput(e.target.value)
                  }
                  placeholder="Ask something…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                    }
                  }}
                />
                <Button disabled={loading || !aiEnabled}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {pendingAction && (
        <Dialog
          open
          onOpenChange={() => setPendingAction(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
            <p className="text-sm">{pendingAction.content}</p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => setPendingAction(null)}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={() => setPendingAction(null)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
