import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { TemptationCard } from '@/components/TemptationCard'
import {
  getAllTemptations,
  getStats,
} from '@/features/temptation/temptationService'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'active' | 'resisted' | 'cracked'

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'active', label: 'En cours' },
  { value: 'resisted', label: 'Resistees' },
  { value: 'cracked', label: 'Craquees' },
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
        <h1 className="text-lg font-light">Historique</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-muted/10 px-8 py-6">
        <h1 className="text-2xl font-light text-text">Historique</h1>
        <p className="text-muted mt-1">Toutes tes tentations passées</p>
      </div>

      <div className="p-4 lg:p-8 space-y-6 max-w-md lg:max-w-none mx-auto">
        {/* Hero Stats */}
        <div className="text-center py-6">
          <p className="text-sm text-muted mb-2">Total economise</p>
          <p className="text-5xl font-light text-primary mb-4">
            {formatAmount(stats.totalSaved)}
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <span className="text-2xl font-light text-success">{stats.resistedCount}</span>
              <p className="text-muted">resistees</p>
            </div>
            <div className="w-px bg-muted/20" />
            <div>
              <span className="text-2xl font-light text-warning">{stats.crackedCount}</span>
              <p className="text-muted">craquees</p>
            </div>
            <div className="w-px bg-muted/20" />
            <div>
              <span className="text-2xl font-light text-primary">{stats.activeCount}</span>
              <p className="text-muted">en cours</p>
            </div>
          </div>
        </div>

        {/* Success Rate Bar */}
        {(stats.resistedCount + stats.crackedCount) > 0 && (
          <div className="px-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Taux de reussite</span>
              <span className="font-medium text-primary">{successRate}%</span>
            </div>
            <div className="h-2 bg-muted/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-deep rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto py-1 -mx-4 px-4 lg:mx-0 lg:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
                filter === f.value
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-muted/10 text-muted hover:bg-muted/20'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Temptations List */}
        {filteredTemptations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🌸</p>
            <p className="text-muted">Aucune tentation</p>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
            {filteredTemptations.map((temptation) => (
              <TemptationCard
                key={temptation.id}
                temptation={temptation}
                compact
              />
            ))}
          </div>
        )}

        {/* Cracked total (if any) */}
        {stats.crackedCount > 0 && (
          <p className="text-center text-sm text-muted">
            Depense totale: <span className="text-warning">{formatAmount(stats.totalCracked)}</span>
          </p>
        )}
      </div>
    </div>
  )
}
