'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Plus,
  Filter,
  SortAsc,
  Flame,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import { useStore, TaskCategory, TaskPriority, Task } from '@/lib/store'
import { format } from 'date-fns'

export function TasksHabitsScreen() {
  const { tasks, habits, addTask, updateTask, deleteTask, addHabit, updateHabit, deleteHabit, toggleHabitDay } = useStore()

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [habitDialogOpen, setHabitDialogOpen] = useState(false)

  // Task filters
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [taskCategory, setTaskCategory] = useState<TaskCategory | 'all'>('all')
  const [taskSort, setTaskSort] = useState<'dueDate' | 'priority' | 'created'>('dueDate')

  // New task form
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'NIMCET' as TaskCategory,
    priority: 'medium' as TaskPriority,
    dueDate: '',
  })

  // New habit form
  const [newHabit, setNewHabit] = useState({
    title: '',
    reminderTime: '',
  })

  // AI suggestions (mock for now - will be implemented with AI later)
  const [aiSuggestions] = useState([
    'Complete 5 mock tests this week',
    'Revise Mathematics: Chapter 3',
    'Practice logical reasoning for 2 hours',
  ])

  const filteredTasks = tasks
    .filter((task) => {
      if (taskFilter === 'active' && task.completed) return false
      if (taskFilter === 'completed' && !task.completed) return false
      if (taskCategory !== 'all' && task.category !== taskCategory) return false
      return true
    })
    .sort((a, b) => {
      switch (taskSort) {
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const handleAddTask = () => {
    if (!newTask.title.trim()) return
    addTask({
      ...newTask,
      dueDate: newTask.dueDate || undefined,
    })
    setNewTask({ title: '', category: 'NIMCET', priority: 'medium', dueDate: '' })
    setTaskDialogOpen(false)
  }

  const handleToggleTask = (task: Task) => {
    updateTask(task.id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined,
    })
  }

  const handleAddHabit = () => {
    if (!newHabit.title.trim()) return
    addHabit({
      ...newHabit,
      streak: 0,
      reminderTime: newHabit.reminderTime || undefined,
    })
    setNewHabit({ title: '', reminderTime: '' })
    setHabitDialogOpen(false)
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getDaysOfWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map((name, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (day - i))
      return { name, date, isToday: i === day }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tasks & Habits</h1>
        <p className="text-muted-foreground">Manage your daily activities</p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4 mt-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value: TaskCategory) =>
                        setNewTask({ ...newTask, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIMCET">NIMCET</SelectItem>
                        <SelectItem value="BCA">BCA</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: TaskPriority) =>
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date (Optional)</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Task Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Checkbox />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Get More Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                <Select value={taskFilter} onValueChange={(value: any) => setTaskFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={taskCategory}
                  onValueChange={(value: any) => setTaskCategory(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="NIMCET">NIMCET</SelectItem>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={taskSort}
                  onValueChange={(value: any) => setTaskSort(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                    <SelectItem value="priority">Sort by Priority</SelectItem>
                    <SelectItem value="created">Sort by Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No tasks found. Add your first task!</p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            {getDaysUntilDue(task.dueDate) <= 3 && (
                              <span className="text-red-500 ml-1">
                                {getDaysUntilDue(task.dueDate) === 0
                                  ? 'Due today!'
                                  : `${getDaysUntilDue(task.dueDate)} days left`}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-4 mt-4">
          {/* Add Habit */}
          <Dialog open={habitDialogOpen} onOpenChange={setHabitDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Habit Title</Label>
                  <Input
                    placeholder="e.g., Read for 30 minutes"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reminder Time (Optional)</Label>
                  <Input
                    type="time"
                    value={newHabit.reminderTime}
                    onChange={(e) => setNewHabit({ ...newHabit, reminderTime: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddHabit} className="w-full">
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Habits List */}
          <div className="space-y-4">
            {habits.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No habits yet. Create your first habit!</p>
                </CardContent>
              </Card>
            ) : (
              habits.map((habit) => (
                <Card key={habit.id}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{habit.title}</h3>
                          {habit.reminderTime && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Reminder at {habit.reminderTime}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {habit.streak} days
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHabit(habit.id)}
                            className="h-8 w-8"
                          >
                            ×
                          </Button>
                        </div>
                      </div>

                      {/* Weekly Calendar */}
                      <div className="flex justify-between gap-1">
                        {getDaysOfWeek().map((day, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center gap-1 flex-1"
                          >
                            <span className={`text-xs ${day.isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                              {day.name}
                            </span>
                            <button
                              onClick={() => toggleHabitDay(habit.id, index)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                habit.weeklyHistory[index]
                                  ? 'bg-primary text-primary-foreground'
                                  : day.isToday
                                  ? 'bg-primary/10 hover:bg-primary/20'
                                  : 'bg-muted/30'
                              }`}
                            >
                              {habit.weeklyHistory[index] ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <Circle className="h-5 w-5 opacity-30" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
