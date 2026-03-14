import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTalentById, TALENTS } from '@/lib/talents'

interface TalentState {
  // Purchased talent IDs
  purchasedTalents: string[]

  // Combo tracking: last dates without expenses (YYYY-MM-DD)
  noExpenseDays: string[]

  // Actions
  purchaseTalent: (id: string) => void
  isTalentPurchased: (id: string) => boolean
  hasTalentEffect: (effectType: string) => boolean
  getActiveEffect: <T>(effectType: string) => T | null
  recordNoExpenseDay: (date: string) => void
  getConsecutiveNoExpenseDays: () => number

  // Derived helpers
  isShopItemUnlocked: (itemId: string) => boolean
  getWeeklySavingsMultiplier: () => number
  getNoExpenseDayGems: () => number
  getComboDaysConfig: () => { days: number; gems: number } | null
  getMonthlyBonusGems: () => number
  getWeeklyHalfSavedGems: () => number
}

export const useTalentStore = create<TalentState>()(
  persist(
    (set, get) => ({
      purchasedTalents: [],
      noExpenseDays: [],

      purchaseTalent: (id: string) => {
        set((state) => ({
          purchasedTalents: [...state.purchasedTalents, id],
        }))
      },

      isTalentPurchased: (id: string) => {
        return get().purchasedTalents.includes(id)
      },

      hasTalentEffect: (effectType: string) => {
        return get().purchasedTalents.some((id) => {
          const talent = getTalentById(id)
          return talent?.effect.type === effectType
        })
      },

      getActiveEffect: <T,>(effectType: string): T | null => {
        const talent = get().purchasedTalents
          .map(getTalentById)
          .find((t) => t?.effect.type === effectType)
        return (talent?.effect as T) ?? null
      },

      recordNoExpenseDay: (date: string) => {
        set((state) => {
          const days = state.noExpenseDays.includes(date)
            ? state.noExpenseDays
            : [...state.noExpenseDays.slice(-30), date] // Keep last 30 days
          return { noExpenseDays: days }
        })
      },

      getConsecutiveNoExpenseDays: () => {
        const days = get().noExpenseDays.sort()
        if (days.length === 0) return 0

        let streak = 1
        for (let i = days.length - 1; i > 0; i--) {
          const curr = new Date(days[i])
          const prev = new Date(days[i - 1])
          const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
          if (diff === 1) {
            streak++
          } else {
            break
          }
        }
        return streak
      },

      isShopItemUnlocked: (itemId: string) => {
        return get().purchasedTalents.some((id) => {
          const talent = getTalentById(id)
          return talent?.effect.type === 'unlock_shop_item' && talent.effect.itemId === itemId
        })
      },

      getWeeklySavingsMultiplier: () => {
        const talent = get().purchasedTalents
          .map(getTalentById)
          .find((t) => t?.effect.type === 'upgrade_weekly_savings')
        if (talent && talent.effect.type === 'upgrade_weekly_savings') {
          return talent.effect.gemsPerTranche
        }
        return 1 // Default: 1 gem per 10€
      },

      getNoExpenseDayGems: () => {
        const talent = get().purchasedTalents
          .map(getTalentById)
          .find((t) => t?.effect.type === 'passive_no_expense_day')
        if (talent && talent.effect.type === 'passive_no_expense_day') {
          return talent.effect.gemsPerDay
        }
        return 0
      },

      getComboDaysConfig: () => {
        const talent = get().purchasedTalents
          .map(getTalentById)
          .find((t) => t?.effect.type === 'combo_days')
        if (talent && talent.effect.type === 'combo_days') {
          return { days: talent.effect.days, gems: talent.effect.gems }
        }
        return null
      },

      getMonthlyBonusGems: () => {
        const talent = get().purchasedTalents
          .map(getTalentById)
          .find((t) => t?.effect.type === 'monthly_under_budget')
        if (talent && talent.effect.type === 'monthly_under_budget') {
          return talent.effect.gems
        }
        return 0
      },

      getWeeklyHalfSavedGems: () => {
        const talent = get().purchasedTalents
          .map(getTalentById)
          .find((t) => t?.effect.type === 'weekly_half_saved')
        if (talent && talent.effect.type === 'weekly_half_saved') {
          return talent.effect.gems
        }
        return 0
      },
    }),
    {
      name: 'talent-storage',
    }
  )
)

/** Get all unlocked budget boosts from talents (for shop display) */
export function getUnlockedBudgetBoostsFromStore(): Array<{ amount: number; cost: number }> {
  const { purchasedTalents } = useTalentStore.getState()
  return TALENTS
    .filter((t) => purchasedTalents.includes(t.id) && t.effect.type === 'unlock_budget_boost')
    .map((t) => {
      const e = t.effect as { type: 'unlock_budget_boost'; amount: number; cost: number }
      return { amount: e.amount, cost: e.cost }
    })
}
