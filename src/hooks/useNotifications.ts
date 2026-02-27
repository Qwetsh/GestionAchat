import { useEffect, useRef, useCallback } from 'react'
import {
  getActiveTemptations,
  getTimeRemaining,
  type Temptation,
} from '@/features/temptation/temptationService'
import {
  isSupported,
  getPermissionStatus,
  requestPermission,
  hasAskedPermission,
  notifyOneHourLeft,
} from '@/features/notifications/notificationService'

const ONE_HOUR_MS = 60 * 60 * 1000
const CHECK_INTERVAL_MS = 60 * 1000 // Check every minute

// Track which temptations we've already notified about
const notifiedOneHour = new Set<string>()

export function useNotifications() {
  const intervalRef = useRef<number | null>(null)

  const checkTemptations = useCallback(() => {
    const temptations = getActiveTemptations()

    temptations.forEach((temptation: Temptation) => {
      const remaining = getTimeRemaining(temptation)

      // Notify when less than 1 hour remaining (and not already notified)
      if (
        remaining > 0 &&
        remaining <= ONE_HOUR_MS &&
        !notifiedOneHour.has(temptation.id)
      ) {
        notifiedOneHour.add(temptation.id)
        notifyOneHourLeft(temptation.amount)
      }
    })
  }, [])

  const askPermission = useCallback(async () => {
    if (!isSupported()) return false
    if (getPermissionStatus() === 'granted') return true
    if (hasAskedPermission()) return false

    const permission = await requestPermission()
    return permission === 'granted'
  }, [])

  useEffect(() => {
    // Start checking if permission granted
    if (getPermissionStatus() === 'granted') {
      // Initial check
      checkTemptations()

      // Set up interval
      intervalRef.current = window.setInterval(checkTemptations, CHECK_INTERVAL_MS)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checkTemptations])

  return {
    isSupported: isSupported(),
    permissionStatus: getPermissionStatus(),
    askPermission,
    hasAskedPermission: hasAskedPermission(),
  }
}
