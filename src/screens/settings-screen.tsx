'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  Monitor,
  Palette,
  Music,
  Volume2,
  Brain,
  Database,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Bell,
  Zap,
  Moon,
  Sun,
} from 'lucide-react'
import { useStore, PomodoroBackgroundType } from '@/lib/store'
import { toast } from 'sonner'

const BACKGROUND_PRESETS = [
  {
    id: 'default',
    name: 'Calm Dark',
    type: 'gradient' as const,
    value: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
  },
  {
    id: 'ocean',
    name: 'Ocean Deep',
    type: 'gradient' as const,
    value: 'bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900',
  },
  {
    id: 'forest',
    name: 'Forest Night',
    type: 'gradient' as const,
    value: 'bg-gradient-to-br from-green-900 via-green-800 to-slate-900',
  },
  {
    id: 'purple',
    name: 'Midnight Purple',
    type: 'gradient' as const,
    value: 'bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900',
  },
  {
    id: 'solid-dark',
    name: 'Solid Dark',
    type: 'color' as const,
    value: 'bg-slate-900',
  },
  {
    id: 'solid-gray',
    name: 'Solid Gray',
    type: 'color' as const,
    value: 'bg-gray-900',
  },
]

export function SettingsScreen() {
  const {
    pomodoroWorkTime,
    pomodoroShortBreak,
    pomodoroLongBreak,
    autoStartPomodoro,
    autoLogStudyTime,
    aiEnabled,
    aiEngine,
    pomodoroBackground,
    setPomodoroWorkTime,
    setPomodoroShortBreak,
    setPomodoroLongBreak,
    setAutoStartPomodoro,
    setAutoLogStudyTime,
    setAIEnabled,
    setAIEngine,
    setPomodoroBackground,
    tasks,
    habits,
    testResults,
    studySessions,
    customMusicTracks,
    addCustomMusicTrack,
    removeCustomMusicTrack,
    userName,
    setUserName,
  } = useStore()

  const [customBgFile, setCustomBgFile] = useState<File | null>(null)
  const [bgPreviewUrl, setBgPreviewUrl] = useState<string>('')
  const [userNameInput, setUserNameInput] = useState(userName)

  const statsData = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    totalHabits: habits.length,
    totalTests: testResults.length,
    totalSessions: studySessions.length,
    totalResources: 0,
  }

  const handleBackgroundChange = (presetId: string) => {
    const preset = BACKGROUND_PRESETS.find(bg => bg.id === presetId)
    if (preset) {
      setPomodoroBackground({
        type: preset.type,
        value: preset.value,
      })
    }
  }

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setBgPreviewUrl(url)
      setCustomBgFile(file)
    }
  }

  const handleSaveCustomBackground = () => {
    if (bgPreviewUrl && customBgFile) {
      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = (e.target as FileReader).result as string
        setPomodoroBackground({
          type: 'image',
          value: base64,
        })
        setCustomBgFile(null)
        setBgPreviewUrl(base64)
        toast.success('Custom background saved!')
      }
      reader.readAsDataURL(customBgFile)
    }
  }

  const handleResetBackground = () => {
    const defaultPreset = BACKGROUND_PRESETS[0]
    setPomodoroBackground({
      type: defaultPreset.type,
      value: defaultPreset.value,
    })
    setBgPreviewUrl('')
    setCustomBgFile(null)
    toast.success('Background reset to default')
  }

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file)
      addCustomMusicTrack({
        name: file.name.replace(/\.[^/.]+$/, ''),
        fileUrl: url,
      })
      toast.success('Music track added!')
    }
  }

  const handleRemoveMusic = (id: string) => {
    removeCustomMusicTrack(id)
    toast.success('Music track removed')
  }

  const handleResetAllData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      toast.success('All data has been reset')
      // All arrays are already empty in store
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleUpdateUserName = () => {
    if (userNameInput.trim()) {
      setUserName(userNameInput.trim())
      toast.success(`Name updated to "${userNameInput.trim()}"`)
    }
  }

  const handleExportData = () => {
    const data = {
      tasks,
      habits,
      testResults,
      studySessions,
      resources: [],
      customMusicTracks,
      badges: [],
      topics: [],
      userName,
      pomodoroBackground,
      aiEngine,
      aiEnabled,
      stats: {
        pomodoroWorkTime,
        pomodoroShortBreak,
        pomodoroLongBreak,
        autoStartPomodoro,
        autoLogStudyTime,
      },
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    toast.success('Data exported successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <Tabs defaultValue="pomodoro" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Pomodoro Settings */}
        <TabsContent value="pomodoro" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Timer Defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Focus Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[pomodoroWorkTime]}
                    onValueChange={([v]) => setPomodoroWorkTime(v)}
                    min={15}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">{pomodoroWorkTime} min</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Break (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[pomodoroShortBreak]}
                    onValueChange={([v]) => setPomodoroShortBreak(v)}
                    min={1}
                    max={15}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">{pomodoroShortBreak} min</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Long Break (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[pomodoroLongBreak]}
                    onValueChange={([v]) => setPomodoroLongBreak(v)}
                    min={5}
                    max={30}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">{pomodoroLongBreak} min</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoStartPomodoro}
                    onCheckedChange={setAutoStartPomodoro}
                  />
                  <Label className="cursor-pointer">Auto-start Next Session</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoLogStudyTime}
                    onCheckedChange={setAutoLogStudyTime}
                  />
                  <Label className="cursor-pointer">Auto-log Study Time</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Settings */}
        <TabsContent value="background" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Fullscreen Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground mb-4">
                Choose a preset gradient or upload your own image for fullscreen mode.
              </p>

              {/* Preset Gradients */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {BACKGROUND_PRESETS.map((preset) => {
                  const isSelected = pomodoroBackground.value === preset.value && pomodoroBackground.type === preset.type
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleBackgroundChange(preset.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-md mb-2 bg-white/10 mx-auto"></div>
                      <p className="text-sm font-medium">{preset.name}</p>
                      {isSelected && <p className="text-xs">Selected</p>}
                    </button>
                  )
                })}
              </div>

              {/* Custom Background Upload */}
              <div className="pt-6 border-t">
                <h3 className="text-sm font-medium mb-4">Custom Background Image</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Upload Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomBgUpload}
                        className="file:mr-4"
                      />
                    </div>
                    {bgPreviewUrl && (
                      <Button onClick={handleSaveCustomBackground} size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    )}
                  </div>
                  {bgPreviewUrl && (
                    <div className="p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">Preview</p>
                          <div
                            className="w-full h-32 rounded-lg object-cover bg-cover bg-center"
                            style={{ backgroundImage: `url(${bgPreviewUrl})` }}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setBgPreviewUrl('')
                            setCustomBgFile(null)
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={handleResetBackground}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground mb-4">
                Configure AI features for personalized insights and study planning.
              </p>

              <div className="flex items-center gap-3 mb-6">
                <Switch
                  checked={aiEnabled}
                  onCheckedChange={(checked) => {
                    setAIEnabled(checked)
                    toast(checked ? 'AI features enabled' : 'AI features disabled')
                  }}
                />
                <Label className="cursor-pointer">Enable AI Features</Label>
              </div>

              <div className="space-y-3 border-t pt-6">
                <Label>AI Engine</Label>
                <Select value={aiEngine} onValueChange={setAIEngine}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <span>Google Gemini</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="chatgpt">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-500" />
                        <span>ChatGPT (GPT-4)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Currently using: <span className="font-medium text-primary">{aiEngine === 'gemini' ? 'Google Gemini' : 'ChatGPT'}</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Music Settings */}
        <TabsContent value="music" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-pink-500" />
                Custom Music Tracks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground mb-4">
                Upload your own audio files to use as background music during focus sessions.
              </p>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Label>Upload Audio File</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicUpload}
                    className="file:mr-4"
                  />
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border text-sm text-center">
                  <Music className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-muted-foreground">
                    Supported formats: MP3, WAV, M4A
                  </p>
                </div>
              </div>

              {customMusicTracks.length > 0 && (
                <div className="space-y-3 border-t pt-6">
                  <h3 className="text-sm font-medium mb-4">
                    Your Tracks ({customMusicTracks.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {customMusicTracks.map((track) => (
                      <div key={track.id} className="p-4 bg-muted/50 rounded-lg border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <Music className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{track.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(track.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMusic(track.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customMusicTracks.length === 0 && (
                <div className="p-8 text-center text-muted-foreground border-dashed">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No custom tracks yet. Upload your first audio file!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-500" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{statsData.totalTasks}</div>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{statsData.totalHabits}</div>
                  <p className="text-xs text-muted-foreground">Habits</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{statsData.totalTests}</div>
                  <p className="text-xs text-muted-foreground">Tests</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{statsData.totalSessions}</div>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Export Your Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all your data as a JSON backup file.
                </p>
                <Button onClick={handleExportData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-medium mb-4 text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Reset all your data. This action cannot be undone.
                </p>
                <Button
                  onClick={handleResetAllData}
                  variant="destructive"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Profile (Bottom Card) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <div className="flex gap-3">
                <Input
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1"
                />
                <Button onClick={handleUpdateUserName} size="sm">
                  Update
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Hello, <span className="font-semibold playfair">{userName}</span>!
              </span>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
