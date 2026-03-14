import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ButtonDecoration, type DecorationId } from '@/components/ButtonDecoration'

interface GameButtonProps {
  onClick: () => void
  icon: ReactNode
  label: string
  colors?: [string, string] // [from, to] gradient colors
  decoration?: DecorationId
  size?: 'full' | 'half'
  className?: string
}

function colorToShadow(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function GameButton({ onClick, icon, label, colors = ['#4ADE80', '#16A34A'], decoration = 'none', size = 'full', className }: GameButtonProps) {
  const [from, to] = colors
  const shadow = colorToShadow(to, 0.4)

  return (
    <button
      onClick={onClick}
      className={cn(
        'game-btn relative flex items-center justify-center gap-2.5 text-white font-bold rounded-2xl overflow-hidden',
        'border-t-[3px] border-t-white/30 border-b-[4px] border-b-black/30',
        'active:translate-y-0.5 active:border-b-[2px]',
        size === 'full' ? 'w-full py-4 text-lg' : 'py-3.5 text-sm',
        className,
      )}
      style={{
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        boxShadow: `0 4px 12px ${shadow}, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)`,
        textShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }}
    >
      {/* Highlight — convex top shine */}
      <div
        className="absolute inset-x-0 top-0 h-[45%] pointer-events-none rounded-t-2xl"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
        }}
      />
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
      {/* Themed decoration */}
      <ButtonDecoration id={decoration} size={size} />
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {icon}
        <span>{label}</span>
      </span>
    </button>
  )
}
