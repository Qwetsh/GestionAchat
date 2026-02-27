import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GamificationState {
  xp: number
  level: number
  currentStreak: number
  bestStreak: number
  lastResistDate: string | null
  addXP: (amount: number) => void
  incrementStreak: () => void
  resetStreak: () => void
  getNextLevelXP: () => number
  getLevelProgress: () => number
}

// XP needed for each level (cumulative)
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
]

const LEVEL_TITLES = [
  'Débutante',        // 1
  'Apprentie',        // 2
  'Résistante',       // 3
  'Guerrière',        // 4
  'Championne',       // 5
  'Maîtresse',        // 6
  'Experte',          // 7
  'Légende',          // 8
  'Mythique',         // 9
  'Transcendante',    // 10
]

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
      lastResistDate: null,

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.xp + amount
          const newLevel = calculateLevel(newXP)
          return {
            xp: newXP,
            level: newLevel,
          }
        })
      },

      incrementStreak: () => {
        const today = new Date().toDateString()
        const { lastResistDate, currentStreak, bestStreak } = get()

        // Check if already incremented today
        if (lastResistDate === today) return

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const wasYesterday = lastResistDate === yesterday.toDateString()

        const newStreak = wasYesterday || !lastResistDate ? currentStreak + 1 : 1
        const newBest = Math.max(newStreak, bestStreak)

        set({
          currentStreak: newStreak,
          bestStreak: newBest,
          lastResistDate: today,
        })
      },

      resetStreak: () => {
        set({ currentStreak: 0 })
      },

      getNextLevelXP: () => {
        const { level } = get()
        if (level >= LEVEL_THRESHOLDS.length) {
          return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
        }
        return LEVEL_THRESHOLDS[level]
      },

      getLevelProgress: () => {
        const { xp, level } = get()
        const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
        const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
        const progress = (xp - currentThreshold) / (nextThreshold - currentThreshold)
        return Math.min(1, Math.max(0, progress))
      },
    }),
    {
      name: 'gamification-storage',
    }
  )
)

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
}
