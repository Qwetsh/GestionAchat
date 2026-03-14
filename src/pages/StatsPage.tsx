import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useGamificationStore, getLevelTitle } from '@/stores/gamificationStore'
import { useBadgeStore, type Badge } from '@/stores/badgeStore'
import { useExpenseStore } from '@/stores/expenseStore'
import { useRevenueStore } from '@/stores/revenueStore'
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_EMOJIS,
  REVENUE_SOURCE_LABELS,
  REVENUE_SOURCE_EMOJIS,
  type ExpenseCategory,
  type RevenueSource,
} from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'

export function StatsPage() {
  const navigate = useNavigate()
  const { xp, level, bestStreak, currentStreak, getLevelProgress, getNextLevelXP } = useGamificationStore()
  const { getBadgesByCategory } = useBadgeStore()

  const {
    getTotalForWeek,
    getTotalForMonth,
    getTotalForYear,
    getTotalAllTime,
    getTotalForSelf,
    getTotalForOthers,
    getExpensesForMonth,
    getCategoryBreakdown,
  } = useExpenseStore()

  const {
    getTotalForMonth: revMonthTotal,
    getTotalForYear: revYearTotal,
    getTotalAllTime: revAllTime,
    getRevenuesForMonth,
    getBySource,
  } = useRevenueStore()

  // Memoize stats
  const expenseStats = useMemo(() => ({
    week: getTotalForWeek(),
    month: getTotalForMonth(),
    year: getTotalForYear(),
    allTime: getTotalAllTime(),
    forSelf: getTotalForSelf(),
    forOthers: getTotalForOthers(),
  }), [getTotalForWeek, getTotalForMonth, getTotalForYear, getTotalAllTime, getTotalForSelf, getTotalForOthers])

  const revenueStats = useMemo(() => ({
    month: revMonthTotal(),
    year: revYearTotal(),
    allTime: revAllTime(),
  }), [revMonthTotal, revYearTotal, revAllTime])

  const monthCategoryBreakdown = useMemo(() => {
    const expenses = getExpensesForMonth()
    return getCategoryBreakdown(expenses)
  }, [getExpensesForMonth, getCategoryBreakdown])

  const monthRevenueBySource = useMemo(() => {
    const revenues = getRevenuesForMonth()
    return getBySource(revenues)
  }, [getRevenuesForMonth, getBySource])

  const milestoneBadges = getBadgesByCategory('milestone')
  const streakBadges = getBadgesByCategory('streak')
  const categoryBadges = getBadgesByCategory('category')

  const formatBadgeDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const BadgeItem = ({ badge }: { badge: Badge }) => {
    const isUnlocked = badge.unlockedAt !== null
    return (
      <div
        className={`relative flex flex-col items-center p-3 rounded-xl border transition-all ${
          isUnlocked
            ? 'bg-primary/5 border-primary/20'
            : 'bg-muted/5 border-muted/10 opacity-40 grayscale'
        }`}
        title={isUnlocked ? `Débloqué le ${formatBadgeDate(badge.unlockedAt!)}` : 'Non débloqué'}
      >
        <span className="text-2xl mb-1">{badge.emoji}</span>
        <span className="text-xs text-center font-medium text-text truncate w-full">
          {badge.name}
        </span>
        <span className="text-[10px] text-muted text-center">
          {badge.description}
        </span>
        {isUnlocked && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white">✓</span>
          </span>
        )}
      </div>
    )
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const sortedCategories = Object.entries(monthCategoryBreakdown)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)

  const sortedSources = Object.entries(monthRevenueBySource)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header - Mobile only */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-muted/20 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted hover:text-text" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-light">Statistiques</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-muted/10 px-8 py-6">
        <h1 className="text-2xl font-light text-text">Statistiques</h1>
        <p className="text-muted mt-1">Ton parcours en chiffres</p>
      </div>

      <div className="p-4 lg:p-8 space-y-8 max-w-md lg:max-w-none mx-auto">
        {/* Level Hero */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-sm text-muted mb-1">Niveau {level}</p>
          <p className="text-2xl font-light text-text mb-4">{getLevelTitle(level)}</p>

          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted mb-2">
              <span>{xp} XP</span>
              <span>{getNextLevelXP()} XP</span>
            </div>
            <div className="h-2 bg-muted/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-deep rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress() * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-light text-text">{currentStreak}</p>
            <p className="text-xs text-muted mt-1">semaines 🔥</p>
          </div>
          <div className="text-center border-x border-muted/10">
            <p className="text-3xl font-light text-primary">{bestStreak}</p>
            <p className="text-xs text-muted mt-1">record</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-light text-text">{xp}</p>
            <p className="text-xs text-muted mt-1">XP total</p>
          </div>
        </div>

        {/* Expense Summary */}
        <div className="bg-muted/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm text-muted font-medium">Dépenses</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Cette semaine</p>
              <p className="text-xl font-light text-text">{formatAmount(expenseStats.week)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Ce mois</p>
              <p className="text-xl font-light text-text">{formatAmount(expenseStats.month)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Cette année</p>
              <p className="text-xl font-light text-text">{formatAmount(expenseStats.year)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Depuis le début</p>
              <p className="text-xl font-light text-text">{formatAmount(expenseStats.allTime)}</p>
            </div>
          </div>

          {/* For self vs for others */}
          <div className="border-t border-muted/10 pt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Pour moi</p>
              <p className="text-lg font-light text-primary">{formatAmount(expenseStats.forSelf)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Pour quelqu'un</p>
              <p className="text-lg font-light text-accent">{formatAmount(expenseStats.forOthers)}</p>
            </div>
          </div>
        </div>

        {/* Monthly Category Breakdown */}
        {sortedCategories.length > 0 && (
          <div className="bg-muted/5 rounded-2xl p-6">
            <h3 className="text-sm text-muted font-medium mb-4">Dépenses du mois par catégorie</h3>
            <div className="space-y-3">
              {sortedCategories.map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{EXPENSE_CATEGORY_EMOJIS[cat as ExpenseCategory]}</span>
                    <span className="text-sm text-text">{EXPENSE_CATEGORY_LABELS[cat as ExpenseCategory]}</span>
                  </div>
                  <span className="text-sm font-medium text-text">{formatAmount(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Summary */}
        <div className="bg-emerald-500/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm text-emerald-400 font-medium">Revenus</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted">Ce mois</p>
              <p className="text-xl font-light text-emerald-400">{formatAmount(revenueStats.month)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Cette année</p>
              <p className="text-xl font-light text-emerald-400">{formatAmount(revenueStats.year)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Depuis le début</p>
              <p className="text-xl font-light text-emerald-400">{formatAmount(revenueStats.allTime)}</p>
            </div>
          </div>

          {/* Revenue by source */}
          {sortedSources.length > 0 && (
            <div className="border-t border-emerald-500/10 pt-4 space-y-3">
              <p className="text-xs text-muted">Ce mois par source</p>
              {sortedSources.map(([src, amount]) => (
                <div key={src} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{REVENUE_SOURCE_EMOJIS[src as RevenueSource]}</span>
                    <span className="text-sm text-text">{REVENUE_SOURCE_LABELS[src as RevenueSource]}</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">{formatAmount(amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges Section */}
        <div className="space-y-6">
          <h3 className="text-sm text-muted">Badges</h3>

          <div>
            <p className="text-xs text-muted mb-3 flex items-center gap-2">
              <span>🏆</span> Jalons
            </p>
            <div className="grid grid-cols-3 gap-2">
              {milestoneBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted mb-3 flex items-center gap-2">
              <span>🔥</span> Streaks
            </p>
            <div className="grid grid-cols-4 gap-2">
              {streakBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted mb-3 flex items-center gap-2">
              <span>🎯</span> Catégories
            </p>
            <div className="grid grid-cols-4 gap-2">
              {categoryBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
