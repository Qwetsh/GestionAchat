// Categories for temptations
export const CATEGORIES = ['cosmetics', 'books', 'stationery', 'videogames', 'other'] as const
export type Category = typeof CATEGORIES[number]

// Status for temptations
export const STATUSES = ['active', 'resisted', 'cracked'] as const
export type Status = typeof STATUSES[number]

// XP rewards
export const XP_REWARDS = {
  RESIST_TEMPTATION: 50,
  CREATE_TEMPTATION: 15,
  CONSCIOUS_CRACK: 5,
  DAILY_LOGIN: 10,
  STREAK_BONUS: (streak: number) => streak * 5,
} as const

// Level thresholds (XP cumulatif par niveau)
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
] as const

// Titres de niveau
export const LEVEL_TITLES = [
  'Débutante',        // 1
  'Apprentie',        // 2
  'Résistante',       // 3
  'Guerrière',        // 4
  'Championne',       // 5
  'Maîtresse',        // 6
  'Experte',          // 7
  'Légende',          // 8
  'Mythique',         // 9
  'Transcendante',    // 10
] as const

// Calculate level from XP
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

// Get level title
export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
}
