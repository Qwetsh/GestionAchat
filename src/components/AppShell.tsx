import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface AppShellProps {
  children: ReactNode
}

// Routes that show the immersive homepage (no shell wrapping needed)
const IMMERSIVE_ROUTES = ['/']

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const isImmersive = isAuthenticated && IMMERSIVE_ROUTES.includes(location.pathname)

  // Immersive routes handle their own layout
  if (isImmersive) {
    return <>{children}</>
  }

  // Auth pages (login/register)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    )
  }

  // Other authenticated pages (stats, budget, new expense, etc.)
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  )
}
