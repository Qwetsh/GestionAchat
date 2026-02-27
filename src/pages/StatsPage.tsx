import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  getAllTemptations,
  getStats,
  type Temptation,
} from '@/features/temptation/temptationService'
import { useGamificationStore, getLevelTitle } from '@/stores/gamificationStore'
import { useBadgeStore, type Badge } from '@/stores/badgeStore'
import { ArrowLeft } from 'lucide-react'

interface MonthlyStats {
  month: string
  monthKey: string
  resisted: number
  cracked: number
  savedAmount: number
  crackedAmount: number
  total: number
}

export function StatsPage() {
  const navigate = useNavigate()
  const { xp, level, bestStreak, currentStreak, getLevelProgress, getNextLevelXP } = useGamificationStore()
  const { getBadgesByCategory } = useBadgeStore()
  const temptations = useMemo(() => getAllTemptations(), [])
  const stats = useMemo(() => getStats(), [])

  // Get badges by category
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

  // Group temptations by month
  const monthlyStats = useMemo(() => {
    const grouped: Record<string, Temptation[]> = {}

    temptations.forEach((t) => {
      const date = new Date(t.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(t)
    })

    const result: MonthlyStats[] = Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, items]) => {
        const resisted = items.filter((t) => t.status === 'resisted')
        const cracked = items.filter((t) => t.status === 'cracked')
        const date = new Date(key + '-01')
        const monthName = date.toLocaleDateString('fr-FR', {
          month: 'long',
          year: 'numeric',
        })

        return {
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          monthKey: key,
          resisted: resisted.length,
          cracked: cracked.length,
          savedAmount: resisted.reduce((sum, t) => sum + t.amount, 0),
          crackedAmount: cracked.reduce((sum, t) => sum + t.amount, 0),
          total: items.length,
        }
      })

    return result
  }, [temptations])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const successRate = stats.resistedCount + stats.crackedCount > 0
    ? Math.round((stats.resistedCount / (stats.resistedCount + stats.crackedCount)) * 100)
    : 0

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

          {/* XP Progress */}
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
            <p className="text-3xl font-light text-primary">{successRate}%</p>
            <p className="text-xs text-muted mt-1">reussite</p>
          </div>
          <div className="text-center border-x border-muted/10">
            <p className="text-3xl font-light text-text">{currentStreak}</p>
            <p className="text-xs text-muted mt-1">streak 🔥</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-light text-primary">{bestStreak}</p>
            <p className="text-xs text-muted mt-1">record</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-muted/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted">Economise</span>
            <span className="text-2xl font-light text-success">{formatAmount(stats.totalSaved)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted">Depense</span>
            <span className="text-xl font-light text-warning">{formatAmount(stats.totalCracked)}</span>
          </div>
          <div className="border-t border-muted/10 pt-4 flex justify-between items-baseline">
            <span className="text-sm font-medium">Bilan</span>
            <span className={`text-2xl font-light ${
              stats.totalSaved - stats.totalCracked >= 0 ? 'text-success' : 'text-warning'
            }`}>
              {stats.totalSaved - stats.totalCracked >= 0 ? '+' : ''}{formatAmount(stats.totalSaved - stats.totalCracked)}
            </span>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div>
          <h3 className="text-sm text-muted mb-4">Par mois</h3>

          {monthlyStats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">📊</p>
              <p className="text-muted">Pas encore de donnees</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyStats.map((month) => (
                <div key={month.monthKey} className="bg-surface rounded-xl p-4 border border-muted/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-xs text-muted">{month.total} tentation{month.total > 1 ? 's' : ''}</span>
                  </div>

                  {/* Mini progress bar */}
                  <div className="h-1.5 bg-muted/10 rounded-full overflow-hidden mb-3">
                    <div className="h-full flex">
                      <div
                        className="bg-success rounded-l-full"
                        style={{ width: `${month.total > 0 ? (month.resisted / month.total) * 100 : 0}%` }}
                      />
                      <div
                        className="bg-warning rounded-r-full"
                        style={{ width: `${month.total > 0 ? (month.cracked / month.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted">{month.resisted}</span>
                      <span className="text-success font-medium">{formatAmount(month.savedAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-muted">{month.cracked}</span>
                      <span className="text-warning font-medium">{formatAmount(month.crackedAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges Section */}
        <div className="space-y-6">
          <h3 className="text-sm text-muted">Badges</h3>

          {/* Milestone Badges */}
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

          {/* Streak Badges */}
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

          {/* Category Badges */}
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
