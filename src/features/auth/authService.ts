// Local Storage Auth Service - No backend needed
// Perfect for single-user app

const STORAGE_KEYS = {
  USER: 'gestion-achat-user',
  GAMIFICATION: 'gestion-achat-gamification',
} as const

// Simple hash function for PIN (client-side only)
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin + 'gestion-achat-salt-2026')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export interface AuthResult {
  success: boolean
  userId?: string
  error?: string
}

interface StoredUser {
  id: string
  pinHash: string
  createdAt: string
}

interface StoredGamification {
  userId: string
  xp: number
  level: number
  currentStreak: number
  bestStreak: number
  updatedAt: string
}

function generateId(): string {
  return crypto.randomUUID()
}

export async function registerUser(pin: string): Promise<AuthResult> {
  try {
    // Validate PIN
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return { success: false, error: 'Le code PIN doit contenir 4 chiffres' }
    }

    // Check if user already exists
    const existingUser = localStorage.getItem(STORAGE_KEYS.USER)
    if (existingUser) {
      return { success: false, error: 'Un compte existe déjà. Connecte-toi !' }
    }

    // Hash the PIN
    const pinHash = await hashPin(pin)
    const userId = generateId()

    // Create user
    const user: StoredUser = {
      id: userId,
      pinHash,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

    // Create initial gamification
    const gamification: StoredGamification = {
      userId,
      xp: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(gamification))

    return { success: true, userId }
  } catch (error) {
    console.error('[Auth:register] Error:', error)
    return { success: false, error: 'Une erreur est survenue. Réessaie.' }
  }
}

export async function loginUser(pin: string): Promise<AuthResult> {
  try {
    // Validate PIN
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return { success: false, error: 'Le code PIN doit contenir 4 chiffres' }
    }

    // Get stored user
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
    if (!storedUser) {
      return { success: false, error: 'Code PIN incorrect' }
    }

    const user: StoredUser = JSON.parse(storedUser)

    // Hash and compare
    const pinHash = await hashPin(pin)
    if (pinHash !== user.pinHash) {
      return { success: false, error: 'Code PIN incorrect' }
    }

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('[Auth:login] Error:', error)
    return { success: false, error: 'Une erreur est survenue. Réessaie.' }
  }
}

export async function checkUserExists(): Promise<boolean> {
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
  return storedUser !== null
}

// Export storage keys for other services
export { STORAGE_KEYS }
