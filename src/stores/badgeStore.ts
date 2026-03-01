import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '@/features/temptation/temptationService'

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  unlockedAt: string | null
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  emoji: string
  category: 'milestone' | 'streak' | 'category'
  check: (stats: BadgeStats) => boolean
}

export interface BadgeStats {
  totalSaved: number
  resistedCount: number
  currentStreak: number
  categoryResisted: Record<Category, number>
}

// All badge definitions
const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Milestone badges
  {
    id: 'premiere-victoire',
    name: 'Première Victoire',
    description: '1 tentation résistée',
    emoji: '🏆',
    category: 'milestone',
    check: (stats) => stats.resistedCount >= 1,
  },
  {
    id: 'econome',
    name: 'Économe',
    description: '50€ économisés',
    emoji: '💰',
    category: 'milestone',
    check: (stats) => stats.totalSaved >= 50,
  },
  {
    id: 'coffre-plein',
    name: 'Coffre Plein',
    description: '200€ économisés',
    emoji: '💎',
    category: 'milestone',
    check: (stats) => stats.totalSaved >= 200,
  },
  {
    id: 'fortune',
    name: 'Fortune',
    description: '500€ économisés',
    emoji: '👑',
    category: 'milestone',
    check: (stats) => stats.totalSaved >= 500,
  },
  {
    id: 'veteran',
    name: 'Vétéran',
    description: '10 tentations résistées',
    emoji: '🎖️',
    category: 'milestone',
    check: (stats) => stats.resistedCount >= 10,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: '100 tentations résistées',
    emoji: '🏅',
    category: 'milestone',
    check: (stats) => stats.resistedCount >= 100,
  },

  // Streak badges
  {
    id: 'debut-flamme',
    name: 'Début de Flamme',
    description: '3 jours d\'affilée',
    emoji: '🔥',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'semaine-parfaite',
    name: 'Semaine Parfaite',
    description: '7 jours d\'affilée',
    emoji: '⭐',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'quinzaine',
    name: 'Quinzaine',
    description: '15 jours d\'affilée',
    emoji: '🌟',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 15,
  },
  {
    id: 'mois-de-fer',
    name: 'Mois de Fer',
    description: '30 jours d\'affilée',
    emoji: '💪',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 30,
  },

  // Category badges
  {
    id: 'anti-cosmetiques',
    name: 'Anti-Cosmétiques',
    description: '5 cosmétiques résistés',
    emoji: '💄',
    category: 'category',
    check: (stats) => (stats.categoryResisted.cosmetics || 0) >= 5,
  },
  {
    id: 'rat-bibliotheque',
    name: 'Rat de Bibliothèque',
    description: '5 livres résistés',
    emoji: '📚',
    category: 'category',
    check: (stats) => (stats.categoryResisted.books || 0) >= 5,
  },
  {
    id: 'papeterie-zero',
    name: 'Papeterie Zéro',
    description: '5 papeteries résistées',
    emoji: '✏️',
    category: 'category',
    check: (stats) => (stats.categoryResisted.stationery || 0) >= 5,
  },
  {
    id: 'gamer-econome',
    name: 'Gamer Économe',
    description: '5 jeux vidéo résistés',
    emoji: '🎮',
    category: 'category',
    check: (stats) => (stats.categoryResisted.videogames || 0) >= 5,
  },
  {
    id: 'minimaliste',
    name: 'Minimaliste',
    description: '5 "autres" résistés',
    emoji: '🎯',
    category: 'category',
    check: (stats) => (stats.categoryResisted.other || 0) >= 5,
  },
]

interface BadgeState {
  badges: Record<string, Badge>
  checkAndUnlock: (stats: BadgeStats) => Badge[]
  getBadgesByCategory: (category: 'milestone' | 'streak' | 'category') => Badge[]
  getAllBadges: () => Badge[]
}

// Initialize all badges as locked
function initializeBadges(): Record<string, Badge> {
  const badges: Record<string, Badge> = {}
  BADGE_DEFINITIONS.forEach((def) => {
    badges[def.id] = {
      id: def.id,
      name: def.name,
      description: def.description,
      emoji: def.emoji,
      unlockedAt: null,
    }
  })
  return badges
}

export const useBadgeStore = create<BadgeState>()(
  persist(
    (set, get) => ({
      badges: initializeBadges(),

      checkAndUnlock: (stats: BadgeStats) => {
        const { badges } = get()
        const newlyUnlocked: Badge[] = []

        BADGE_DEFINITIONS.forEach((def) => {
          const badge = badges[def.id]
          // Only check if not already unlocked
          if (!badge.unlockedAt && def.check(stats)) {
            const updatedBadge = {
              ...badge,
              unlockedAt: new Date().toISOString(),
            }
            newlyUnlocked.push(updatedBadge)
          }
        })

        if (newlyUnlocked.length > 0) {
          set((state) => {
            const updatedBadges = { ...state.badges }
            newlyUnlocked.forEach((badge) => {
              updatedBadges[badge.id] = badge
            })
            return { badges: updatedBadges }
          })
        }

        return newlyUnlocked
      },

      getBadgesByCategory: (category: 'milestone' | 'streak' | 'category') => {
        const { badges } = get()
        return BADGE_DEFINITIONS
          .filter((def) => def.category === category)
          .map((def) => badges[def.id])
      },

      getAllBadges: () => {
        const { badges } = get()
        return BADGE_DEFINITIONS.map((def) => badges[def.id])
      },
    }),
    {
      name: 'badge-storage',
      // Merge stored badges with any new badge definitions
      merge: (persisted, current) => {
        const persistedState = persisted as BadgeState | undefined
        if (!persistedState?.badges) {
          return current
        }
        // Merge: keep unlocked status from persisted, add any new badges
        const mergedBadges = initializeBadges()
        Object.keys(persistedState.badges).forEach((id) => {
          if (mergedBadges[id]) {
            mergedBadges[id] = persistedState.badges[id]
          }
        })
        return {
          ...current,
          badges: mergedBadges,
        }
      },
    }
  )
)

export { BADGE_DEFINITIONS }
