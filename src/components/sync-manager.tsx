'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import { saveStateToCloud, loadStateFromCloud } from '@/lib/sync'
import { toast } from 'sonner'
import { Cloud } from 'lucide-react'

export function SyncManager() {
    const {
        autoSyncEnabled,
        lastSyncTimestamp,
        setLastSyncTimestamp,
    } = useStore()

    const stateRef = useRef(useStore.getState())

    // Keep ref updated
    useEffect(() => {
        const unsub = useStore.subscribe((state) => {
            stateRef.current = state
        })
        return () => unsub()
    }, [])

    // Initial Sync Check
    useEffect(() => {
        const initSync = async () => {
            if (autoSyncEnabled) {
                checkForUpdates()
            }
        }

        // Small delay to let Firebase load
        const timer = setTimeout(initSync, 1500)
        return () => clearTimeout(timer)
    }, [autoSyncEnabled])

    const checkForUpdates = async () => {
        try {
            const cloudData = await loadStateFromCloud()
            if (!cloudData) return

            const localLastSync = useStore.getState().lastSyncTimestamp || 0

            // If cloud data is newer than our last sync timestamp
            // AND significantly different from what we might have just saved (basic check)
            if (cloudData.timestamp > localLastSync) {
                toast.message('Cloud Sync', {
                    description: `Found newer data from ${new Date(cloudData.timestamp).toLocaleTimeString()}.`,
                    icon: <Cloud className="w-4 h-4" />,
                    action: {
                        label: 'Load Update',
                        onClick: () => applyCloudData(cloudData.data, cloudData.timestamp),
                    },
                })
            }
        } catch (e) {
            console.error("Failed to check for updates", e)
        }
    }

    const applyCloudData = (data: any, timestamp: number) => {
        useStore.setState({
            ...data,
            lastSyncTimestamp: timestamp
        })
        toast.success('App synced with cloud!')
    }

    // Auto-Save on Change
    useEffect(() => {
        if (!autoSyncEnabled) return

        let timeoutId: NodeJS.Timeout

        const unsub = useStore.subscribe((state) => {
            // Avoid syncing if the only change is the timestamp itself to prevent loops
            if (state.lastSyncTimestamp !== stateRef.current.lastSyncTimestamp) {
                stateRef.current = state
                return
            }

            // clear pending save
            clearTimeout(timeoutId)

            // debounce save (5 seconds)
            timeoutId = setTimeout(async () => {
                const success = await saveStateToCloud(state)
                if (success) {
                    setLastSyncTimestamp(Date.now())
                }
            }, 5000)
        })

        return () => {
            unsub()
            clearTimeout(timeoutId)
        }
    }, [autoSyncEnabled])

    return null
}
