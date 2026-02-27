import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TimerCircleProps {
  /** Time remaining in milliseconds */
  remaining: number
  /** Total duration in milliseconds (default 24h) */
  total?: number
  /** Size of the circle */
  size?: 'sm' | 'md' | 'lg'
  /** Show time text */
  showTime?: boolean
  className?: string
}

const SIZE_CONFIG = {
  sm: { width: 48, stroke: 4, fontSize: 'text-xs' },
  md: { width: 80, stroke: 6, fontSize: 'text-sm' },
  lg: { width: 120, stroke: 8, fontSize: 'text-lg' },
}

export function TimerCircle({
  remaining,
  total = 24 * 60 * 60 * 1000,
  size = 'md',
  showTime = true,
  className,
}: TimerCircleProps) {
  const [displayRemaining, setDisplayRemaining] = useState(remaining)

  // Update display every second
  useEffect(() => {
    setDisplayRemaining(remaining)

    if (remaining <= 0) return

    const interval = setInterval(() => {
      setDisplayRemaining((prev) => Math.max(0, prev - 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [remaining])

  const config = SIZE_CONFIG[size]
  const radius = (config.width - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(1, Math.max(0, 1 - displayRemaining / total))
  const strokeDashoffset = circumference * (1 - progress)

  // Format time
  const formatTime = (ms: number): string => {
    if (ms <= 0) return '0:00'

    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isExpired = displayRemaining <= 0
  const isUrgent = displayRemaining > 0 && displayRemaining < 60 * 60 * 1000 // < 1h

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={config.width}
        height={config.width}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            'transition-all duration-1000',
            isExpired
              ? 'text-success'
              : isUrgent
                ? 'text-warning'
                : 'text-primary'
          )}
        />
      </svg>

      {showTime && (
        <span
          className={cn(
            'absolute font-bold',
            config.fontSize,
            isExpired
              ? 'text-success'
              : isUrgent
                ? 'text-warning'
                : 'text-text'
          )}
        >
          {isExpired ? '✓' : formatTime(displayRemaining)}
        </span>
      )}
    </div>
  )
}
