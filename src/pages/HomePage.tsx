import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useGamificationStore, getLevelTitle } from '@/stores/gamificationStore'
import {
  getActiveTemptations,
  checkAndResolveExpired,
  markAsCracked,
  getStats,
  getCategoryResistedStats,
  type Temptation,
} from '@/features/temptation/temptationService'
import { useBadgeStore, type BadgeStats } from '@/stores/badgeStore'
import { useNotifications } from '@/hooks/useNotifications'
import {
  notifyMultipleExpired,
  notifyTimerExpired,
} from '@/features/notifications/notificationService'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TemptationCard } from '@/components/TemptationCard'
import { toast } from 'sonner'
import { Plus, LogOut, ChevronRight, Bell } from 'lucide-react'
import { celebrateResistance, celebrateBadge, celebrateLevelUp } from '@/lib/confetti'

// Load initial data synchronously (called once at module level per mount)
function getInitialState() {
  const resolved = checkAndResolveExpired()
  const temptations = getActiveTemptations()
  const stats = getStats()
  return { resolved, temptations, stats }
}

export function HomePage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { xp, level, currentStreak, addXP, incrementStreak, getLevelProgress } = useGamificationStore()
  const { isSupported: notifSupported, permissionStatus, askPermission, hasAskedPermission } = useNotifications()
  const { checkAndUnlock } = useBadgeStore()

  // Track previous level for level up detection
  const prevLevelRef = useRef(level)

  // Detect level up and celebrate
  useEffect(() => {
    if (level > prevLevelRef.current) {
      celebrateLevelUp()
      toast.success(`🎉 Niveau ${level} atteint !`, {
        description: getLevelTitle(level),
        duration: 5000,
      })
    }
    prevLevelRef.current = level
  }, [level])

  // Helper to check badges and show toast for new ones
  const checkBadges = useCallback(() => {
    const stats = getStats()
    const categoryResisted = getCategoryResistedStats()
    // Get latest streak from store
    const latestStreak = useGamificationStore.getState().currentStreak
    const badgeStats: BadgeStats = {
      totalSaved: stats.totalSaved,
      resistedCount: stats.resistedCount,
      currentStreak: latestStreak,
      categoryResisted,
    }
    const newBadges = checkAndUnlock(badgeStats)
    if (newBadges.length > 0) {
      celebrateBadge()
      newBadges.forEach((badge) => {
        toast.success(`${badge.emoji} Badge débloqué !`, {
          description: badge.name,
          duration: 5000,
        })
      })
    }
  }, [checkAndUnlock])

  // Load initial data - useState initializer runs only once
  const [initialResolved] = useState(() => {
    const data = getInitialState()
    return data.resolved
  })
  const [temptations, setTemptations] = useState<Temptation[]>(() => getActiveTemptations())
  const [stats, setStats] = useState(() => {
    const s = getStats()
    return { totalSaved: s.totalSaved, resistedCount: s.resistedCount }
  })

  // Handle resolved temptations on mount
  useEffect(() => {
    if (initialResolved.length > 0) {
      initialResolved.forEach(() => {
        addXP(50)
        incrementStreak()
      })
      const totalSaved = initialResolved.reduce((sum, t) => sum + t.amount, 0)
      celebrateResistance()
      toast.success(`🎉 Tu as résisté ! +${initialResolved.length * 50} XP`, {
        description: `${totalSaved.toFixed(2)} € économisés !`,
        duration: 5000,
      })
      // Send push notification
      if (initialResolved.length === 1) {
        notifyTimerExpired(initialResolved[0].amount)
      } else {
        notifyMultipleExpired(initialResolved.length, totalSaved)
      }
      // Check for new badges
      checkBadges()
    }
  }, [initialResolved, addXP, incrementStreak, checkBadges])

  // Periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      const resolved = checkAndResolveExpired()
      if (resolved.length > 0) {
        resolved.forEach(() => {
          addXP(50)
          incrementStreak()
        })
        const totalSaved = resolved.reduce((sum, t) => sum + t.amount, 0)
        celebrateResistance()
        toast.success(`🎉 Tu as résisté ! +${resolved.length * 50} XP`, {
          description: `${totalSaved.toFixed(2)} € économisés !`,
          duration: 5000,
        })
        // Send push notification
        if (resolved.length === 1) {
          notifyTimerExpired(resolved[0].amount)
        } else {
          notifyMultipleExpired(resolved.length, totalSaved)
        }
        // Check for new badges
        checkBadges()
      }
      setTemptations(getActiveTemptations())
      const newStats = getStats()
      setStats({
        totalSaved: newStats.totalSaved,
        resistedCount: newStats.resistedCount,
      })
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [addXP, incrementStreak, checkBadges])

  const refreshData = () => {
    setTemptations(getActiveTemptations())
    const newStats = getStats()
    setStats({
      totalSaved: newStats.totalSaved,
      resistedCount: newStats.resistedCount,
    })
  }

  const handleCrack = (id: string) => {
    markAsCracked(id)
    addXP(5)

    toast('Dépense consciente notée', {
      description: '+5 XP - La conscience, c\'est déjà une victoire !',
      duration: 4000,
    })

    refreshData()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header - Mobile only */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-muted/20 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-light tracking-tight text-text">
            <span className="font-medium text-primary">Gestion</span>Achat
          </h1>
          <div className="flex items-center gap-3">
            {currentStreak > 0 && (
              <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {currentStreak} 🔥
              </span>
            )}
            <Button variant="ghost" size="icon" className="text-muted hover:text-text" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-muted/10 px-8 py-6">
        <h1 className="text-2xl font-light text-text">Tableau de bord</h1>
        <p className="text-muted mt-1">Bienvenue, prête à résister ?</p>
      </div>

      <div className="p-4 lg:p-8 space-y-5 lg:space-y-6 max-w-md lg:max-w-none mx-auto">
        {/* Notification Permission Banner */}
        {notifSupported && permissionStatus === 'default' && !hasAskedPermission && (
          <button
            onClick={askPermission}
            className="w-full p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3 hover:bg-primary/10 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-full">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-text">Activer les notifications</p>
              <p className="text-xs text-muted">Pour ne pas rater la fin de tes timers</p>
            </div>
          </button>
        )}

        {/* Stats Grid - Desktop: 3 cols, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Coffre Card - Clickable to history */}
          <Card
            className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/history')}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted mb-2">Ton coffre</p>
                  <p className="text-4xl font-light text-primary mb-1">
                    {formatAmount(stats.totalSaved)}
                  </p>
                  <p className="text-sm text-muted">
                    {stats.resistedCount} tentation{stats.resistedCount > 1 ? 's' : ''} resistee{stats.resistedCount > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full lg:hidden">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Card - Clickable to stats */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/stats')}
          >
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">Niveau {level}</span>
                <span className="text-xs font-medium text-accent">{xp} XP</span>
              </div>
              <Progress value={getLevelProgress() * 100} className="h-2" />
              <p className="text-xs text-muted mt-1">{getLevelTitle(level)}</p>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card>
            <CardContent className="p-4 lg:p-6">
              <p className="text-3xl font-bold text-primary">
                {currentStreak} <span className="text-xl">🔥</span>
              </p>
              <p className="text-sm text-muted">
                {currentStreak === 0 ? 'Pas de streak' : 'jours de suite'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Temptations */}
        <div>
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="font-bold text-text lg:text-xl">
              Tentations en cours ({temptations.length})
            </h2>
            {/* Desktop: inline button */}
            <Button
              onClick={() => navigate('/new')}
              className="hidden lg:flex h-10 px-4 rounded-xl bg-primary hover:bg-primary-deep text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tentation
            </Button>
          </div>

          {temptations.length === 0 ? (
            <Card className="lg:max-w-md">
              <CardContent className="py-8 text-center">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-muted mb-1">Aucune tentation en cours</p>
                <p className="text-sm text-muted">
                  Ajoute ta première pour commencer !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
              {temptations.map((temptation) => (
                <TemptationCard
                  key={temptation.id}
                  temptation={temptation}
                  onCrack={handleCrack}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB - Mobile only */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center">
        <Button
          onClick={() => navigate('/new')}
          className="h-14 px-8 rounded-full bg-primary hover:bg-primary-deep text-white shadow-xl shadow-primary/25 transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle tentation
        </Button>
      </div>
    </div>
  )
}
