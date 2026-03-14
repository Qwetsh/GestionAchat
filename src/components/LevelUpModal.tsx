import { useEffect, useState } from 'react'
import { getLevelTitle } from '@/stores/gamificationStore'
import { LEVEL_THRESHOLDS } from '@/lib/constants'
import { Button } from '@/components/ui/button'

interface LevelUpModalProps {
  level: number
  open: boolean
  onClose: () => void
}

export function LevelUpModal({ level, open, onClose }: LevelUpModalProps) {
  const [visible, setVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (open) {
      // Stagger animations: backdrop → content
      setVisible(true)
      const t = setTimeout(() => setContentVisible(true), 150)
      return () => clearTimeout(t)
    } else {
      setContentVisible(false)
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible) return null

  const title = getLevelTitle(level)
  const nextThreshold = LEVEL_THRESHOLDS[level] || null

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sunburst rays container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="levelup-rays" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="levelup-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Modal content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-8 py-10 max-w-xs w-full rounded-3xl border border-violet-400/30 transition-all duration-500 ${contentVisible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(139,92,246,0.25) 0%, rgba(15,10,26,0.95) 60%)',
          boxShadow: '0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        {/* Level number — big glowing */}
        <div
          className={`relative mb-2 transition-all duration-700 delay-200 ${contentVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
        >
          <span
            className="text-7xl font-black text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(180deg, #E9D5FF 0%, #A78BFA 40%, #7C3AED 100%)',
              filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.6))',
            }}
          >
            {level}
          </span>
          {/* Glow ring behind number */}
          <div
            className="absolute inset-0 -m-4 rounded-full opacity-40 blur-xl"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.6), transparent 70%)' }}
          />
        </div>

        {/* "Niveau atteint" label */}
        <p
          className={`text-sm font-bold uppercase tracking-[0.2em] text-violet-300 mb-1 transition-all duration-500 delay-300 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Niveau atteint
        </p>

        {/* Title badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 transition-all duration-500 delay-400 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(167,139,250,0.15))',
            border: '1px solid rgba(167,139,250,0.3)',
            boxShadow: '0 2px 12px rgba(139,92,246,0.2)',
          }}
        >
          <span className="text-lg">✨</span>
          <span className="text-base font-bold text-violet-200">{title}</span>
        </div>

        {/* Next level info */}
        {nextThreshold && (
          <p
            className={`text-xs text-white/40 mb-5 transition-all duration-500 delay-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            Prochain niveau : {nextThreshold} XP
          </p>
        )}

        {/* CTA button */}
        <Button
          onClick={onClose}
          className={`w-full text-white font-bold text-sm py-5 rounded-xl transition-all duration-500 delay-500 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
          }}
        >
          Continuer
        </Button>
      </div>
    </div>
  )
}
