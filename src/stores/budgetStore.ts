import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FixedExpense, WeekSummary } from '@/types'
import { WEEKLY_BUDGET, GEMS_PER_10_SAVED, getWeekId } from '@/lib/constants'

interface BudgetState {
  // Fixed monthly expenses (loyer, abonnements, etc.)
  salary: number
  fixedExpenses: FixedExpense[]

  // Weekly history
  weekSummaries: WeekSummary[]
  lastProcessedWeekId: string | null

  // Weekly budget bonuses (gems → extra budget for current week)
  weeklyBonuses: Record<string, number> // weekId → total bonus €

  // Actions - fixed expenses
  setSalary: (amount: number) => void
  addFixedExpense: (name: string, amount: number) => void
  removeFixedExpense: (id: string) => void
  updateFixedExpense: (id: string, name: string, amount: number) => void

  // Budget bonus
  addWeeklyBonus: (amount: number) => void
  getWeeklyBonus: (weekId?: string) => number
  getEffectiveBudget: (weekId?: string) => number // WEEKLY_BUDGET + bonus

  // Queries
  getTotalFixedExpenses: () => number
  getMonthlyDisposable: () => number // salary - fixed expenses
  getWeekSummary: (weekId: string) => WeekSummary | undefined

  // Weekly reset logic — returns gems earned (0 if over budget)
  processWeekEnd: (weeklySpent: number) => { gemsEarned: number; summary: WeekSummary } | null

  // Projection
  getProjection: (monthlyDiscretionary: number, months: number) => number
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      salary: 0,
      fixedExpenses: [],
      weekSummaries: [],
      lastProcessedWeekId: null,
      weeklyBonuses: {},

      setSalary: (amount) => set({ salary: amount }),

      addFixedExpense: (name, amount) => {
        const expense: FixedExpense = {
          id: crypto.randomUUID(),
          name,
          amount,
        }
        set((state) => ({
          fixedExpenses: [...state.fixedExpenses, expense],
        }))
      },

      removeFixedExpense: (id) => {
        set((state) => ({
          fixedExpenses: state.fixedExpenses.filter((e) => e.id !== id),
        }))
      },

      updateFixedExpense: (id, name, amount) => {
        set((state) => ({
          fixedExpenses: state.fixedExpenses.map((e) =>
            e.id === id ? { ...e, name, amount } : e
          ),
        }))
      },

      addWeeklyBonus: (amount) => {
        const weekId = getWeekId()
        set((state) => ({
          weeklyBonuses: {
            ...state.weeklyBonuses,
            [weekId]: (state.weeklyBonuses[weekId] || 0) + amount,
          },
        }))
      },

      getWeeklyBonus: (weekId?) => {
        const target = weekId || getWeekId()
        return get().weeklyBonuses[target] || 0
      },

      getEffectiveBudget: (weekId?) => {
        return WEEKLY_BUDGET + get().getWeeklyBonus(weekId)
      },

      getTotalFixedExpenses: () => {
        return get().fixedExpenses.reduce((sum, e) => sum + e.amount, 0)
      },

      getMonthlyDisposable: () => {
        const { salary } = get()
        const totalFixed = get().getTotalFixedExpenses()
        return salary - totalFixed
      },

      getWeekSummary: (weekId) => {
        return get().weekSummaries.find((s) => s.weekId === weekId)
      },

      processWeekEnd: (weeklySpent) => {
        const currentWeekId = getWeekId()
        const { lastProcessedWeekId } = get()

        // Already processed this week
        if (lastProcessedWeekId === currentWeekId) return null

        // Fresh account — never processed before, skip (no real data for previous week)
        if (lastProcessedWeekId === null) {
          set({ lastProcessedWeekId: currentWeekId })
          return null
        }

        // Calculate the previous week's ID to process
        const prevWeekDate = new Date()
        prevWeekDate.setDate(prevWeekDate.getDate() - 7)
        const prevWeekId = getWeekId(prevWeekDate)

        // Don't reprocess
        if (get().weekSummaries.some((s) => s.weekId === prevWeekId)) return null

        const effectiveBudget = WEEKLY_BUDGET + (get().weeklyBonuses[prevWeekId] || 0)
        const remaining = effectiveBudget - weeklySpent
        const underBudget = remaining >= 0
        const gemsEarned = underBudget ? Math.floor(remaining / 10) * GEMS_PER_10_SAVED : 0

        const summary: WeekSummary = {
          weekId: prevWeekId,
          totalSpent: weeklySpent,
          budget: effectiveBudget,
          remaining,
          gemsEarned,
          underBudget,
        }

        set((state) => ({
          weekSummaries: [...state.weekSummaries, summary],
          lastProcessedWeekId: currentWeekId,
        }))

        return { gemsEarned, summary }
      },

      // Project savings: if spending X€/month discretionary, in N months you'll have saved...
      getProjection: (monthlyDiscretionary, months) => {
        const disposable = get().getMonthlyDisposable()
        const monthlySaved = disposable - monthlyDiscretionary
        return monthlySaved * months
      },
    }),
    {
      name: 'budget-storage',
    }
  )
)
