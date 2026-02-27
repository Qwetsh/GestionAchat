import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GoalState {
  savingsGoal: number | null  // null = no goal set
  savingsGoalReason: string | null  // optional reason/motivation
  setSavingsGoal: (amount: number | null, reason?: string | null) => void
  getProgress: (currentSaved: number) => number  // Returns 0-100
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      savingsGoal: null,
      savingsGoalReason: null,

      setSavingsGoal: (amount: number | null, reason?: string | null) => {
        set({
          savingsGoal: amount,
          savingsGoalReason: amount ? (reason || null) : null
        })
      },

      getProgress: (currentSaved: number) => {
        const { savingsGoal } = get()
        if (!savingsGoal || savingsGoal <= 0) return 0
        const progress = (currentSaved / savingsGoal) * 100
        return Math.min(100, Math.max(0, progress))
      },
    }),
    {
      name: 'goal-storage',
    }
  )
)
