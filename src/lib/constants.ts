// Categories for temptations
export const CATEGORIES = ['cosmetics', 'books', 'stationery', 'other'] as const
export type Category = typeof CATEGORIES[number]

// Status for temptations
export const STATUSES = ['active', 'resisted', 'cracked'] as const
export type Status = typeof STATUSES[number]

// XP rewards
export const XP_REWARDS = {
  RESIST_TEMPTATION: 50,
  DAILY_LOGIN: 10,
  STREAK_BONUS: (streak: number) => streak * 5,
} as const

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  1000,  // Level 5
  2000,  // Level 6
  4000,  // Level 7
  8000,  // Level 8
  16000, // Level 9
  32000, // Level 10
] as const

// Calculate level from XP
export function calculateLevel(xp: number): number {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
      break
    }
  }
  return level
}
