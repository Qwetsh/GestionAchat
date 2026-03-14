import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DecorationId } from '@/components/ButtonDecoration'

// Available cats
export interface CatSkin {
  id: string
  name: string
  emoji: string
  image: string
  gemCost: number
}

export const CAT_SKINS: CatSkin[] = [
  { id: 'mochi', name: 'Mochi', emoji: '🍡', image: '/GestionAchat/mascot/cats/Chaton.png', gemCost: 0 }, // Free default
  { id: 'boite', name: 'Boîte', emoji: '📦', image: '/GestionAchat/mascot/cats/ChatonCarton.png', gemCost: 5 },
  { id: 'doudou', name: 'Doudou', emoji: '💤', image: '/GestionAchat/mascot/cats/ChatonCoussin.png', gemCost: 5 },
  { id: 'caramel', name: 'Caramel', emoji: '🍬', image: '/GestionAchat/mascot/cats/ChatonDoupe.png', gemCost: 5 },
  { id: 'professeur', name: 'Professeur', emoji: '🎓', image: '/GestionAchat/mascot/cats/ChatonLunette.png', gemCost: 5 },
  { id: 'dino', name: 'Dino', emoji: '🦖', image: '/GestionAchat/mascot/cats/ChatonDino.png', gemCost: 5 },
  { id: 'mimi', name: 'Mimi', emoji: '🎀', image: '/GestionAchat/mascot/cats/Mimi.png', gemCost: 5 },
  { id: 'musicosse', name: 'Musicosse', emoji: '🎵', image: '/GestionAchat/mascot/cats/Musicosse.png', gemCost: 5 },
]

// Theme colors per background
export interface BackgroundTheme {
  btnPrimary: [string, string]   // [from, to] — Nouvelle dépense
  btnShop: [string, string]      // Boutique
  btnExpenses: [string, string]  // Dépenses
  topBarBg: string               // Top bar background opacity
  bubbleBg: string               // Speech bubble tint
  decoration: DecorationId       // Button decoration style
}

// Available backgrounds
export interface Background {
  id: string
  name: string
  emoji: string
  image?: string
  gemCost: number
  theme: BackgroundTheme
}

const DEFAULT_THEME: BackgroundTheme = {
  btnPrimary: ['#4ADE80', '#16A34A'],
  btnShop: ['#F472B6', '#DB2777'],
  btnExpenses: ['#A78BFA', '#7C3AED'],
  topBarBg: 'rgba(15, 10, 26, 0.7)',
  bubbleBg: 'rgba(255,255,255,0.15)',
  decoration: 'none',
}

export const BACKGROUNDS: Background[] = [
  {
    id: 'none', name: 'Aucun', emoji: '⬜', gemCost: 0,
    theme: DEFAULT_THEME,
  },
  {
    id: 'salon', name: 'Salon', emoji: '🛋️', image: '/GestionAchat/mascot/backgrounds/Salon.png', gemCost: 10,
    theme: {
      btnPrimary: ['#86EFAC', '#22C55E'],
      btnShop: ['#FDBA74', '#EA580C'],
      btnExpenses: ['#93C5FD', '#3B82F6'],
      topBarBg: 'rgba(0,0,0,0.35)',
      bubbleBg: 'rgba(255,255,255,0.18)',
      decoration: 'cozy',
    },
  },
  {
    id: 'chambre', name: 'Chambre', emoji: '🛏️', image: '/GestionAchat/mascot/backgrounds/Chambre.png', gemCost: 10,
    theme: {
      btnPrimary: ['#C4B5FD', '#7C3AED'],
      btnShop: ['#F9A8D4', '#DB2777'],
      btnExpenses: ['#67E8F9', '#0891B2'],
      topBarBg: 'rgba(0,0,0,0.25)',
      bubbleBg: 'rgba(139,92,246,0.15)',
      decoration: 'stars',
    },
  },
  {
    id: 'bureau', name: 'Bureau', emoji: '💼', image: '/GestionAchat/mascot/backgrounds/Bureau.png', gemCost: 0,
    theme: {
      btnPrimary: ['#818CF8', '#4F46E5'],
      btnShop: ['#F472B6', '#DB2777'],
      btnExpenses: ['#22D3EE', '#0891B2'],
      topBarBg: 'rgba(0,0,0,0.4)',
      bubbleBg: 'rgba(99,102,241,0.15)',
      decoration: 'neon',
    },
  },
  {
    id: 'jardin', name: 'Jardin', emoji: '🌳', image: '/GestionAchat/mascot/backgrounds/Jardin.png', gemCost: 10,
    theme: {
      btnPrimary: ['#4ADE80', '#16A34A'],
      btnShop: ['#FB923C', '#EA580C'],
      btnExpenses: ['#FACC15', '#CA8A04'],
      topBarBg: 'rgba(0,0,0,0.4)',
      bubbleBg: 'rgba(255,255,255,0.2)',
      decoration: 'leaves',
    },
  },
  {
    id: 'japon', name: 'Japon', emoji: '🗾', image: '/GestionAchat/mascot/backgrounds/Japon.png', gemCost: 15,
    theme: {
      btnPrimary: ['#FB7185', '#E11D48'],
      btnShop: ['#C084FC', '#9333EA'],
      btnExpenses: ['#FBBF24', '#B45309'],
      topBarBg: 'rgba(0,0,0,0.3)',
      bubbleBg: 'rgba(244,114,182,0.12)',
      decoration: 'sakura',
    },
  },
  {
    id: 'konbini', name: 'Konbini', emoji: '🏪', image: '/GestionAchat/mascot/backgrounds/Konbini.png', gemCost: 15,
    theme: {
      btnPrimary: ['#FB923C', '#C2410C'],
      btnShop: ['#60A5FA', '#2563EB'],
      btnExpenses: ['#4ADE80', '#16A34A'],
      topBarBg: 'rgba(0,0,0,0.4)',
      bubbleBg: 'rgba(251,146,60,0.12)',
      decoration: 'rain',
    },
  },
]

interface MascotState {
  // Unlocked items
  unlockedCats: string[]
  unlockedBackgrounds: string[]

  // Currently equipped
  selectedCat: string
  selectedBackground: string

  // Actions
  unlockCat: (id: string) => void
  unlockBackground: (id: string) => void
  isCatUnlocked: (id: string) => boolean
  isBackgroundUnlocked: (id: string) => boolean
  selectCat: (id: string) => void
  selectBackground: (id: string) => void
  getSelectedCat: () => CatSkin
  getSelectedBackground: () => Background
}

export const useMascotStore = create<MascotState>()(
  persist(
    (set, get) => ({
      unlockedCats: ['mochi'], // Mochi is free
      unlockedBackgrounds: ['none', 'bureau'], // None + Bureau are free
      selectedCat: 'mochi',
      selectedBackground: 'bureau',

      unlockCat: (id: string) => {
        set((state) => ({
          unlockedCats: [...state.unlockedCats, id],
        }))
      },

      unlockBackground: (id: string) => {
        set((state) => ({
          unlockedBackgrounds: [...state.unlockedBackgrounds, id],
        }))
      },

      isCatUnlocked: (id: string) => {
        return get().unlockedCats.includes(id)
      },

      isBackgroundUnlocked: (id: string) => {
        return get().unlockedBackgrounds.includes(id)
      },

      selectCat: (id: string) => {
        set({ selectedCat: id })
      },

      selectBackground: (id: string) => {
        set({ selectedBackground: id })
      },

      getSelectedCat: () => {
        const selected = get().selectedCat
        return CAT_SKINS.find((c) => c.id === selected) || CAT_SKINS[0]
      },

      getSelectedBackground: () => {
        const selected = get().selectedBackground
        return BACKGROUNDS.find((b) => b.id === selected) || BACKGROUNDS[0]
      },
    }),
    {
      name: 'mascot-storage',
      onRehydrateStorage: () => (state) => {
        if (state && !state.unlockedBackgrounds.includes('bureau')) {
          state.unlockedBackgrounds.push('bureau')
          if (state.selectedBackground === 'none') {
            state.selectedBackground = 'bureau'
          }
        }
      },
    }
  )
)
