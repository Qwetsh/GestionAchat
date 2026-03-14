import { useNavigate } from 'react-router-dom'
import { useGamificationStore } from '@/stores/gamificationStore'
import { useExpenseStore } from '@/stores/expenseStore'
import { useBudgetStore } from '@/stores/budgetStore'
import { useGemStore } from '@/stores/gemStore'
import { useMascotStore } from '@/stores/mascotStore'


import { Menu, Gem } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopStatsBarProps {
  onMenuOpen: () => void
}

export function TopStatsBar({ onMenuOpen }: TopStatsBarProps) {
  const navigate = useNavigate()
  const { level, currentStreak, getLevelProgress } = useGamificationStore()
  const { getTotalForWeek } = useExpenseStore()
  const { getEffectiveBudget } = useBudgetStore()
  const { getAvailableGems } = useGemStore()

  const weeklySpent = getTotalForWeek()
  const effectiveBudget = getEffectiveBudget()
  const weeklyRemaining = effectiveBudget - weeklySpent
  const { getSelectedBackground } = useMascotStore()
  const theme = getSelectedBackground().theme

  const weeklyProgress = Math.min((weeklySpent / effectiveBudget) * 100, 100)

  const gems = getAvailableGems()
  const levelProgress = getLevelProgress() * 100

  const formatCompact = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-30">
      <div className="backdrop-blur-xl border-b border-white/10" style={{ background: theme.topBarBg }}>
        {/* Line 1: Stats */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1">
          {/* Hamburger */}
          <button
            onClick={onMenuOpen}
            className="p-2 -ml-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>

          {/* Budget */}
          <div className="text-center flex-1 mx-2">
            <span className={cn(
              'text-sm font-bold',
              weeklyRemaining < 0 ? 'text-red-400' : 'text-white'
            )}>
              {formatCompact(weeklyRemaining)}
            </span>
            <span className="text-white/50 text-xs"> / {formatCompact(effectiveBudget)}</span>
          </div>

          {/* Level + streak + XP mini bar */}
          <div className="flex items-center gap-1.5">
            {currentStreak > 0 && (
              <span className="text-xs font-medium text-amber-400">{currentStreak}🔥</span>
            )}
            <button
              onClick={() => navigate('/talents')}
              className="flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
            >
              <span className="text-[10px] font-semibold text-white leading-none">Niv.{level}</span>
              {/* Mini XP bar */}
              <div className="w-10 h-[3px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-primary rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </button>
          </div>

          {/* Gems */}
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-1 ml-2 px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
          >
            <Gem className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{gems}</span>
          </button>
        </div>

        {/* Line 2: Weekly budget bar */}
        <div className="flex items-center gap-2 px-4 pb-2">
          <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                weeklyRemaining < 0
                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                  : weeklyProgress > 75
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              )}
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
          <span className={cn(
            'text-[10px] font-medium whitespace-nowrap',
            weeklyRemaining < 0 ? 'text-red-400' : 'text-white/50'
          )}>
            {formatCompact(weeklyRemaining)} restants
          </span>
        </div>
      </div>
    </div>
  )
}
