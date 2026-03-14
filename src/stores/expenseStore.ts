import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense } from '@/types'
import type { ExpenseCategory } from '@/lib/constants'
import { getWeekId, getMonthId, getYearId } from '@/lib/constants'

interface ExpenseState {
  expenses: Expense[]

  // Actions
  addExpense: (data: { amount: number; category: ExpenseCategory; forSelf: boolean; description: string }) => Expense
  deleteExpense: (id: string) => void

  // Queries
  getExpensesForWeek: (weekId?: string) => Expense[]
  getExpensesForMonth: (monthId?: string) => Expense[]
  getExpensesForYear: (yearId?: string) => Expense[]
  getAllExpenses: () => Expense[]

  // Stats
  getTotalForWeek: (weekId?: string) => number
  getTotalForMonth: (monthId?: string) => number
  getTotalForYear: (yearId?: string) => number
  getTotalAllTime: () => number
  getTotalForSelf: () => number
  getTotalForOthers: () => number
  getTotalForSelfInPeriod: (expenses: Expense[]) => number
  getTotalForOthersInPeriod: (expenses: Expense[]) => number
  getCategoryBreakdown: (expenses: Expense[]) => Record<ExpenseCategory, number>
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],

      addExpense: (data) => {
        const now = new Date()
        const expense: Expense = {
          id: crypto.randomUUID(),
          amount: data.amount,
          category: data.category,
          forSelf: data.forSelf,
          description: data.description,
          date: now.toISOString(),
          weekId: getWeekId(now),
        }
        set((state) => ({
          expenses: [expense, ...state.expenses],
        }))
        return expense
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }))
      },

      getExpensesForWeek: (weekId?: string) => {
        const target = weekId || getWeekId()
        return get().expenses.filter((e) => e.weekId === target)
      },

      getExpensesForMonth: (monthId?: string) => {
        const target = monthId || getMonthId()
        return get().expenses.filter((e) => getMonthId(new Date(e.date)) === target)
      },

      getExpensesForYear: (yearId?: string) => {
        const target = yearId || getYearId()
        return get().expenses.filter((e) => getYearId(new Date(e.date)) === target)
      },

      getAllExpenses: () => get().expenses,

      getTotalForWeek: (weekId?: string) => {
        return get().getExpensesForWeek(weekId).reduce((sum, e) => sum + e.amount, 0)
      },

      getTotalForMonth: (monthId?: string) => {
        return get().getExpensesForMonth(monthId).reduce((sum, e) => sum + e.amount, 0)
      },

      getTotalForYear: (yearId?: string) => {
        return get().getExpensesForYear(yearId).reduce((sum, e) => sum + e.amount, 0)
      },

      getTotalAllTime: () => {
        return get().expenses.reduce((sum, e) => sum + e.amount, 0)
      },

      getTotalForSelf: () => {
        return get().expenses.filter((e) => e.forSelf).reduce((sum, e) => sum + e.amount, 0)
      },

      getTotalForOthers: () => {
        return get().expenses.filter((e) => !e.forSelf).reduce((sum, e) => sum + e.amount, 0)
      },

      getTotalForSelfInPeriod: (expenses: Expense[]) => {
        return expenses.filter((e) => e.forSelf).reduce((sum, e) => sum + e.amount, 0)
      },

      getTotalForOthersInPeriod: (expenses: Expense[]) => {
        return expenses.filter((e) => !e.forSelf).reduce((sum, e) => sum + e.amount, 0)
      },

      getCategoryBreakdown: (expenses: Expense[]) => {
        const breakdown = {} as Record<ExpenseCategory, number>
        expenses.forEach((e) => {
          breakdown[e.category] = (breakdown[e.category] || 0) + e.amount
        })
        return breakdown
      },
    }),
    {
      name: 'expense-storage',
    }
  )
)
