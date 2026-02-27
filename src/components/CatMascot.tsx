import type { ReactNode } from 'react'
import { useMascotStore } from '@/stores/mascotStore'
import { cn } from '@/lib/utils'

interface CatMascotProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CatMascot({ size = 'md', className }: CatMascotProps) {
  const { getSelectedCat, getSelectedBackground } = useMascotStore()

  const cat = getSelectedCat()
  const background = getSelectedBackground()

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  }

  // Background decorations
  const renderBackground = (): ReactNode => {
    if (background.id === 'none') return null

    const backgrounds: Record<string, ReactNode> = {
      stars: (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute -top-1 -left-1 text-xs animate-pulse">✨</span>
          <span className="absolute -top-1 -right-1 text-xs animate-pulse delay-100">⭐</span>
          <span className="absolute -bottom-1 -left-1 text-xs animate-pulse delay-200">✨</span>
          <span className="absolute -bottom-1 -right-1 text-xs animate-pulse delay-300">⭐</span>
        </div>
      ),
      hearts: (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute -top-1 -right-1 text-xs animate-pulse">💕</span>
          <span className="absolute -bottom-1 -left-1 text-xs animate-pulse delay-150">💖</span>
        </div>
      ),
      sparkles: (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute -top-1 left-0 text-xs animate-spin" style={{ animationDuration: '3s' }}>💫</span>
          <span className="absolute -bottom-1 -right-1 text-xs animate-spin delay-300" style={{ animationDuration: '3s' }}>✨</span>
        </div>
      ),
      rainbow: (
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-purple-500/30 blur-md pointer-events-none animate-pulse" />
      ),
    }

    return backgrounds[background.id] || null
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
      {/* Background effect */}
      {renderBackground()}

      {/* Cat image */}
      <img
        src={cat.image}
        alt={cat.name}
        className="w-full h-full object-contain relative z-10 drop-shadow-lg"
      />
    </div>
  )
}
