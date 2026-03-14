import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Revenue } from '@/types'
import type { RevenueSource } from '@/lib/constants'
import { getMonthId, getYearId } from '@/lib/constants'

interface RevenueState {
  revenues: Revenue[]

  // Actions
  addRevenue: (data: { amount: number; source: RevenueSource; description: string }) => Revenue
  deleteRevenue: (id: string) => void

  // Queries
  getRevenuesForMonth: (monthId?: string) => Revenue[]
  getRevenuesForYear: (yearId?: string) => Revenue[]
  getAllRevenues: () => Revenue[]

  // Stats
  getTotalForMonth: (monthId?: string) => number
  getTotalForYear: (yearId?: string) => number
  getTotalAllTime: () => number
  getBySource: (revenues: Revenue[]) => Record<RevenueSource, number>
}

export const useRevenueStore = create<RevenueState>()(
  persist(
    (set, get) => ({
      revenues: [],

      addRevenue: (data) => {
        const revenue: Revenue = {
          id: crypto.randomUUID(),
          amount: data.amount,
          source: data.source,
          description: data.description,
          date: new Date().toISOString(),
        }
        set((state) => ({
          revenues: [revenue, ...state.revenues],
        }))
        return revenue
      },

      deleteRevenue: (id) => {
        set((state) => ({
          revenues: state.revenues.filter((r) => r.id !== id),
        }))
      },

      getRevenuesForMonth: (monthId?: string) => {
        const target = monthId || getMonthId()
        return get().revenues.filter((r) => getMonthId(new Date(r.date)) === target)
      },

      getRevenuesForYear: (yearId?: string) => {
        const target = yearId || getYearId()
        return get().revenues.filter((r) => getYearId(new Date(r.date)) === target)
      },

      getAllRevenues: () => get().revenues,

      getTotalForMonth: (monthId?: string) => {
        return get().getRevenuesForMonth(monthId).reduce((sum, r) => sum + r.amount, 0)
      },

      getTotalForYear: (yearId?: string) => {
        return get().getRevenuesForYear(yearId).reduce((sum, r) => sum + r.amount, 0)
      },

      getTotalAllTime: () => {
        return get().revenues.reduce((sum, r) => sum + r.amount, 0)
      },

      getBySource: (revenues: Revenue[]) => {
        const breakdown = {} as Record<RevenueSource, number>
        revenues.forEach((r) => {
          breakdown[r.source] = (breakdown[r.source] || 0) + r.amount
        })
        return breakdown
      },
    }),
    {
      name: 'revenue-storage',
    }
  )
)
