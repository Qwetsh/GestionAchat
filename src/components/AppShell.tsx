import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useGamificationStore, getLevelTitle } from '@/stores/gamificationStore'
import { getStats } from '@/features/temptation/temptationService'
import { Home, History, BarChart3, Plus, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: ReactNode
}

// Pages that should show the sidebar (authenticated pages)
const SIDEBAR_ROUTES = ['/', '/history', '/stats', '/new', '/temptation', '/shop']

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthStore()
  const { xp, level, currentStreak } = useGamificationStore()
  const stats = getStats()

  // Check if current route should show sidebar
  const showSidebar = isAuthenticated && SIDEBAR_ROUTES.some(route =>
    location.pathname === route || location.pathname.startsWith('/temptation/')
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/stats', icon: BarChart3, label: 'Statistiques' },
  ]

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // No sidebar for auth pages
  if (!showSidebar) {
    return (
      <div className="min-h-screen lg:flex lg:items-center lg:justify-center">
        <div className="w-full lg:max-w-md">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop only */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-primary/10 lg:bg-background/50 lg:backdrop-blur-xl">
        {/* Logo */}
        <div className="p-6 border-b border-primary/10">
          <h1 className="text-xl font-light tracking-tight text-text">
            <span className="font-semibold text-primary">Gestion</span>Achat
          </h1>
        </div>

        {/* User Stats Card */}
        <div className="p-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted">Niveau {level}</span>
              {currentStreak > 0 && (
                <span className="text-sm font-medium text-primary bg-primary/20 px-2.5 py-0.5 rounded-full border border-primary/30">
                  {currentStreak} 🔥
                </span>
              )}
            </div>
            <p className="text-lg font-semibold text-text mb-1">{getLevelTitle(level)}</p>
            <p className="text-xs text-primary">{xp} XP</p>
          </div>
        </div>

        {/* Coffre Summary */}
        <div className="px-4 pb-4">
          <div className="coffre-premium rounded-xl p-4">
            <p className="text-xs text-muted mb-1">Ton coffre</p>
            <p className="text-2xl font-bold text-text">{formatAmount(stats.totalSaved)}</p>
            <p className="text-xs text-primary/80 mt-1">
              {stats.resistedCount} tentation{stats.resistedCount > 1 ? 's' : ''} résistée{stats.resistedCount > 1 ? 's' : ''} 💪
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all text-left',
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted hover:bg-white/5 hover:text-text'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}

          {/* New Temptation Button */}
          <button
            onClick={() => navigate('/new')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-4 bg-gradient-to-r from-primary to-primary-deep text-white hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Nouvelle tentation</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-white/5 hover:text-text transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
