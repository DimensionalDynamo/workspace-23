'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import { Clock } from 'lucide-react'

// Encouragement messages for revisions
const ENCOURAGEMENT_MESSAGES = [
    "Keep strengthening your knowledge! 💪",
    "Consistency is key to mastery! 🔑",
    "You're building lasting memory! 🧠",
    "Great learners revise regularly! ⭐",
    "Spaced repetition = Long-term retention! 📈",
    "Champions never skip revision day! 🏆",
    "Your future self will thank you! 🌟",
    "Every review makes you stronger! 💎",
]

// Habit motivation messages
const HABIT_MESSAGES = [
    "🔥 Keep your streak alive! Consistency is the secret to success.",
    "💎 Diamond habits are built one day at a time. You've got this!",
    "🚀 Time to level up! Your daily habit awaits.",
    "⭐ Stars shine every day! Time for your daily routine.",
    "🎯 Winners show up every day. Ready to win?",
    "💪 Small daily actions = Massive results!",
    "🌟 One small step today, one giant leap tomorrow!",
]

// Task motivation messages  
const TASK_MESSAGES = [
    "📋 A new challenge awaits! Tackle it and feel the satisfaction.",
    "🎯 Focus mode activated! Time to crush your task.",
    "💪 You're stronger than you think. This task doesn't stand a chance!",
    "⚡ Energy up! Let's complete this task and move forward.",
    "🌟 Every task completed is a step toward your goals!",
    "🚀 Launch yourself into action! Task time.",
]

// Suggested revision methods by revision number
const REVISION_METHODS: Record<number, string> = {
    1: "Quick skim through key concepts",
    2: "Active recall - try to explain without notes",
    3: "Practice problems and examples",
    4: "Teach the concept to someone (or rubber duck)",
    5: "Speed review - you should know this well now!"
}

const getRandomMessage = (messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)]
}

export function NotificationManager() {
    const {
        tasks,
        habits,
        notifications,
        revisionTasks,
        addNotification,
        updateTask,
        toggleHabitDay,
    } = useStore()

    const processedRef = useRef<Set<string>>(new Set())

    // Request Permissions on Mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission()
            }
        }
    }, [])

    // Main notification checking loop
    useEffect(() => {
        // Check for Task Due Notifications
        const checkTasks = () => {
            const now = new Date()

            tasks.forEach(task => {
                if (!task.dueDate || task.completed) return

                const dueDate = new Date(task.dueDate)
                const timeDiff = dueDate.getTime() - now.getTime()
                const minutesDiff = timeDiff / (1000 * 60)
                const taskId = task.id

                // 15 minutes before notification
                const preNotifId = `task-pre-${taskId}`
                if (minutesDiff > 12 && minutesDiff <= 15 && !processedRef.current.has(preNotifId)) {
                    const motivation = getRandomMessage(TASK_MESSAGES)

                    triggerInteractiveToast(
                        `⏰ Task Starting Soon: ${task.title}`,
                        `${motivation}\n\nStarts in 15 minutes!`,
                        task.priority === 'high' ? 'destructive' : 'default',
                        [
                            {
                                label: '✓ Mark Complete',
                                onClick: () => updateTask(task.id, { completed: true, completedAt: new Date().toISOString() })
                            }
                        ]
                    )

                    addNotification({
                        title: "⏰ Task Starting Soon",
                        message: `"${task.title}" starts in 15 minutes.\n\n${motivation}`,
                        priority: "medium",
                        type: "priority_alert"
                    })

                    processedRef.current.add(preNotifId)
                }

                // At due time notification
                const dueNotifId = `task-due-${taskId}`
                if (minutesDiff >= -1 && minutesDiff <= 1 && !processedRef.current.has(dueNotifId)) {
                    const motivation = getRandomMessage(TASK_MESSAGES)

                    triggerInteractiveToast(
                        `🚀 Task Time: ${task.title}`,
                        `${motivation}\n\nPriority: ${task.priority.toUpperCase()}`,
                        task.priority === 'high' ? 'destructive' : 'default',
                        [
                            {
                                label: '✓ Complete',
                                onClick: () => updateTask(task.id, { completed: true, completedAt: new Date().toISOString() })
                            }
                        ]
                    )

                    // Browser notification
                    triggerNotification(`🚀 Task Time: ${task.title}`, {
                        body: `Priority: ${task.priority.toUpperCase()} - ${motivation}`,
                        tag: dueNotifId
                    })

                    addNotification({
                        title: "🚀 Task Due Now",
                        message: `"${task.title}" is due!\n\n${motivation}`,
                        priority: "high",
                        type: "priority_alert"
                    })

                    processedRef.current.add(dueNotifId)
                }
            })
        }

        // Check for Habit Reminders
        const checkHabits = () => {
            const now = new Date()
            const todayDayIndex = now.getDay()

            habits.forEach(habit => {
                if (!habit.reminderTime) return

                const habitId = habit.id
                const todayNotifId = `habit-${habitId}-${now.toDateString()}`

                // Already notified today
                if (processedRef.current.has(todayNotifId)) return

                // Check if habit already completed today
                if (habit.weeklyHistory[todayDayIndex]) return

                // Parse reminder time
                const [reminderHour, reminderMin] = habit.reminderTime.split(':').map(Number)
                const nowMinutes = now.getHours() * 60 + now.getMinutes()
                const reminderMinutes = reminderHour * 60 + reminderMin
                const diffMinutes = reminderMinutes - nowMinutes

                // 5 minutes before reminder
                const preHabitId = `habit-pre-${habitId}-${now.toDateString()}`
                if (diffMinutes > 3 && diffMinutes <= 5 && !processedRef.current.has(preHabitId)) {
                    const motivation = getRandomMessage(HABIT_MESSAGES)

                    toast(`🔔 Habit reminder in 5 min`, {
                        description: `${habit.title}\n\n${motivation}`,
                        icon: <Clock className="h-5 w-5 text-yellow-500" />,
                        duration: 10000,
                    })

                    processedRef.current.add(preHabitId)
                }

                // At reminder time (within 2 minutes window)
                if (diffMinutes >= -2 && diffMinutes <= 2 && !processedRef.current.has(todayNotifId)) {
                    const motivation = getRandomMessage(HABIT_MESSAGES)
                    const streakText = habit.streak > 0 ? `🔥 ${habit.streak} day streak!` : ''

                    triggerInteractiveToast(
                        `🔥 Habit Time: ${habit.title}`,
                        `${motivation}\n\n${streakText}`,
                        'default',
                        [
                            {
                                label: '✓ Done',
                                onClick: () => toggleHabitDay(habit.id, todayDayIndex)
                            }
                        ]
                    )

                    // Browser notification
                    triggerNotification(`🔥 Habit Time: ${habit.title}`, {
                        body: `${motivation} ${streakText}`,
                        tag: todayNotifId
                    })

                    addNotification({
                        title: "🔥 Habit Reminder",
                        message: `Time for "${habit.title}"!\n\n${motivation}\n${streakText}`,
                        priority: "high",
                        type: "habit_reminder"
                    })

                    processedRef.current.add(todayNotifId)
                }
            })
        }

        // Check for Revision Tasks
        const checkRevisions = () => {
            const now = new Date()
            const safeRevisionTasks = revisionTasks || []

            safeRevisionTasks.forEach(revision => {
                if (revision.status !== 'pending') return

                const scheduledDate = new Date(revision.scheduledFor)
                const revisionId = `revision-${revision.id}`

                // Check if revision is due (within the same day or past due)
                const isDue = now >= scheduledDate
                const hoursDiff = (now.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60)
                const isWithin24Hours = hoursDiff >= 0 && hoursDiff < 24

                // Only notify once per revision, when it becomes due
                if (isDue && !processedRef.current.has(revisionId)) {
                    const revisionNum = revision.revisionNumber || 1
                    const method = REVISION_METHODS[revisionNum] || "Review the topic thoroughly"
                    const encouragement = getRandomMessage(ENCOURAGEMENT_MESSAGES)

                    triggerInteractiveToast(
                        `📝 Revision #${revisionNum}: ${revision.topicName}`,
                        `${revision.subjectName} > ${revision.chapterName}\n\n💡 ${method}\n\n${encouragement}`,
                        isWithin24Hours ? 'destructive' : 'default',
                        []
                    )

                    // Trigger system notification
                    triggerNotification(`📝 Revision #${revisionNum} Due!`, {
                        body: `${revision.topicName} - ${method}`,
                        tag: revisionId
                    })

                    // Add in-app notification
                    addNotification({
                        title: `📝 Revision #${revisionNum} Due: ${revision.topicName}`,
                        message: `${revision.subjectName} > ${revision.chapterName}\n\nSuggested: ${method}\n\n${encouragement}`,
                        priority: isWithin24Hours ? "high" : "medium",
                        type: "study_reminder"
                    })

                    processedRef.current.add(revisionId)
                }
            })
        }

        // Check for Custom Notifications (Reminders)
        const checkNotifications = () => {
            const now = new Date()

            notifications.forEach(notif => {
                if (notif.read) return;

                const notifTime = new Date(notif.time)
                const timeDiff = notifTime.getTime() - now.getTime()

                if (Math.abs(timeDiff) < 60000 && !processedRef.current.has(notif.id)) {
                    triggerNotification(notif.title, {
                        body: notif.message,
                        tag: notif.id
                    })
                    processedRef.current.add(notif.id)
                }
            })
        }

        const interval = setInterval(() => {
            checkTasks()
            checkHabits()
            checkRevisions()
            checkNotifications()
        }, 10000) // Check every 10 seconds

        // Also check immediately on mount
        checkHabits()
        checkRevisions()

        return () => clearInterval(interval)
    }, [tasks, habits, notifications, revisionTasks, addNotification, updateTask, toggleHabitDay])

    // Interactive toast with action buttons
    const triggerInteractiveToast = (
        title: string,
        description: string,
        variant: 'default' | 'destructive' = 'default',
        actions: { label: string; onClick: () => void }[] = []
    ) => {
        const toastConfig: any = {
            description,
            duration: 15000,
            className: variant === 'destructive'
                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30'
                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30',
        }

        if (actions.length > 0) {
            toastConfig.action = {
                label: actions[0].label,
                onClick: actions[0].onClick,
            }
        }

        toast(title, toastConfig)
        playSound()
    }

    const triggerNotification = (title: string, options?: NotificationOptions) => {
        // Browser Notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/icon-192x192.png',
                ...options
            })
        }
    }

    const playSound = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio might be blocked
        }
    }

    return null
}
