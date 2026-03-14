import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  totalGemsEarned: number
  weeksUnderBudget: number
  currentStreak: number
}

// Badge definitions adapted for the new expense/budget system
const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Milestone badges - based on gems earned (reflecting overall savings)
  {
    id: 'premiere-gemme',
    name: 'Première Gemme',
    description: '1 gemme gagnée',
    emoji: '💎',
    category: 'milestone',
    check: (stats) => stats.totalGemsEarned >= 1,
  },
  {
    id: 'econome',
    name: 'Économe',
    description: '10 gemmes gagnées',
    emoji: '💰',
    category: 'milestone',
    check: (stats) => stats.totalGemsEarned >= 10,
  },
  {
    id: 'coffre-plein',
    name: 'Coffre Plein',
    description: '50 gemmes gagnées',
    emoji: '👑',
    category: 'milestone',
    check: (stats) => stats.totalGemsEarned >= 50,
  },
  {
    id: 'fortune',
    name: 'Fortune',
    description: '100 gemmes gagnées',
    emoji: '🏆',
    category: 'milestone',
    check: (stats) => stats.totalGemsEarned >= 100,
  },
  {
    id: 'premiere-semaine',
    name: 'Première Semaine',
    description: '1 semaine sous budget',
    emoji: '🎯',
    category: 'milestone',
    check: (stats) => stats.weeksUnderBudget >= 1,
  },
  {
    id: 'veteran',
    name: 'Vétéran',
    description: '10 semaines sous budget',
    emoji: '🎖️',
    category: 'milestone',
    check: (stats) => stats.weeksUnderBudget >= 10,
  },

  // Streak badges - consecutive weeks under budget
  {
    id: 'debut-flamme',
    name: 'Début de Flamme',
    description: '2 semaines d\'affilée',
    emoji: '🔥',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 2,
  },
  {
    id: 'mois-parfait',
    name: 'Mois Parfait',
    description: '4 semaines d\'affilée',
    emoji: '⭐',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 4,
  },
  {
    id: 'deux-mois',
    name: 'Deux Mois de Fer',
    description: '8 semaines d\'affilée',
    emoji: '🌟',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 8,
  },
  {
    id: 'trimestre',
    name: 'Trimestre d\'Or',
    description: '12 semaines d\'affilée',
    emoji: '💪',
    category: 'streak',
    check: (stats) => stats.currentStreak >= 12,
  },
]

interface BadgeState {
  badges: Record<string, Badge>
  checkAndUnlock: (stats: BadgeStats) => Badge[]
  getBadgesByCategory: (category: 'milestone' | 'streak' | 'category') => Badge[]
  getAllBadges: () => Badge[]
}

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
          if (badge && !badge.unlockedAt && def.check(stats)) {
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
          .filter(Boolean)
      },

      getAllBadges: () => {
        const { badges } = get()
        return BADGE_DEFINITIONS.map((def) => badges[def.id]).filter(Boolean)
      },
    }),
    {
      name: 'badge-storage',
      merge: (persisted, current) => {
        const persistedState = persisted as BadgeState | undefined
        if (!persistedState?.badges) {
          return current
        }
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
