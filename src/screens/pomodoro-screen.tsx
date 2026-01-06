'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Music,
  Volume2,
  VolumeX,
  Video,
  Settings,
  Upload,
  Youtube,
  Link,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useStore } from '@/lib/store'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface MusicOption {
  id: string
  name: string
  type: 'ambient' | 'youtube' | 'custom' | 'video'
  url: string
  videoUrl?: string
}

const DEFAULT_MUSIC_OPTIONS: MusicOption[] = [
  { id: 'none', name: 'No Music', type: 'ambient', url: '' },
  { id: 'rain', name: 'Rain Sounds', type: 'ambient', url: '' },
  { id: 'forest', name: 'Forest Sounds', type: 'ambient', url: '' },
]

// Default YouTube tracks for focus
const DEFAULT_YOUTUBE_TRACKS = [
  { id: 'lofi-1', name: 'Lofi Hip Hop Radio', videoId: 'jfKfPfyJRdk' },
  { id: 'nature-1', name: 'Rain & Thunder Sounds', videoId: 'sTGeUZzXSjM' },
  { id: 'focus-1', name: 'Deep Focus Music', videoId: 'lTRiuFIWV54' },
  { id: 'piano-1', name: 'Calm Piano Music', videoId: '1d8jDEc_9eY' },
  { id: 'ambient-1', name: 'Ambient Study Music', videoId: 'sjkrrmBnpGE' },
]

const BACKGROUND_PRESETS = [
  {
    id: 'default',
    name: 'Calm Dark',
    value: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    type: 'gradient' as const,
  },
  {
    id: 'ocean',
    name: 'Ocean Deep',
    value: 'bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900',
    type: 'gradient' as const,
  },
  {
    id: 'forest',
    name: 'Forest Night',
    value: 'bg-gradient-to-br from-green-900 via-green-800 to-slate-900',
    type: 'gradient' as const,
  },
  {
    id: 'purple',
    name: 'Midnight Purple',
    value: 'bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900',
    type: 'gradient' as const,
  },
]

export function PomodoroScreen() {
  const {
    pomodoroWorkTime,
    pomodoroShortBreak,
    pomodoroLongBreak,
    autoStartPomodoro,
    setAutoStartPomodoro,
    autoLogStudyTime,
    setAutoLogStudyTime,
    addStudySession,
    setActiveSession,
    activeSession,
    todayStudyTime,
    setTodayStudyTime,
    customMusicTracks,
    selectedMusicTrack,
    addCustomMusicTrack,
    removeCustomMusicTrack,
    pomodoroBackground,
    setPomodoroBackground,
  } = useStore()

  const [mode, setMode] = useState<TimerMode>('work')
  const [timeRemaining, setTimeRemaining] = useState(pomodoroWorkTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [selectedMusic, setSelectedMusic] = useState('none')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicMuted, setMusicMuted] = useState(false)
  const [volume, setVolume] = useState(50)
  const [musicOptions, setMusicOptions] = useState<MusicOption[]>(DEFAULT_MUSIC_OPTIONS)
  const [youtubeVideoPlaying, setYoutubeVideoPlaying] = useState(false)
  const [showVideoControls, setShowVideoControls] = useState(false)

  // YouTube player state
  const [selectedYoutubeTrack, setSelectedYoutubeTrack] = useState<string | null>(null)
  const [youtubeLink, setYoutubeLink] = useState('')
  const [isYoutubePlayerVisible, setIsYoutubePlayerVisible] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const youtubeIframeRef = useRef<HTMLIFrameElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const fullscreenElementRef = useRef<HTMLDivElement>(null)

  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  // Handle custom YouTube link
  const handleAddYoutubeLink = () => {
    const videoId = extractYouTubeVideoId(youtubeLink)
    if (videoId) {
      setSelectedYoutubeTrack(videoId)
      setYoutubeLink('')
    }
  }

  // Get time for current mode
  const getTimeForMode = (currentMode: TimerMode) => {
    switch (currentMode) {
      case 'work':
        return pomodoroWorkTime * 60
      case 'shortBreak':
        return pomodoroShortBreak * 60
      case 'longBreak':
        return pomodoroLongBreak * 60
    }
  }

  // Update time when mode changes
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(getTimeForMode(mode))
    }
  }, [mode, pomodoroWorkTime, pomodoroShortBreak, pomodoroLongBreak, isRunning])

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return getTimeForMode(mode)
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, mode])

  // Handle ESC key for fullscreen exit
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleTrueFullscreen()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isFullscreen])

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Music handling
  useEffect(() => {
    // Update music options to include custom tracks
    setMusicOptions([
      ...DEFAULT_MUSIC_OPTIONS,
      ...customMusicTracks.map(track => ({
        id: track.id,
        name: track.name,
        type: 'custom' as const,
        url: track.fileUrl,
      })),
    ])
  }, [customMusicTracks])

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Play/pause audio
  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying && selectedMusic !== 'none') {
        const selectedOption = musicOptions.find(opt => opt.id === selectedMusic)
        if (selectedOption && selectedOption.type === 'ambient' && selectedOption.url) {
          // Ambient sound needs actual audio file - using placeholder
          audioRef.current.src = 'data:audio/wav;base64,UklGRjIAAAABXQVBFZoAAAACAAAAAEAAA' // Placeholder
          audioRef.current.play().catch(err => console.log('Audio play failed:', err))
        }
      } else {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [musicPlaying, selectedMusic, musicOptions])

  const handleTimerComplete = () => {
    // Stop timer
    setIsRunning(false)
    setMusicPlaying(false)
    setYoutubeVideoPlaying(false)
    setShowVideoControls(false)

    // Log study session if work mode and auto-log enabled
    if (mode === 'work' && autoLogStudyTime && activeSession) {
      activeSession.endTime = new Date().toISOString()
      activeSession.duration = getTimeForMode('work')
      addStudySession(activeSession)
      setActiveSession(null)

      // Update today's study time
      setTodayStudyTime(todayStudyTime + getTimeForMode('work'))
    }

    // Auto-start next session if enabled
    if (autoStartPomodoro) {
      if (mode === 'work') {
        setMode('shortBreak')
      } else {
        setMode('work')
      }
      setIsRunning(true)
      // Resume YouTube if a track was selected
      if (selectedYoutubeTrack) {
        setYoutubeVideoPlaying(true)
      }
    }

    // Play notification sound
    playNotificationSound()
  }

  const handleStart = () => {
    if (!isRunning) {
      // Create new session if work mode
      if (mode === 'work' && !activeSession) {
        setActiveSession({
          id: crypto.randomUUID(),
          startTime: new Date().toISOString(),
          duration: 0,
          subject: selectedSubject,
          chapter: selectedChapter,
          category: 'NIMCET',
          type: 'focus',
        })
      }
      setIsRunning(true)
      setMusicPlaying(selectedMusic !== 'none')
      // Start YouTube if a track is selected
      if (selectedYoutubeTrack) {
        setYoutubeVideoPlaying(true)
      }
    }
  }

  const handlePause = () => {
    setIsRunning(false)
    setMusicPlaying(false)
    setYoutubeVideoPlaying(false)
    if (activeSession) {
      const totalTime = getTimeForMode(activeSession.type === 'focus' ? 'work' : mode)
      const elapsed = totalTime - timeRemaining
      activeSession.duration = elapsed
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setMusicPlaying(false)
    setYoutubeVideoPlaying(false)
    setShowVideoControls(false)
    setTimeRemaining(getTimeForMode(mode))
  }

  const toggleTrueFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  const playNotificationSound = () => {
    // Simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const handleCustomMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      addCustomMusicTrack({
        name: file.name.replace(/\.[^/.]+$/, ''),
        fileUrl: url,
      })
    }
  }

  const handleBackgroundChange = (backgroundId: string) => {
    const preset = BACKGROUND_PRESETS.find(bg => bg.id === backgroundId)
    if (preset) {
      setPomodoroBackground({
        type: preset.type,
        value: preset.value,
      })
    }
  }

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'from-primary/20 via-primary/10 to-primary/5'
      case 'shortBreak':
        return 'from-green-500/20 via-green-500/10 to-green-500/5'
      case 'longBreak':
        return 'from-blue-500/20 via-blue-500/10 to-blue-500/5'
    }
  }

  const getModeTitle = () => {
    switch (mode) {
      case 'work':
        return 'Focus Time'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Video background component
  const VideoBackground = () => {
    const selectedOption = musicOptions.find(opt => opt.id === selectedMusic)
    if (selectedOption?.type === 'youtube' && selectedOption.videoUrl && isFullscreen) {
      return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <iframe
            ref={youtubeIframeRef}
            src={`${selectedOption.videoUrl}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0`}
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen"
          />
        </div>
      )
    }
    return null
  }

  const NormalView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Focus Timer</h1>
        <p className="text-muted-foreground">Deep work sessions with Pomodoro</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'default' : 'outline'}
            onClick={() => {
              setMode(m)
              handlePause()
              setYoutubeVideoPlaying(false)
            }}
            className="flex-1"
          >
            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </Button>
        ))}
      </div>

      {/* Timer Display */}
      <Card className="glass-card border-0">
        <CardContent className={`py-12 bg-gradient-to-br ${getModeColor()}`}>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              {getModeTitle()}
            </Badge>
            <div className="text-8xl font-bold tabular-nums mb-4 playfair">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={isRunning ? handlePause : handleStart}
                className="h-16 w-16 rounded-full"
              >
                {isRunning ? <Pause className="h-6 w-6 ml-1" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="h-16 w-16 rounded-full"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={toggleTrueFullscreen}
                className="h-16 w-16 rounded-full"
              >
                <Maximize2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject & Chapter Selection */}
      {mode === 'work' && (
        <Card className="glass-card border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Logical Ability">Logical Ability</SelectItem>
                  <SelectItem value="Computer Awareness">Computer Awareness</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chapter (Optional)</Label>
              <Input
                placeholder="e.g., Sets, Relations, Functions"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Music & Video Section */}
      <Card className="glass-card border-0">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Background Music
            </Label>
            {selectedMusic !== 'none' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMusicMuted(!musicMuted)}
              >
                {musicMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
          </div>

          <Select value={selectedMusic} onValueChange={setSelectedMusic}>
            <SelectTrigger>
              <SelectValue placeholder="Select music or video" />
            </SelectTrigger>
            <SelectContent>
              {musicOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex items-center gap-2">
                    {option.type === 'video' && <Video className="h-4 w-4" />}
                    {option.type === 'custom' && <Upload className="h-4 w-4" />}
                    {option.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedMusic !== 'none' && (
            <div className="space-y-2">
              <Label>Volume: {volume}%</Label>
              <Slider
                value={[volume]}
                onValueChange={([v]) => setVolume(v)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}

          {/* Custom Music Upload */}
          <div className="pt-2 border-t">
            <Label className="text-sm text-muted-foreground mb-2">
              Upload Custom Audio File
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleCustomMusicUpload}
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            {customMusicTracks.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Your Custom Tracks
                </Label>
                <div className="flex flex-wrap gap-2">
                  {customMusicTracks.map((track) => (
                    <Badge
                      key={track.id}
                      variant="outline"
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <span>{track.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeCustomMusicTrack(track.id)
                        }}
                        className="hover:bg-destructive/10 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* YouTube Audio Section */}
      <Card className="glass-card border-0">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-500" />
              YouTube Audio
            </Label>
            <span className="text-xs text-muted-foreground">144p for bandwidth</span>
          </div>

          {/* Quick Play Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_YOUTUBE_TRACKS.map((track) => (
              <Button
                key={track.id}
                variant={selectedYoutubeTrack === track.videoId ? 'default' : 'outline'}
                size="sm"
                className="justify-start gap-2 text-xs"
                onClick={() => setSelectedYoutubeTrack(
                  selectedYoutubeTrack === track.videoId ? null : track.videoId
                )}
              >
                <Play className="h-3 w-3" />
                <span className="truncate">{track.name}</span>
              </Button>
            ))}
          </div>

          {/* Custom YouTube Link */}
          <div className="flex gap-2 pt-2 border-t">
            <div className="flex-1 relative">
              <Link className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="Paste YouTube URL..."
                className="pl-7 h-8 text-xs"
              />
            </div>
            <Button
              onClick={handleAddYoutubeLink}
              disabled={!youtubeLink}
              size="sm"
              className="h-8"
            >
              <Play className="h-3 w-3" />
            </Button>
          </div>

          {/* YouTube Player (Hideable) - Synced with Timer */}
          {selectedYoutubeTrack && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium flex items-center gap-1 ${youtubeVideoPlaying ? 'text-red-400' : 'text-muted-foreground'}`}>
                  <div className={`w-2 h-2 rounded-full ${youtubeVideoPlaying ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground'}`} />
                  {youtubeVideoPlaying ? 'Playing' : 'Paused (Start timer to play)'}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setIsYoutubePlayerVisible(!isYoutubePlayerVisible)}
                  >
                    {isYoutubePlayerVisible ? (
                      <><EyeOff className="h-3 w-3 mr-1" />Hide</>
                    ) : (
                      <><Eye className="h-3 w-3 mr-1" />Show</>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-destructive"
                    onClick={() => {
                      setSelectedYoutubeTrack(null)
                      setYoutubeVideoPlaying(false)
                    }}
                  >
                    Stop
                  </Button>
                </div>
              </div>

              {/* Player - Only renders iframe when playing for performance */}
              <div
                className={`transition-all duration-300 ${isYoutubePlayerVisible ? 'opacity-100 h-[90px]' : 'opacity-0 h-[1px] overflow-hidden'}`}
                style={{ pointerEvents: isYoutubePlayerVisible ? 'auto' : 'none' }}
              >
                <div className="bg-black rounded-lg overflow-hidden">
                  {youtubeVideoPlaying ? (
                    <iframe
                      width="100%"
                      height="90"
                      src={`https://www.youtube.com/embed/${selectedYoutubeTrack}?autoplay=1&vq=small&quality=small&loop=1&playlist=${selectedYoutubeTrack}&modestbranding=1&rel=0&fs=0&controls=1&playsinline=1`}
                      title="YouTube Audio Player"
                      frameBorder="0"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
                      className="rounded-lg"
                      style={{ minHeight: '90px' }}
                    />
                  ) : (
                    <div className="h-[90px] flex items-center justify-center text-muted-foreground text-xs">
                      <Play className="h-4 w-4 mr-2" />
                      Start timer to play music
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="glass-card border-0">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Auto-start Next Session
            </Label>
            <Switch
              checked={autoStartPomodoro}
              onCheckedChange={setAutoStartPomodoro}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Auto-log Study Time
            </Label>
            <Switch
              checked={autoLogStudyTime}
              onCheckedChange={setAutoLogStudyTime}
            />
          </div>
        </CardContent>
      </Card>
    </div >
  )

  const FullscreenView = () => (
    <div
      ref={fullscreenElementRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${pomodoroBackground.value}`}
    >
      <VideoBackground />
      <div className="text-center relative z-10">
        <div className="mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-black/50 backdrop-blur-sm">
            {getModeTitle()}
          </Badge>
        </div>
        <div className="text-[12rem] font-bold tabular-nums mb-8 playfair">
          {formatTime(timeRemaining)}
        </div>
        <div className="flex items-center justify-center gap-6">
          <Button
            size="lg"
            onClick={isRunning ? handlePause : handleStart}
            className="h-24 w-24 rounded-full bg-black/20 backdrop-blur-md border-2 border-white/10"
          >
            {isRunning ? <Pause className="h-10 w-10 ml-1" /> : <Play className="h-10 w-10 ml-1" />}
          </Button>
        </div>
        {selectedSubject && selectedChapter && (
          <div className="mt-8 text-center">
            <p className="text-xl text-white/80 backdrop-blur-sm">
              {selectedSubject} - {selectedChapter}
            </p>
          </div>
        )}
        <Button
          onClick={toggleTrueFullscreen}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/20 text-white/60 hover:bg-black/30 backdrop-blur-md rounded-lg"
        >
          <Minimize2 className="h-6 w-6" />
        </Button>
      </div>
      {/* Audio element for background music */}
      {musicPlaying && selectedMusic !== 'none' && (
        <audio
          ref={audioRef}
          loop
          autoPlay
          playsInline
          style={{ display: 'none' }}
        />
      )}
    </div>
  )

  return isFullscreen ? <FullscreenView /> : <NormalView />
}
