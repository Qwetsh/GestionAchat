// Local Storage Temptation Service
// Handles all temptation CRUD operations locally

export type Category = 'cosmetics' | 'books' | 'stationery' | 'videogames' | 'other'
export type Status = 'active' | 'resisted' | 'cracked'

export interface Temptation {
  id: string
  photoUrl: string | null
  amount: number
  category: Category
  status: Status
  createdAt: string
  resolvedAt: string | null
}

const STORAGE_KEY = 'gestion-achat-temptations'
const TIMER_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

function generateId(): string {
  return crypto.randomUUID()
}

function getTemptations(): Temptation[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveTemptations(temptations: Temptation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(temptations))
}

export function createTemptation(data: {
  photoUrl: string | null
  amount: number
  category: Category
}): Temptation {
  const temptation: Temptation = {
    id: generateId(),
    photoUrl: data.photoUrl,
    amount: data.amount,
    category: data.category,
    status: 'active',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  }

  const temptations = getTemptations()
  temptations.unshift(temptation) // Add at beginning
  saveTemptations(temptations)

  return temptation
}

export function getAllTemptations(): Temptation[] {
  return getTemptations()
}

export function getActiveTemptations(): Temptation[] {
  return getTemptations().filter((t) => t.status === 'active')
}

export function getResolvedTemptations(): Temptation[] {
  return getTemptations().filter((t) => t.status !== 'active')
}

export function getTemptationById(id: string): Temptation | null {
  return getTemptations().find((t) => t.id === id) || null
}

export function markAsCracked(id: string): Temptation | null {
  const temptations = getTemptations()
  const index = temptations.findIndex((t) => t.id === id)

  if (index === -1) return null

  temptations[index] = {
    ...temptations[index],
    status: 'cracked',
    resolvedAt: new Date().toISOString(),
  }

  saveTemptations(temptations)
  return temptations[index]
}

export function markAsResisted(id: string): Temptation | null {
  const temptations = getTemptations()
  const index = temptations.findIndex((t) => t.id === id)

  if (index === -1) return null

  temptations[index] = {
    ...temptations[index],
    status: 'resisted',
    resolvedAt: new Date().toISOString(),
  }

  saveTemptations(temptations)
  return temptations[index]
}

// Check and auto-resolve expired temptations
export function checkAndResolveExpired(): Temptation[] {
  const temptations = getTemptations()
  const now = Date.now()
  const resolved: Temptation[] = []

  const updated = temptations.map((t) => {
    if (t.status === 'active') {
      const createdAt = new Date(t.createdAt).getTime()
      const expiresAt = createdAt + TIMER_DURATION_MS

      if (now >= expiresAt) {
        const resolvedTemptation = {
          ...t,
          status: 'resisted' as Status,
          resolvedAt: new Date(expiresAt).toISOString(),
        }
        resolved.push(resolvedTemptation)
        return resolvedTemptation
      }
    }
    return t
  })

  if (resolved.length > 0) {
    saveTemptations(updated)
  }

  return resolved
}

// Calculate time remaining for a temptation
export function getTimeRemaining(temptation: Temptation): number {
  if (temptation.status !== 'active') return 0

  const createdAt = new Date(temptation.createdAt).getTime()
  const expiresAt = createdAt + TIMER_DURATION_MS
  const remaining = expiresAt - Date.now()

  return Math.max(0, remaining)
}

// Format time remaining as string
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '0:00:00'

  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Calculate progress (0 to 1) for timer circle
export function getTimerProgress(temptation: Temptation): number {
  if (temptation.status !== 'active') return 1

  const remaining = getTimeRemaining(temptation)
  const progress = 1 - (remaining / TIMER_DURATION_MS)

  return Math.min(1, Math.max(0, progress))
}

// Get statistics
export function getStats(): {
  totalSaved: number
  totalCracked: number
  resistedCount: number
  crackedCount: number
  activeCount: number
} {
  const temptations = getTemptations()

  const resisted = temptations.filter((t) => t.status === 'resisted')
  const cracked = temptations.filter((t) => t.status === 'cracked')
  const active = temptations.filter((t) => t.status === 'active')

  return {
    totalSaved: resisted.reduce((sum, t) => sum + t.amount, 0),
    totalCracked: cracked.reduce((sum, t) => sum + t.amount, 0),
    resistedCount: resisted.length,
    crackedCount: cracked.length,
    activeCount: active.length,
  }
}

// Get resisted count per category
export function getCategoryResistedStats(): Record<Category, number> {
  const temptations = getTemptations()
  const resisted = temptations.filter((t) => t.status === 'resisted')

  const stats: Record<Category, number> = {
    cosmetics: 0,
    books: 0,
    stationery: 0,
    videogames: 0,
    other: 0,
  }

  resisted.forEach((t) => {
    stats[t.category]++
  })

  return stats
}

export const CATEGORY_LABELS: Record<Category, string> = {
  cosmetics: 'Cosmétique',
  books: 'Livres',
  stationery: 'Feutres/Coloriage',
  videogames: 'Jeux vidéo',
  other: 'Autre',
}

export const CATEGORY_EMOJIS: Record<Category, string> = {
  cosmetics: '💄',
  books: '📚',
  stationery: '🖍️',
  videogames: '🎮',
  other: '🛍️',
}
