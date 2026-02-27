import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Voucher {
  id: string
  type: 'direct' | 'wheel'
  maxAmount: number  // ex: 20€ max
  createdAt: string
  usedAt: string | null
}

interface GemState {
  // Gems are calculated from totalSaved, but we track spent gems
  spentGems: number

  // Vouchers (bons d'achat)
  vouchers: Voucher[]

  // Wheel luck system - increases each loss
  wheelLossStreak: number

  // Actions
  getGems: (totalSaved: number) => number  // Available gems
  getTotalGems: (totalSaved: number) => number  // Total earned
  spendGems: (amount: number) => boolean

  // Voucher actions
  addVoucher: (type: 'direct' | 'wheel', maxAmount: number) => Voucher
  useVoucher: (id: string) => void
  getActiveVouchers: () => Voucher[]

  // Wheel actions
  getWheelWinChance: () => number  // Returns 0-100
  spinWheel: () => boolean  // Returns true if won
  resetWheelStreak: () => void
}

export const useGemStore = create<GemState>()(
  persist(
    (set, get) => ({
      spentGems: 0,
      vouchers: [],
      wheelLossStreak: 0,

      // 1 gem per 10€ saved
      getTotalGems: (totalSaved: number) => {
        return Math.floor(totalSaved / 10)
      },

      getGems: (totalSaved: number) => {
        const total = get().getTotalGems(totalSaved)
        return Math.max(0, total - get().spentGems)
      },

      spendGems: (amount: number) => {
        const { spentGems } = get()
        set({ spentGems: spentGems + amount })
        return true
      },

      addVoucher: (type: 'direct' | 'wheel', maxAmount: number) => {
        const voucher: Voucher = {
          id: crypto.randomUUID(),
          type,
          maxAmount,
          createdAt: new Date().toISOString(),
          usedAt: null,
        }
        set((state) => ({
          vouchers: [...state.vouchers, voucher],
        }))
        return voucher
      },

      useVoucher: (id: string) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === id ? { ...v, usedAt: new Date().toISOString() } : v
          ),
        }))
      },

      getActiveVouchers: () => {
        return get().vouchers.filter((v) => v.usedAt === null)
      },

      // Base 10% chance, +10% per loss, max 90%
      getWheelWinChance: () => {
        const baseChance = 10
        const bonusPerLoss = 10
        const maxChance = 90
        return Math.min(maxChance, baseChance + get().wheelLossStreak * bonusPerLoss)
      },

      spinWheel: () => {
        const chance = get().getWheelWinChance()
        const roll = Math.random() * 100
        const won = roll < chance

        if (won) {
          set({ wheelLossStreak: 0 })
        } else {
          set((state) => ({ wheelLossStreak: state.wheelLossStreak + 1 }))
        }

        return won
      },

      resetWheelStreak: () => {
        set({ wheelLossStreak: 0 })
      },
    }),
    {
      name: 'gem-storage',
    }
  )
)
