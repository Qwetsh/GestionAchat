import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  getAllTemptations,
  getStats,
  type Temptation,
} from '@/features/temptation/temptationService'
import { useGamificationStore, getLevelTitle } from '@/stores/gamificationStore'
import { ArrowLeft, TrendingUp, TrendingDown, Award, Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

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
  const { xp, level, bestStreak, getLevelProgress, getNextLevelXP } = useGamificationStore()
  const temptations = useMemo(() => getAllTemptations(), [])
  const stats = useMemo(() => getStats(), [])

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

  const getSuccessRate = (resisted: number, cracked: number) => {
    const total = resisted + cracked
    if (total === 0) return 0
    return Math.round((resisted / total) * 100)
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold">Statistiques</h1>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Overall Performance */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">Niveau {level}</p>
                <p className="font-bold text-lg">{getLevelTitle(level)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{xp} XP</span>
                <span className="text-muted">{getNextLevelXP()} XP</span>
              </div>
              <Progress value={getLevelProgress() * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-success mx-auto mb-2" />
              <p className="text-3xl font-bold text-success">
                {getSuccessRate(stats.resistedCount, stats.crackedCount)}%
              </p>
              <p className="text-xs text-muted">Taux de reussite</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl mb-1">🔥</p>
              <p className="text-2xl font-bold text-primary">{bestStreak}</p>
              <p className="text-xs text-muted">Meilleur streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Total Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-3">Resume global</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm">Total economise</span>
                </div>
                <span className="font-bold text-success">
                  {formatAmount(stats.totalSaved)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-warning" />
                  <span className="text-sm">Total depense</span>
                </div>
                <span className="font-bold text-warning">
                  {formatAmount(stats.totalCracked)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-sm font-medium">Bilan net</span>
                <span
                  className={`font-bold ${
                    stats.totalSaved - stats.totalCracked >= 0
                      ? 'text-success'
                      : 'text-warning'
                  }`}
                >
                  {formatAmount(stats.totalSaved - stats.totalCracked)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <div>
          <h3 className="font-bold mb-3">Par mois</h3>
          {monthlyStats.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-muted">Pas encore de donnees</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {monthlyStats.map((month) => (
                <Card key={month.monthKey}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{month.month}</h4>
                      <span className="text-xs px-2 py-1 bg-muted/30 rounded-full">
                        {month.total} tentation{month.total > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-3">
                      <div className="h-full flex">
                        <div
                          className="bg-success"
                          style={{
                            width: `${
                              month.total > 0
                                ? (month.resisted / month.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                        <div
                          className="bg-warning"
                          style={{
                            width: `${
                              month.total > 0
                                ? (month.cracked / month.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-success">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span>{month.resisted} resistees</span>
                        </div>
                        <p className="text-xs text-muted ml-3">
                          {formatAmount(month.savedAmount)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-warning">
                          <div className="w-2 h-2 rounded-full bg-warning" />
                          <span>{month.cracked} craquees</span>
                        </div>
                        <p className="text-xs text-muted ml-3">
                          {formatAmount(month.crackedAmount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
