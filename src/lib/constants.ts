// Budget configuration
export const WEEKLY_BUDGET = 100 // €, hardcoded (modifiable via XP later)
export const GEMS_PER_10_SAVED = 1 // 1 gem per 10€ not spent
export const WEEKLY_RESET_HOUR = 7 // Monday 7:00 AM
export const WEEKLY_RESET_DAY = 1 // Monday (0=Sunday, 1=Monday)

// Categories for expenses
export const EXPENSE_CATEGORIES = ['shopping', 'books', 'restaurant', 'cosmetics', 'stationery', 'videogames', 'other'] as const
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  shopping: 'Courses / Magasin',
  books: 'Livres',
  restaurant: 'Restaurant',
  cosmetics: 'Cosmétique',
  stationery: 'Feutres / Coloriage',
  videogames: 'Jeux vidéo',
  other: 'Autre',
}

export const EXPENSE_CATEGORY_EMOJIS: Record<ExpenseCategory, string> = {
  shopping: '🛒',
  books: '📚',
  restaurant: '🍽️',
  cosmetics: '💄',
  stationery: '🖍️',
  videogames: '🎮',
  other: '🛍️',
}

// Revenue sources
export const REVENUE_SOURCES = ['salary', 'birthday', 'gift', 'bonus', 'other'] as const
export type RevenueSource = typeof REVENUE_SOURCES[number]

export const REVENUE_SOURCE_LABELS: Record<RevenueSource, string> = {
  salary: 'Salaire',
  birthday: 'Anniversaire',
  gift: 'Cadeau',
  bonus: 'Prime',
  other: 'Autre',
}

export const REVENUE_SOURCE_EMOJIS: Record<RevenueSource, string> = {
  salary: '💼',
  birthday: '🎂',
  gift: '🎁',
  bonus: '🏆',
  other: '💵',
}

// XP rewards
export const XP_REWARDS = {
  WEEK_UNDER_BUDGET: 50,
  ADD_EXPENSE: 5,
  DAILY_LOGIN: 10,
  STREAK_BONUS: (streak: number) => streak * 20,
} as const

// Level thresholds (cumulative XP per level)
// Target: level 10 in ~12 months without streak, ~8-9 months with streak
// Base ~100 XP/week (50 under budget + ~10 expenses × 5 XP)
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  50,     // Level 2  — ~1 semaine
  150,    // Level 3  — ~2-3 semaines
  350,    // Level 4  — ~1 mois
  650,    // Level 5  — ~1.5 mois
  1100,   // Level 6  — ~2.5 mois
  1700,   // Level 7  — ~4 mois
  2500,   // Level 8  — ~6 mois
  3500,   // Level 9  — ~8-9 mois
  5000,   // Level 10 — ~12 mois
] as const

// Level titles
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

// Week utilities
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  // Monday = 1, so we need to go back (day - 1) days, but handle Sunday (0) as 6
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  d.setHours(WEEKLY_RESET_HOUR, 0, 0, 0)
  return d
}

export function getWeekId(date: Date = new Date()): string {
  const start = getWeekStart(date)
  return start.toISOString().split('T')[0] // e.g. "2026-03-09"
}

export function getMonthId(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getYearId(date: Date = new Date()): string {
  return String(date.getFullYear())
}
