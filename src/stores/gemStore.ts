import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GemState {
  // Total gems earned (accumulated from weekly resets)
  totalGemsEarned: number
  spentGems: number

  // Wheel luck system
  wheelLossStreak: number

  // Actions
  getAvailableGems: () => number
  addGems: (amount: number) => void
  spendGems: (amount: number) => boolean

  // Wheel actions
  getWheelWinChance: () => number
  spinWheel: () => boolean
  resetWheelStreak: () => void
}

export const useGemStore = create<GemState>()(
  persist(
    (set, get) => ({
      totalGemsEarned: 0,
      spentGems: 0,
      wheelLossStreak: 0,

      getAvailableGems: () => {
        return Math.max(0, get().totalGemsEarned - get().spentGems)
      },

      addGems: (amount) => {
        set((state) => ({
          totalGemsEarned: state.totalGemsEarned + amount,
        }))
      },

      spendGems: (amount) => {
        if (get().getAvailableGems() < amount) return false
        set((state) => ({ spentGems: state.spentGems + amount }))
        return true
      },

      // Base 10%, +10% per loss, max 90%
      getWheelWinChance: () => {
        return Math.min(90, 10 + get().wheelLossStreak * 10)
      },

      spinWheel: () => {
        const chance = get().getWheelWinChance()
        const won = Math.random() * 100 < chance

        if (won) {
          set({ wheelLossStreak: 0 })
        } else {
          set((state) => ({ wheelLossStreak: state.wheelLossStreak + 1 }))
        }
        return won
      },

      resetWheelStreak: () => set({ wheelLossStreak: 0 }),
    }),
    {
      name: 'gem-storage',
    }
  )
)
