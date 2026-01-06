'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge as BadgeUI } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Trophy,
  Lock,
  Unlock,
  Flame,
  Timer,
  Brain,
  Target,
  Music,
  Palette,
  Clock,
  Star,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { format } from 'date-fns'

type Category = 'all' | 'streak' | 'pomodoro' | 'habit' | 'syllabus' | 'test' | 'focus'

const categoryIcons = {
  streak: Flame,
  pomodoro: Timer,
  habit: Star,
  syllabus: Book,
  test: Target,
  focus: Brain,
}

const categoryNames = {
  streak: 'Study Streaks',
  pomodoro: 'Pomodoro Milestones',
  habit: 'Habit Mastery',
  syllabus: 'Syllabus Completion',
  test: 'Test Consistency',
  focus: 'Focus Time',
}

export function AchievementsScreen() {
  const { badges, unlockBadge, currentStreak } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedBadge, setSelectedBadge] = useState<typeof badges[0] | null>(null)
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)

  const filteredBadges =
    selectedCategory === 'all'
      ? badges
      : badges.filter((badge) => badge.category === selectedCategory)

  const unlockedCount = badges.filter((b) => b.unlocked).length
  const totalCount = badges.length
  const overallProgress = (unlockedCount / totalCount) * 100

  const categories: { id: Category; name: string; icon: any }[] = [
    { id: 'all', name: 'All Badges', icon: Trophy },
    { id: 'streak', name: 'Streaks', icon: Flame },
    { id: 'pomodoro', name: 'Pomodoro', icon: Timer },
    { id: 'habit', name: 'Habits', icon: Star },
    { id: 'syllabus', name: 'Syllabus', icon: Book },
    { id: 'test', name: 'Tests', icon: Target },
    { id: 'focus', name: 'Focus', icon: Brain },
  ]

  const unlockableRewards = [
    {
      id: 'music-classical',
      name: 'Classical Music Pack',
      type: 'music',
      description: 'Unlock classical background music',
      price: 5,
      icon: Music,
      unlocked: false,
    },
    {
      id: 'music-nature',
      name: 'Nature Sounds Pack',
      type: 'music',
      description: 'Unlock additional nature sounds',
      price: 10,
      icon: Music,
      unlocked: false,
    },
    {
      id: 'theme-ocean',
      name: 'Ocean Theme',
      type: 'theme',
      description: 'Beautiful ocean gradient theme',
      price: 15,
      icon: Palette,
      unlocked: false,
    },
    {
      id: 'timer-digital',
      name: 'Digital Timer Style',
      type: 'timer',
      description: 'Retro digital clock timer',
      price: 8,
      icon: Clock,
      unlocked: false,
    },
    {
      id: 'timer-analog',
      name: 'Analog Timer Style',
      type: 'timer',
      description: 'Classic analog clock face',
      price: 12,
      icon: Clock,
      unlocked: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Achievements & Rewards</h1>
        <p className="text-muted-foreground">Track your progress and unlock rewards</p>
      </div>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6 mt-4">
          {/* Overall Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Badges Collected</h3>
                  <p className="text-sm text-muted-foreground">
                    {unlockedCount} of {totalCount} badges unlocked
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{unlockedCount}</div>
                  <div className="text-sm text-muted-foreground">badges</div>
                </div>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {overallProgress.toFixed(1)}% complete
              </p>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              const count =
                category.id === 'all'
                  ? totalCount
                  : badges.filter((b) => b.category === category.id).length
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <BadgeUI variant="secondary" className="text-xs">
                    {count}
                  </BadgeUI>
                </Button>
              )
            })}
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => (
              <Card
                key={badge.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !badge.unlocked ? 'opacity-60' : 'border-primary'
                }`}
                onClick={() => setSelectedBadge(badge)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`text-4xl ${
                        !badge.unlocked ? 'grayscale opacity-50' : 'animate-bounce-slow'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{badge.title}</h4>
                        {badge.unlocked ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {badge.description}
                      </p>
                      {!badge.unlocked && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {badge.progress} / {badge.target}
                            </span>
                          </div>
                          <Progress
                            value={(badge.progress / badge.target) * 100}
                            className="h-1.5"
                          />
                        </div>
                      )}
                      {badge.unlockedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Unlocked {format(new Date(badge.unlockedAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6 mt-4">
          {/* Unlocked Badges Count */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Reward Points</h3>
                    <p className="text-sm text-muted-foreground">
                      Use points to unlock special rewards
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{unlockedCount * 10}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockableRewards.map((reward) => {
              const Icon = reward.icon
              return (
                <Card
                  key={reward.id}
                  className={reward.unlocked ? 'border-primary' : ''}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{reward.name}</h4>
                          {reward.unlocked ? (
                            <BadgeUI className="bg-green-500">Unlocked</BadgeUI>
                          ) : (
                            <BadgeUI variant="secondary">
                              {reward.price} pts
                            </BadgeUI>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {reward.description}
                        </p>
                        {reward.unlocked ? (
                          <Button variant="outline" size="sm" className="w-full">
                            <Unlock className="h-4 w-4 mr-2" />
                            Active
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                            disabled={unlockedCount * 10 < reward.price}
                            onClick={() => setRewardDialogOpen(true)}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Unlock
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Coming Soon */}
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">More Rewards Coming Soon!</h3>
              <p className="text-sm text-muted-foreground">
                Unlock badges to earn points and redeem exciting rewards
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-4xl">{selectedBadge?.icon}</span>
              <div>
                {selectedBadge?.title}
                {selectedBadge?.unlocked && (
                  <BadgeUI className="ml-2 bg-green-500">Unlocked</BadgeUI>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedBadge && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedBadge.description}</p>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Category</span>
                  <BadgeUI variant="outline">
                    {categoryNames[selectedBadge.category]}
                  </BadgeUI>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target</span>
                  <span className="text-sm">
                    {selectedBadge.progress} / {selectedBadge.target}
                  </span>
                </div>
              </div>

              {!selectedBadge.unlocked && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress to unlock</span>
                    <span className="font-medium">
                      {Math.round((selectedBadge.progress / selectedBadge.target) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(selectedBadge.progress / selectedBadge.target) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Unlocked!</span>
                  </div>
                  <p className="text-sm text-green-600/80 mt-1">
                    on {format(new Date(selectedBadge.unlockedAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reward Dialog */}
      <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Earn more badges to unlock rewards! Each badge gives you 10 points.
            </p>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Your Points</span>
                <span className="text-2xl font-bold text-primary">
                  {unlockedCount * 10}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Keep studying to earn more badges! 🎯
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Import Book icon from lucide-react
import { Book } from 'lucide-react'
