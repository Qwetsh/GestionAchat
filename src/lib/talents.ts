// ─── Talent Tree Configuration ──────────────────────────────
// To add a new talent: just add an entry to TALENTS below.
// The store, tree page, and effect system all read from this array.

export type TalentBranch = 'cosmetic' | 'unlock' | 'gems'

export type TalentEffect =
  | { type: 'unlock_cat'; catId: string }
  | { type: 'unlock_background'; backgroundId: string }
  | { type: 'unlock_shop_item'; itemId: string }
  | { type: 'passive_no_expense_day'; gemsPerDay: number }
  | { type: 'upgrade_weekly_savings'; gemsPerTranche: number }
  | { type: 'combo_days'; days: number; gems: number }
  | { type: 'one_time_gems'; gems: number }
  | { type: 'monthly_under_budget'; gems: number }
  | { type: 'unlock_budget_boost'; amount: number; cost: number }
  | { type: 'weekly_half_saved'; gems: number }
  | { type: 'monthly_no_expense_double' }

export interface Talent {
  id: string
  name: string
  description: string
  branch: TalentBranch
  level: number        // Required player level
  gemCost: number      // Cost in gems to purchase
  icon: string         // Emoji
  effect: TalentEffect
}

// ─── Branch metadata (for display) ─────────────────────────
export const BRANCHES: Record<TalentBranch, { name: string; emoji: string; color: string; gradient: [string, string] }> = {
  cosmetic: { name: 'Cosmétique', emoji: '🎨', color: '#F472B6', gradient: ['#F472B6', '#DB2777'] },
  unlock:   { name: 'Déblocage',  emoji: '🔓', color: '#34D399', gradient: ['#34D399', '#059669'] },
  gems:     { name: 'Rubis bonus', emoji: '💎', color: '#FBBF24', gradient: ['#FBBF24', '#D97706'] },
}

// ─── All talents ────────────────────────────────────────────
// Sorted by level. Add new talents here and everything else adapts.

export const TALENTS: Talent[] = [
  // ── Level 1 ──
  {
    id: 'cat_exclusive_1',
    name: 'Gagner un chat',
    description: 'Débloque un chat exclusif',
    branch: 'cosmetic',
    level: 1,
    gemCost: 3,
    icon: '🐱',
    effect: { type: 'unlock_cat', catId: 'talent_cat_1' },
  },
  {
    id: 'first_no_expense',
    name: 'Journée zen',
    description: '+1 rubis pour chaque jour sans achat',
    branch: 'gems',
    level: 1,
    gemCost: 3,
    icon: '🧘',
    effect: { type: 'passive_no_expense_day', gemsPerDay: 1 },
  },

  // ── Level 3 ──
  {
    id: 'weekly_half_saved',
    name: 'Économe prudent',
    description: '+2 rubis si tu finis la semaine avec 50% ou plus de budget restant',
    branch: 'gems',
    level: 3,
    gemCost: 8,
    icon: '🛡️',
    effect: { type: 'weekly_half_saved', gems: 2 },
  },

  // ── Level 7 ──
  {
    id: 'weekly_savings_upgrade',
    name: 'Épargne hebdo',
    description: '+2 rubis par tranche de 10€ économisés',
    branch: 'gems',
    level: 7,
    gemCost: 15,
    icon: '📈',
    effect: { type: 'upgrade_weekly_savings', gemsPerTranche: 2 },
  },

  // ── Level 3 ──
  {
    id: 'unlock_wheel',
    name: 'Roue de la chance',
    description: 'Débloque la roue de la fortune en boutique',
    branch: 'unlock',
    level: 3,
    gemCost: 10,
    icon: '🎰',
    effect: { type: 'unlock_shop_item', itemId: 'wheel' },
  },

  // ── Level 4 ──
  {
    id: 'bg_exclusive_1',
    name: 'Gagner un background',
    description: 'Débloque un fond exclusif',
    branch: 'cosmetic',
    level: 4,
    gemCost: 8,
    icon: '🖼️',
    effect: { type: 'unlock_background', backgroundId: 'talent_bg_1' },
  },
  {
    id: 'combo_3_days',
    name: 'Combo 3 jours',
    description: '+5 rubis pour 3 jours consécutifs sans dépense',
    branch: 'gems',
    level: 4,
    gemCost: 12,
    icon: '🔥',
    effect: { type: 'combo_days', days: 3, gems: 5 },
  },

  // ── Level 5 ──
  {
    id: 'budget_boost_1',
    name: 'Budget niveau 1',
    description: 'Débloque "+5€/semaine" en boutique pour 1 rubis',
    branch: 'unlock',
    level: 5,
    gemCost: 10,
    icon: '💰',
    effect: { type: 'unlock_budget_boost', amount: 5, cost: 1 },
  },

  // ── Level 6 ──
  {
    id: 'cat_exclusive_2',
    name: 'Gagner un chat',
    description: 'Débloque un second chat exclusif',
    branch: 'cosmetic',
    level: 6,
    gemCost: 12,
    icon: '🐱',
    effect: { type: 'unlock_cat', catId: 'talent_cat_2' },
  },
  {
    id: 'one_time_20_gems',
    name: 'Gain de 20 rubis',
    description: 'Reçois 20 rubis immédiatement',
    branch: 'gems',
    level: 6,
    gemCost: 15,
    icon: '🎁',
    effect: { type: 'one_time_gems', gems: 20 },
  },

  // ── Level 7 ──
  {
    id: 'budget_boost_2',
    name: 'Budget niveau 2',
    description: 'Débloque "+10€/semaine" en boutique pour 2 rubis',
    branch: 'unlock',
    level: 7,
    gemCost: 15,
    icon: '💰',
    effect: { type: 'unlock_budget_boost', amount: 10, cost: 2 },
  },

  // ── Level 8 ──
  {
    id: 'bg_exclusive_2',
    name: 'Gagner un background',
    description: 'Débloque un second fond exclusif',
    branch: 'cosmetic',
    level: 8,
    gemCost: 15,
    icon: '🖼️',
    effect: { type: 'unlock_background', backgroundId: 'talent_bg_2' },
  },
  {
    id: 'monthly_bonus',
    name: 'Économie du mois',
    description: '+10 rubis si sous budget tout le mois',
    branch: 'gems',
    level: 8,
    gemCost: 18,
    icon: '📅',
    effect: { type: 'monthly_under_budget', gems: 10 },
  },

  // ── Level 9 ──
  {
    id: 'budget_boost_3',
    name: 'Budget niveau 3',
    description: 'Débloque "+25€/semaine" en boutique pour 4 rubis',
    branch: 'unlock',
    level: 9,
    gemCost: 20,
    icon: '💰',
    effect: { type: 'unlock_budget_boost', amount: 25, cost: 4 },
  },

  // ── Level 10 ──
  {
    id: 'cat_exclusive_3',
    name: 'Gagner un chat',
    description: 'Débloque un chat légendaire exclusif',
    branch: 'cosmetic',
    level: 10,
    gemCost: 25,
    icon: '👑',
    effect: { type: 'unlock_cat', catId: 'talent_cat_3' },
  },
  {
    id: 'monthly_no_expense_double',
    name: 'Mois d\'acier',
    description: 'Si aucun achat du mois entier, double tes rubis',
    branch: 'gems',
    level: 10,
    gemCost: 25,
    icon: '💎',
    effect: { type: 'monthly_no_expense_double' },
  },
]

// ─── Helpers ────────────────────────────────────────────────

/** Get talents available at a given level */
export function getTalentsForLevel(level: number): Talent[] {
  return TALENTS.filter((t) => t.level === level)
}

/** Get all levels that have talents */
export function getTalentLevels(): number[] {
  return [...new Set(TALENTS.map((t) => t.level))].sort((a, b) => a - b)
}

/** Get a talent by id */
export function getTalentById(id: string): Talent | undefined {
  return TALENTS.find((t) => t.id === id)
}

/** Get all budget boosts from purchased talents */
export function getUnlockedBudgetBoosts(purchasedIds: string[]): Array<{ amount: number; cost: number }> {
  return TALENTS
    .filter((t) => purchasedIds.includes(t.id) && t.effect.type === 'unlock_budget_boost')
    .map((t) => {
      const e = t.effect as { type: 'unlock_budget_boost'; amount: number; cost: number }
      return { amount: e.amount, cost: e.cost }
    })
}
