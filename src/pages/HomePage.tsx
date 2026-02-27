import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useGamificationStore, getLevelTitle } from '@/stores/gamificationStore'
import {
  getActiveTemptations,
  checkAndResolveExpired,
  markAsCracked,
  getStats,
  type Temptation,
} from '@/features/temptation/temptationService'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TemptationCard } from '@/components/TemptationCard'
import { toast } from 'sonner'
import { Plus, LogOut, ChevronRight } from 'lucide-react'

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
      toast.success(`🎉 Tu as résisté ! +${initialResolved.length * 50} XP`, {
        description: `${totalSaved.toFixed(2)} € économisés !`,
        duration: 5000,
      })
    }
  }, [initialResolved, addXP, incrementStreak])

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
        toast.success(`🎉 Tu as résisté ! +${resolved.length * 50} XP`, {
          description: `${totalSaved.toFixed(2)} € économisés !`,
          duration: 5000,
        })
      }
      setTemptations(getActiveTemptations())
      const newStats = getStats()
      setStats({
        totalSaved: newStats.totalSaved,
        resistedCount: newStats.resistedCount,
      })
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [addXP, incrementStreak])

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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold text-text">GestionAchat</h1>
          <div className="flex items-center gap-2">
            {currentStreak > 0 && (
              <span className="text-sm font-bold text-primary">
                {currentStreak} 🔥
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Coffre Card - Clickable to history */}
        <Card
          className="bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden cursor-pointer hover:from-primary/90 hover:to-primary/70 transition-colors"
          onClick={() => navigate('/history')}
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 mb-1">Ton coffre</p>
                <p className="text-4xl font-bold mb-1">
                  {formatAmount(stats.totalSaved)}
                </p>
                <p className="text-sm opacity-80">
                  {stats.resistedCount} tentation{stats.resistedCount > 1 ? 's' : ''} resistee{stats.resistedCount > 1 ? 's' : ''}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 opacity-70" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* XP Card - Clickable to stats */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/stats')}
          >
            <CardContent className="p-4">
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
            <CardContent className="p-4">
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-text">
              Tentations en cours ({temptations.length})
            </h2>
          </div>

          {temptations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-muted mb-1">Aucune tentation en cours</p>
                <p className="text-sm text-muted">
                  Ajoute ta première pour commencer !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
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

      {/* FAB */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <Button
          onClick={() => navigate('/new')}
          className="h-14 px-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle tentation
        </Button>
      </div>
    </div>
  )
}
