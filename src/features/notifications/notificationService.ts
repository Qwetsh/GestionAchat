// Local Notification Service
// Handles browser notifications for timer alerts

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

  // Auto close after 10 seconds
  setTimeout(() => notification.close(), 10000)

  // Focus app on click
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

export function notifyTimerExpired(temptationAmount: number): void {
  showNotification('Tu as resiste! 🎉', {
    body: `Bravo! Tu as economise ${temptationAmount.toFixed(2)} €`,
    tag: 'timer-expired',
    requireInteraction: true,
  })
}

export function notifyOneHourLeft(temptationAmount: number): void {
  showNotification('Plus que 1 heure! 💪', {
    body: `Tiens bon! ${temptationAmount.toFixed(2)} € en jeu`,
    tag: 'one-hour-left',
  })
}

export function notifyMultipleExpired(count: number, totalSaved: number): void {
  showNotification(`${count} tentations resistees! 🎉`, {
    body: `Incroyable! Tu as economise ${totalSaved.toFixed(2)} €`,
    tag: 'multiple-expired',
    requireInteraction: true,
  })
}
