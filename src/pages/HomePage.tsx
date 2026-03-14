import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { useExpenseStore } from '@/stores/expenseStore'
import { useGemStore } from '@/stores/gemStore'
import { useBudgetStore } from '@/stores/budgetStore'
import {
  XP_REWARDS,
  getWeekId,
} from '@/lib/constants'
import { CatMascot } from '@/components/CatMascot'
import { ImmersiveBackground } from '@/components/ImmersiveBackground'
import { TopStatsBar } from '@/components/TopStatsBar'
import { GameButton } from '@/components/GameButton'
import { ExpenseSheet } from '@/components/ExpenseSheet'
import { MascotPicker } from '@/components/MascotPicker'
import { LevelUpModal } from '@/components/LevelUpModal'
import { useMascotStore } from '@/stores/mascotStore'
import { useNotifications } from '@/hooks/useNotifications'
import {
  notifyWeeklyGemsEarned,
  notifyWeeklyOverBudget,
} from '@/features/notifications/notificationService'
import { toast } from 'sonner'
import { Wallet, BarChart3, PiggyBank, Receipt, ShoppingBag, TrendingUp, Cat, LogOut, Sparkles } from 'lucide-react'
// GameButton only used for the main CTA now; secondary actions moved to menu
import { celebrateBadge, celebrateLevelUp } from '@/lib/confetti'
import { cn } from '@/lib/utils'
import { getMascotPhrase, type MascotContext } from '@/lib/mascotPhrases'
import type { Expense } from '@/types'
import type { ExpenseCategory } from '@/lib/constants'

export function HomePage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { level, currentStreak, addXP, incrementStreak } = useGamificationStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mascotPickerOpen, setMascotPickerOpen] = useState(false)
  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null)
  const { isSupported: notifSupported, permissionStatus, askPermission, hasAskedPermission } = useNotifications()
  const { getExpensesForWeek, getTotalForWeek, getTotalForMonth, getTotalForSelf, getTotalForOthers, getCategoryBreakdown } = useExpenseStore()
  const { addGems, getAvailableGems } = useGemStore()
  const { processWeekEnd, getEffectiveBudget } = useBudgetStore()
  const { getSelectedBackground } = useMascotStore()
  const theme = getSelectedBackground().theme

  const prevLevelRef = useRef(level)

  // Detect level up
  useEffect(() => {
    if (level > prevLevelRef.current) {
      celebrateLevelUp()
      setLevelUpLevel(level)
    }
    prevLevelRef.current = level
  }, [level])

  // Weekly reset check on mount
  useEffect(() => {
    const prevWeekDate = new Date()
    prevWeekDate.setDate(prevWeekDate.getDate() - 7)
    const prevWeekId = getWeekId(prevWeekDate)
    const prevWeekExpenses = getExpensesForWeek(prevWeekId)
    const prevWeekTotal = prevWeekExpenses.reduce((sum: number, e: Expense) => sum + e.amount, 0)

    const result = processWeekEnd(prevWeekTotal)
    if (result) {
      const { gemsEarned, summary } = result
      if (gemsEarned > 0) {
        addGems(gemsEarned)
        incrementStreak(summary.weekId)

        // XP: base + streak bonus
        const streakBonus = XP_REWARDS.STREAK_BONUS(currentStreak + 1)
        const totalXP = XP_REWARDS.WEEK_UNDER_BUDGET + streakBonus
        addXP(totalXP)

        celebrateBadge()
        toast.success(`Semaine réussie ! +${gemsEarned} rubis`, {
          description: `${summary.remaining.toFixed(2)} € économisés · +${totalXP} XP${streakBonus > 0 ? ` (dont ${streakBonus} streak)` : ''}`,
          duration: 5000,
        })
        notifyWeeklyGemsEarned(gemsEarned, summary.remaining)
      } else {
        toast('Budget dépassé la semaine dernière', {
          description: `${Math.abs(summary.remaining).toFixed(2)} € de dépassement`,
          duration: 4000,
        })
        notifyWeeklyOverBudget(Math.abs(summary.remaining))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Build mascot context for phrase generation
  const weekExpenses = getExpensesForWeek()
  const weeklyBudget = getEffectiveBudget()
  const weeklySpent = getTotalForWeek()
  const categoryBreakdown = getCategoryBreakdown(weekExpenses)
  const topCategory = Object.entries(categoryBreakdown)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)[0]?.[0] as ExpenseCategory | undefined

  // Rotate phrase: visible 10s, hidden 50s, repeat
  const [phraseTick, setPhraseTick] = useState(0)
  const [phraseVisible, setPhraseVisible] = useState(true)
  useEffect(() => {
    // Show for 10s, then hide
    setPhraseVisible(true)
    const hideTimer = setTimeout(() => setPhraseVisible(false), 10_000)
    // After 60s total, new phrase
    const nextTimer = setTimeout(() => setPhraseTick((t) => t + 1), 60_000)
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer) }
  }, [phraseTick])

  const mascotPhrase = useMemo(() => {
    const ctx: MascotContext = {
      hour: new Date().getHours(),
      weeklyRemaining: weeklyBudget - weeklySpent,
      weeklyBudget,
      weeklySpent,
      monthlySpent: getTotalForMonth(),
      expenseCount: weekExpenses.length,
      topCategory: topCategory ?? null,
      totalForSelf: getTotalForSelf(),
      totalForOthers: getTotalForOthers(),
      currentStreak,
      level,
      gems: getAvailableGems(),
    }
    return getMascotPhrase(ctx)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklySpent, weekExpenses.length, currentStreak, level, phraseTick])

  const menuItems = [
    { label: 'Arbre de talents', icon: Sparkles, action: () => navigate('/talents'), color: 'text-yellow-400' },
    { label: 'Statistiques', icon: BarChart3, action: () => navigate('/stats'), color: 'text-blue-400' },
    { label: 'Budget & dépenses fixes', icon: PiggyBank, action: () => navigate('/budget'), color: 'text-amber-400' },
    { label: 'Nouveau revenu', icon: TrendingUp, action: () => navigate('/new-revenue'), color: 'text-emerald-400' },
    { label: 'Changer de mascotte', icon: Cat, action: () => setMascotPickerOpen(true), color: 'text-purple-400' },
    { label: 'Déconnexion', icon: LogOut, action: () => { logout(); navigate('/login') }, color: 'text-red-400' },
  ]

  return (
    <ImmersiveBackground>
      {/* Top Stats Bar */}
      <TopStatsBar onMenuOpen={() => setMenuOpen(true)} />

      {/* Menu Overlay */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-14 left-3 right-3 max-w-xs bg-[#1A1425]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-50">
            {menuItems.map((item, i) => {
              const Icon = item.icon
              return (
                <button
                  key={i}
                  onClick={() => { item.action(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <Icon className={cn('h-5 w-5', item.color)} />
                  <span className="text-sm text-white font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Notification Banner */}
      {notifSupported && permissionStatus === 'default' && !hasAskedPermission && (
        <div className="pt-20 px-5">
          <button
            onClick={askPermission}
            className="w-full p-3 bg-black/30 backdrop-blur-sm rounded-xl flex items-center gap-3 border border-white/10"
          >
            <span className="text-lg">🔔</span>
            <div className="text-left flex-1">
              <p className="text-xs font-medium text-white">Activer les notifications</p>
              <p className="text-[10px] text-white/50">Pour le bilan hebdomadaire</p>
            </div>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center pt-20 pb-6 px-5">
        {/* Action Buttons - right after top bar */}
        <div className="w-full max-w-sm mt-2 space-y-2.5">
          <GameButton
            onClick={() => navigate('/new')}
            icon={<Wallet className="h-6 w-6" />}
            label="Nouvelle dépense"
            colors={theme.btnPrimary}
            decoration={theme.decoration}
            size="full"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <GameButton
              onClick={() => navigate('/shop')}
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Boutique"
              colors={theme.btnShop}
              decoration={theme.decoration}
              size="half"
            />
            <GameButton
              onClick={() => setExpenseSheetOpen(true)}
              icon={<Receipt className="h-5 w-5" />}
              label="Dépenses"
              colors={theme.btnExpenses}
              decoration={theme.decoration}
              size="half"
            />
          </div>
        </div>

        {/* Speech bubble */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs">
          <div className={`speech-bubble relative overflow-hidden rounded-2xl px-5 py-3.5 border border-white/25 shadow-lg transition-opacity duration-500 ${phraseVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: `linear-gradient(135deg, ${theme.bubbleBg} 0%, rgba(255,255,255,0.08) 100%)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <p className="relative z-10 text-sm text-white text-center leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {mascotPhrase}
            </p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-r border-b border-white/25"
              style={{ background: theme.bubbleBg }}
            />
          </div>
        </div>

        {/* Mascot Zone - sits at the bottom */}
        <div className="flex items-end justify-center pb-4 mt-3">
          <CatMascot size="hero" showBackground={false} />
        </div>
      </div>

      {/* Expense Sheet */}
      <ExpenseSheet open={expenseSheetOpen} onClose={() => setExpenseSheetOpen(false)} />

      {/* Mascot Picker Overlay */}
      <MascotPicker open={mascotPickerOpen} onClose={() => setMascotPickerOpen(false)} />

      {/* DEV: Test level-up modal */}
      {import.meta.env.DEV && (
        <button
          onClick={() => setLevelUpLevel(level + 1)}
          className="fixed bottom-4 right-4 z-50 px-3 py-1.5 text-xs bg-red-500/80 text-white rounded-lg"
        >
          Test LevelUp
        </button>
      )}

      {/* Level Up Modal */}
      <LevelUpModal
        level={levelUpLevel ?? level}
        open={levelUpLevel !== null}
        onClose={() => setLevelUpLevel(null)}
      />
    </ImmersiveBackground>
  )
}
