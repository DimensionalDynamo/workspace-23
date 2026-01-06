'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  FileText,
  Upload,
  RefreshCw,
  Clock,
  Brain,
  BookOpen,
  CheckCircle,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  sendChatMessage,
  generateStudySummary,
  generateAnalysis,
  generateStudyPlan,
  analyzeDocument,
  extractTextFromFile,
  getCurrentDateTime,
  type ChatMessage,
  type StudyContext,
} from '@/lib/ai-service'

export function AIScreen() {
  const {
    studySessions,
    testResults,
    tasks,
    habits,
    topics,
    revisionTasks,
    currentStreak,
    todayStudyTime,
    aiEnabled,
    aiEngine,
    setAIEngine,
    setAIEnabled,
  } = useStore()

  const [activeTab, setActiveTab] = useState('chat')
  const [summary, setSummary] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [studyPlan, setStudyPlan] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<string>('')

  // Document analysis state
  const [documentText, setDocumentText] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [documentAnalysis, setDocumentAnalysis] = useState<{
    summary: string
    keyTopics: string[]
    suggestedRevisionNotes: string
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Build study context from store data
  const getStudyContext = (): StudyContext => {
    const completedTopics = (topics || []).filter(t => t.status === 'Revised' || t.status === 'Practiced').length
    const totalTopics = (topics || []).length
    const upcomingRevisions = (revisionTasks || []).filter(r => r.status === 'pending').length

    const subjectSet = new Set((topics || []).map(t => t.subject))
    const subjects = Array.from(subjectSet)

    const recentTestScores = testResults.slice(-5).map(t => ({
      subject: t.subject,
      score: Math.round((t.score / t.totalScore) * 100)
    }))

    return {
      subjects,
      completedTopics,
      totalTopics: totalTopics || 1,
      currentStreak,
      todayStudyTime,
      upcomingRevisions,
      recentTestScores
    }
  }

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Handle chat send
  const handleSendChat = async () => {
    if (!chatInput.trim() || !aiEnabled || loading) return

    const userMessage: ChatMessage = { role: 'user', content: chatInput }
    const newMessages = [...chatMessages, userMessage]
    setChatMessages(newMessages)
    setChatInput('')
    setLoading(true)
    setLoadingType('chat')

    try {
      const response = await sendChatMessage(newMessages, aiEngine, getStudyContext())
      setChatMessages([...newMessages, { role: 'assistant', content: response }])
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
      setLoadingType('')
    }
  }

  // Generate summary
  const handleGenerateSummary = async () => {
    if (!aiEnabled || loading) return
    setLoading(true)
    setLoadingType('summary')

    try {
      const result = await generateStudySummary(getStudyContext(), aiEngine)
      setSummary(result)
      toast.success('Summary generated!')
    } catch (error) {
      toast.error('Failed to generate summary')
      console.error(error)
    } finally {
      setLoading(false)
      setLoadingType('')
    }
  }

  // Generate analysis
  const handleGenerateAnalysis = async () => {
    if (!aiEnabled || loading) return
    setLoading(true)
    setLoadingType('analysis')

    try {
      const result = await generateAnalysis(getStudyContext(), aiEngine)
      setAnalysis(result)
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error('Failed to generate analysis')
      console.error(error)
    } finally {
      setLoading(false)
      setLoadingType('')
    }
  }

  // Generate study plan
  const handleGeneratePlan = async () => {
    if (!aiEnabled || loading) return
    setLoading(true)
    setLoadingType('plan')

    try {
      const result = await generateStudyPlan(getStudyContext(), 90, aiEngine)
      setStudyPlan(result)
      toast.success('Study plan created!')
    } catch (error) {
      toast.error('Failed to generate plan')
      console.error(error)
    } finally {
      setLoading(false)
      setLoadingType('')
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDocumentName(file.name)

    try {
      const text = await extractTextFromFile(file)
      setDocumentText(text)
      toast.success(`File loaded: ${file.name}`)
    } catch (error) {
      toast.error('Failed to read file')
    }
  }

  // Analyze document
  const handleAnalyzeDocument = async () => {
    if (!documentText.trim() || !aiEnabled || loading) return
    setLoading(true)
    setLoadingType('document')

    try {
      const result = await analyzeDocument(documentText, documentName || 'Uploaded Document', aiEngine)
      setDocumentAnalysis(result)
      toast.success('Document analyzed!')
    } catch (error) {
      toast.error('Failed to analyze document')
      console.error(error)
    } finally {
      setLoading(false)
      setLoadingType('')
    }
  }

  const context = getStudyContext()

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text playfair">AI Study Assistant</h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {getCurrentDateTime()}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Engine Toggle */}
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
              <span className={`text-sm ${aiEngine === 'gemini' ? 'text-purple-400 font-medium' : 'text-slate-500'}`}>
                Gemini
              </span>
              <Switch
                checked={aiEngine === 'chatgpt'}
                onCheckedChange={(checked) => setAIEngine(checked ? 'chatgpt' : 'gemini')}
              />
              <span className={`text-sm ${aiEngine === 'chatgpt' ? 'text-green-400 font-medium' : 'text-slate-500'}`}>
                ChatGPT
              </span>
            </div>

            <Badge variant={aiEnabled ? 'default' : 'secondary'} className="gap-1">
              <Zap className="h-3 w-3" />
              {aiEnabled ? 'AI Active' : 'AI Disabled'}
            </Badge>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-400">Enable AI</Label>
              <Switch checked={aiEnabled} onCheckedChange={setAIEnabled} />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{context.completedTopics}/{context.totalTopics}</div>
            <div className="text-xs text-slate-400">Topics Done</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{context.currentStreak}</div>
            <div className="text-xs text-slate-400">Day Streak</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cyan-400">{Math.round(context.todayStudyTime / 60)}m</div>
            <div className="text-xs text-slate-400">Today</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-pink-400">{context.upcomingRevisions}</div>
            <div className="text-xs text-slate-400">Due Revisions</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full glass-card border-0">
          <TabsTrigger value="chat" className="data-[state=active]:bg-purple-500/20">
            <Bot className="h-4 w-4 mr-1" /> Chat
          </TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-purple-500/20">
            <Sparkles className="h-4 w-4 mr-1" /> Summary
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-500/20">
            <TrendingUp className="h-4 w-4 mr-1" /> Analysis
          </TabsTrigger>
          <TabsTrigger value="plan" className="data-[state=active]:bg-purple-500/20">
            <Calendar className="h-4 w-4 mr-1" /> Plan
          </TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-purple-500/20">
            <FileText className="h-4 w-4 mr-1" /> Docs
          </TabsTrigger>
        </TabsList>

        {/* CHAT TAB */}
        <TabsContent value="chat" className="mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                AI Study Chat
              </CardTitle>
              <CardDescription>
                Ask questions about NIMCET topics, get explanations, or study strategies
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px] border border-slate-700 rounded-lg p-4" ref={chatContainerRef as any}>
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-slate-500 py-12">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Start a conversation with AI</p>
                      <p className="text-sm mt-2">Try: "Explain Bayes theorem" or "How to solve permutation problems?"</p>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={m.role === 'user' ? 'text-right' : 'text-left'}
                    >
                      <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${m.role === 'user'
                          ? 'bg-purple-500/20 text-purple-100'
                          : 'bg-slate-700/50 text-slate-200'
                        }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && loadingType === 'chat' && (
                    <div className="text-left">
                      <div className="inline-block bg-slate-700/50 px-4 py-2 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about your studies..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendChat()
                    }
                  }}
                  disabled={!aiEnabled || loading}
                  className="bg-slate-800/50 border-slate-700"
                />
                <Button
                  onClick={handleSendChat}
                  disabled={loading || !aiEnabled || !chatInput.trim()}
                  className="glow-button"
                >
                  {loading && loadingType === 'chat' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUMMARY TAB */}
        <TabsContent value="summary" className="mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Study Summary
              </CardTitle>
              <CardDescription>
                AI-generated overview of your study progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGenerateSummary}
                disabled={loading || !aiEnabled}
                className="w-full glow-button"
              >
                {loading && loadingType === 'summary' ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-2" /> Generate Summary</>
                )}
              </Button>

              {summary && (
                <div className="bg-slate-800/30 rounded-lg p-4 whitespace-pre-wrap text-sm">
                  {summary}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYSIS TAB */}
        <TabsContent value="analysis" className="mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Progress Analysis
              </CardTitle>
              <CardDescription>
                Deep analysis of your preparation with insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGenerateAnalysis}
                disabled={loading || !aiEnabled}
                className="w-full glow-button"
              >
                {loading && loadingType === 'analysis' ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Target className="h-4 w-4 mr-2" /> Analyze Progress</>
                )}
              </Button>

              {analysis && (
                <div className="bg-slate-800/30 rounded-lg p-4 whitespace-pre-wrap text-sm">
                  {analysis}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLAN TAB */}
        <TabsContent value="plan" className="mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                Personalized Study Plan
              </CardTitle>
              <CardDescription>
                AI-generated study schedule tailored to your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGeneratePlan}
                disabled={loading || !aiEnabled}
                className="w-full glow-button"
              >
                {loading && loadingType === 'plan' ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating Plan...</>
                ) : (
                  <><BookOpen className="h-4 w-4 mr-2" /> Generate Study Plan</>
                )}
              </Button>

              {studyPlan && (
                <div className="bg-slate-800/30 rounded-lg p-4 whitespace-pre-wrap text-sm">
                  {studyPlan}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOCS TAB */}
        <TabsContent value="docs" className="mt-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-400" />
                Document Analysis
              </CardTitle>
              <CardDescription>
                Upload study notes or paste text for AI analysis and summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File (.txt, .md)
                </Button>
              </div>

              {documentName && (
                <Badge variant="secondary" className="gap-1">
                  <FileText className="h-3 w-3" /> {documentName}
                </Badge>
              )}

              {/* Text Input */}
              <div>
                <Label>Or paste your notes/content:</Label>
                <Textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your study notes, formulas, or any text content here..."
                  className="h-32 bg-slate-800/50 border-slate-700 mt-2"
                />
              </div>

              <Button
                onClick={handleAnalyzeDocument}
                disabled={loading || !aiEnabled || !documentText.trim()}
                className="w-full glow-button"
              >
                {loading && loadingType === 'document' ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Brain className="h-4 w-4 mr-2" /> Analyze Document</>
                )}
              </Button>

              {/* Analysis Results */}
              {documentAnalysis && (
                <div className="space-y-4">
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Summary
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{documentAnalysis.summary}</p>
                  </div>

                  {documentAnalysis.keyTopics.length > 0 && (
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" /> Key Topics
                      </h4>
                      <ul className="text-sm space-y-1">
                        {documentAnalysis.keyTopics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {documentAnalysis.suggestedRevisionNotes && (
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" /> Revision Notes
                      </h4>
                      <p className="text-sm whitespace-pre-wrap">{documentAnalysis.suggestedRevisionNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
