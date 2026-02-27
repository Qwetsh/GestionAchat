import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  { id: 'boite', name: 'Boîte', emoji: '📦', image: '/GestionAchat/mascot/cats/ChatonCarton.png', gemCost: 15 },
  { id: 'doudou', name: 'Doudou', emoji: '💤', image: '/GestionAchat/mascot/cats/ChatonCoussin.png', gemCost: 20 },
  { id: 'caramel', name: 'Caramel', emoji: '🍬', image: '/GestionAchat/mascot/cats/ChatonDoupe.png', gemCost: 25 },
  { id: 'professeur', name: 'Professeur', emoji: '🎓', image: '/GestionAchat/mascot/cats/ChatonLunette.png', gemCost: 30 },
]

// Available backgrounds
export interface Background {
  id: string
  name: string
  emoji: string
  gemCost: number
}

export const BACKGROUNDS: Background[] = [
  { id: 'none', name: 'Aucun', emoji: '⬜', gemCost: 0 },
  { id: 'stars', name: 'Étoiles', emoji: '✨', gemCost: 5 },
  { id: 'hearts', name: 'Coeurs', emoji: '💕', gemCost: 5 },
  { id: 'sparkles', name: 'Paillettes', emoji: '💫', gemCost: 8 },
  { id: 'rainbow', name: 'Arc-en-ciel', emoji: '🌈', gemCost: 12 },
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
      unlockedBackgrounds: ['none'], // None is free
      selectedCat: 'mochi',
      selectedBackground: 'none',

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
    }
  )
)
