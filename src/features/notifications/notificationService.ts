// Local Notification Service

const NOTIFICATION_PERMISSION_KEY = 'notification-permission-asked'

export type NotificationPermission = 'granted' | 'denied' | 'default'

export function getPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) return 'denied'
  return Notification.permission as NotificationPermission
}

export function isSupported(): boolean {
  return 'Notification' in window
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) return 'denied'

  const permission = await Notification.requestPermission()
  localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true')
  return permission as NotificationPermission
}

export function hasAskedPermission(): boolean {
  return localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === 'true'
}

export function showNotification(
  title: string,
  options?: {
    body?: string
    icon?: string
    tag?: string
    requireInteraction?: boolean
  }
): void {
  if (getPermissionStatus() !== 'granted') return

  const notification = new Notification(title, {
    body: options?.body,
    icon: options?.icon || '/icons/icon.svg',
    tag: options?.tag,
    requireInteraction: options?.requireInteraction || false,
  })

  setTimeout(() => notification.close(), 10000)

  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

export function notifyWeeklyGemsEarned(gemsEarned: number, savedAmount: number): void {
  showNotification(`+${gemsEarned} gemmes gagnées ! 💎`, {
    body: `Bravo ! Tu as économisé ${savedAmount.toFixed(2)} € cette semaine`,
    tag: 'weekly-gems',
    requireInteraction: true,
  })
}

export function notifyWeeklyOverBudget(overAmount: number): void {
  showNotification('Budget dépassé cette semaine 😕', {
    body: `${overAmount.toFixed(2)} € de dépassement. Nouvelle semaine, nouveau départ !`,
    tag: 'weekly-over',
  })
}
