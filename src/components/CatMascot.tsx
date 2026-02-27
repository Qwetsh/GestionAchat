import { useMascotStore } from '@/stores/mascotStore'
import { cn } from '@/lib/utils'

interface CatMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showBackground?: boolean
}

export function CatMascot({ size = 'md', className, showBackground = true }: CatMascotProps) {
  const { getSelectedCat, getSelectedBackground } = useMascotStore()

  const cat = getSelectedCat()
  const background = getSelectedBackground()

  // Tailles carrées (sans fond) vs rectangulaires (avec fond)
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  }

  const sizeClassesWithBg = {
    sm: 'w-20 h-12',
    md: 'w-32 h-20',
    lg: 'w-48 h-32',
    xl: 'w-72 h-48',
  }

  const hasBackgroundImage = showBackground && background.image

  return (
    <div className={cn(
      'relative inline-flex items-end justify-center overflow-hidden rounded-xl',
      hasBackgroundImage ? sizeClassesWithBg[size] : sizeClasses[size],
      className
    )}>
      {/* Background image */}
      {hasBackgroundImage && (
        <img
          src={background.image}
          alt={background.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Cat image - positioned at bottom when there's a background */}
      <img
        src={cat.image}
        alt={cat.name}
        className={cn(
          'relative z-10 drop-shadow-lg',
          hasBackgroundImage
            ? 'w-[85%] h-[85%] object-contain mb-1'
            : 'w-full h-full object-contain'
        )}
      />
    </div>
  )
}
