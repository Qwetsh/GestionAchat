import { useCallback } from 'react'
import {
  isSupported,
  getPermissionStatus,
  requestPermission,
  hasAskedPermission,
} from '@/features/notifications/notificationService'

export function useNotifications() {
  const askPermission = useCallback(async () => {
    if (!isSupported()) return false
    if (getPermissionStatus() === 'granted') return true
    if (hasAskedPermission()) return false

    const permission = await requestPermission()
    return permission === 'granted'
  }, [])

  return {
    isSupported: isSupported(),
    permissionStatus: getPermissionStatus(),
    askPermission,
    hasAskedPermission: hasAskedPermission(),
  }
}
