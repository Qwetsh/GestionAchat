import confetti from 'canvas-confetti'

// Standard celebration confetti (resistance victory)
export function celebrateResistance(): void {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#8B5CF6', '#A78BFA', '#DDD6FE', '#6B9080', '#FFD700'],
  })

  // Second burst after slight delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8B5CF6', '#A78BFA', '#DDD6FE'],
    })
  }, 150)

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#8B5CF6', '#A78BFA', '#DDD6FE'],
    })
  }, 300)
}

// Badge unlock celebration (smaller, focused)
export function celebrateBadge(): void {
  confetti({
    particleCount: 60,
    spread: 50,
    origin: { y: 0.7 },
    colors: ['#FFD700', '#FFA500', '#8B5CF6', '#A78BFA'],
    shapes: ['star', 'circle'],
    scalar: 1.2,
  })
}

// Level up celebration (epic)
export function celebrateLevelUp(): void {
  const duration = 2000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8B5CF6', '#7C3AED', '#A78BFA'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#8B5CF6', '#7C3AED', '#A78BFA'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

// Money rain effect (for big savings milestones)
export function celebrateSavings(): void {
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0 },
    gravity: 0.8,
    colors: ['#6B9080', '#22C55E', '#FFD700'],
    shapes: ['circle'],
    scalar: 1.5,
    drift: 0,
  })
}

// Quick success burst (for smaller wins)
export function quickCelebration(): void {
  confetti({
    particleCount: 30,
    spread: 40,
    origin: { y: 0.65 },
    colors: ['#8B5CF6', '#A78BFA'],
    startVelocity: 25,
    gravity: 1.2,
  })
}
