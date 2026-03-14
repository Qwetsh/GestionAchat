// Re-export types from constants
export type { ExpenseCategory, RevenueSource } from '@/lib/constants'

// Expense (replaces Temptation)
export interface Expense {
  id: string
  amount: number
  category: import('@/lib/constants').ExpenseCategory
  forSelf: boolean // true = pour moi, false = pour quelqu'un
  description: string
  date: string // ISO date string
  weekId: string // week identifier for weekly budget tracking
}

// Revenue
export interface Revenue {
  id: string
  amount: number
  source: import('@/lib/constants').RevenueSource
  description: string
  date: string // ISO date string
}

// Incompressible expense (fixed monthly cost)
export interface FixedExpense {
  id: string
  name: string
  amount: number // monthly amount
}

// Weekly summary (computed at reset)
export interface WeekSummary {
  weekId: string
  totalSpent: number
  budget: number
  remaining: number // can be negative
  gemsEarned: number
  underBudget: boolean
}

// App-specific types
export interface UIState {
  isLoading: boolean
  error: string | null
}
