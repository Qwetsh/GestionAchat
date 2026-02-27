import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TemptationCard } from '@/components/TemptationCard'
import {
  getAllTemptations,
  getStats,
} from '@/features/temptation/temptationService'
import { ArrowLeft, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'active' | 'resisted' | 'cracked'

const FILTERS: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'Tout', icon: null },
  { value: 'active', label: 'En cours', icon: <Clock className="h-4 w-4" /> },
  { value: 'resisted', label: 'Resistees', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'cracked', label: 'Craquees', icon: <TrendingDown className="h-4 w-4" /> },
]

export function HistoryPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterType>('all')

  const temptations = useMemo(() => getAllTemptations(), [])
  const stats = useMemo(() => getStats(), [])

  const filteredTemptations = useMemo(() => {
    if (filter === 'all') return temptations
    return temptations.filter((t) => {
      if (filter === 'active') return t.status === 'active'
      if (filter === 'resisted') return t.status === 'resisted'
      if (filter === 'cracked') return t.status === 'cracked'
      return true
    })
  }, [temptations, filter])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold">Historique</h1>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-success">
                {stats.resistedCount}
              </p>
              <p className="text-xs text-muted">Resistees</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-warning">
                {stats.crackedCount}
              </p>
              <p className="text-xs text-muted">Craquees</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">
                {stats.activeCount}
              </p>
              <p className="text-xs text-muted">En cours</p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted">Total economise</p>
                <p className="text-2xl font-bold text-success">
                  {formatAmount(stats.totalSaved)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted">Total depense</p>
                <p className="text-xl font-bold text-warning">
                  {formatAmount(stats.totalCracked)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex-shrink-0',
                filter === f.value && 'bg-primary text-white'
              )}
            >
              {f.icon}
              <span className={f.icon ? 'ml-1' : ''}>{f.label}</span>
            </Button>
          ))}
        </div>

        {/* Temptations List */}
        {filteredTemptations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-muted">Aucune tentation trouvee</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTemptations.map((temptation) => (
              <TemptationCard
                key={temptation.id}
                temptation={temptation}
                compact
              />
            ))}
          </div>
        )}

        {/* Success Rate */}
        {temptations.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted mb-2">Taux de reussite</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all"
                    style={{
                      width: `${
                        temptations.length > 0
                          ? (stats.resistedCount /
                              (stats.resistedCount + stats.crackedCount || 1)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-success">
                  {temptations.length > 0
                    ? Math.round(
                        (stats.resistedCount /
                          (stats.resistedCount + stats.crackedCount || 1)) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
