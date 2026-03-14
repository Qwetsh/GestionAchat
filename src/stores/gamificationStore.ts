import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVEL_THRESHOLDS, calculateLevel } from '@/lib/constants'

interface GamificationState {
  xp: number
  level: number
  // Streaks are now weekly: consecutive weeks under budget
  currentStreak: number
  bestStreak: number
  lastSuccessWeekId: string | null

  addXP: (amount: number) => void
  incrementStreak: (weekId: string) => void
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
      lastSuccessWeekId: null,

      addXP: (amount) => {
        set((state) => {
          const newXP = state.xp + amount
          return {
            xp: newXP,
            level: calculateLevel(newXP),
          }
        })
      },

      incrementStreak: (weekId: string) => {
        const { lastSuccessWeekId, currentStreak, bestStreak } = get()

        // Already counted this week
        if (lastSuccessWeekId === weekId) return

        // Check if previous week was the last success (consecutive)
        // weekId format is "YYYY-MM-DD" (Monday date)
        let isConsecutive = false
        if (lastSuccessWeekId) {
          const lastDate = new Date(lastSuccessWeekId)
          const thisDate = new Date(weekId)
          const diffDays = (thisDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          isConsecutive = Math.abs(diffDays - 7) < 2 // ~7 days apart = consecutive weeks
        }

        const newStreak = isConsecutive ? currentStreak + 1 : 1
        const newBest = Math.max(newStreak, bestStreak)

        set({
          currentStreak: newStreak,
          bestStreak: newBest,
          lastSuccessWeekId: weekId,
        })
      },

      resetStreak: () => set({ currentStreak: 0 }),

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
        return Math.min(1, Math.max(0, (xp - currentThreshold) / (nextThreshold - currentThreshold)))
      },
    }),
    {
      name: 'gamification-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate level from XP on load (fixes stale level after threshold changes)
          state.level = calculateLevel(state.xp)
        }
      },
    }
  )
)

export { getLevelTitle } from '@/lib/constants'
