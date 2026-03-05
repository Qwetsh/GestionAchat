import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVEL_THRESHOLDS, calculateLevel } from '@/lib/constants'

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

// Re-export getLevelTitle from constants for backwards compatibility
export { getLevelTitle } from '@/lib/constants'
