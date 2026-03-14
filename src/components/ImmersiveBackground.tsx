import { type ReactNode } from 'react'
import { useMascotStore } from '@/stores/mascotStore'

interface ImmersiveBackgroundProps {
  children: ReactNode
}

export function ImmersiveBackground({ children }: ImmersiveBackgroundProps) {
  const { getSelectedBackground } = useMascotStore()
  const background = getSelectedBackground()
  const hasImage = !!background.image

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background image or default gradient */}
      {hasImage ? (
        <img
          src={background.image}
          alt={background.name}
          className="fixed inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0F0A1A] via-[#1E1033] to-[#0F0A1A]" />
      )}

      {/* Top overlay for readability */}
      {hasImage && (
        <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 via-black/25 to-transparent z-[1]" />
      )}

      {/* Bottom overlay for readability */}
      {hasImage && (
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/50 via-black/25 to-transparent z-[1]" />
      )}

      {/* Content */}
      <div className="relative z-[2] h-full flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
