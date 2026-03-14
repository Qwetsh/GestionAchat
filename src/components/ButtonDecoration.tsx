// Decorative overlays for GameButtons, themed per background

export type DecorationId = 'none' | 'sakura' | 'leaves' | 'stars' | 'neon' | 'rain' | 'cozy'

// ─── Sakura (Japon) ─────────────────────────────────────────
// Cherry blossom petals and small branch at corners

function SakuraDecoration({ size }: { size: 'full' | 'half' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Branch top-left */}
      <svg className="absolute -top-1 -left-1 w-16 h-14 opacity-60" viewBox="0 0 64 56" fill="none">
        <path d="M2 48 C12 38, 22 25, 38 18 C44 15, 52 12, 58 4" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M10 42 C14 36, 20 30, 28 24" stroke="#8B4513" strokeWidth="1" strokeLinecap="round" fill="none" />
        {/* Flowers */}
        <circle cx="38" cy="17" r="4" fill="#FFB7C5" opacity="0.9" />
        <circle cx="38" cy="17" r="1.5" fill="#FF69B4" opacity="0.7" />
        <circle cx="28" cy="23" r="3.5" fill="#FFC0CB" opacity="0.85" />
        <circle cx="28" cy="23" r="1.2" fill="#FF69B4" opacity="0.6" />
        <circle cx="50" cy="10" r="3" fill="#FFB7C5" opacity="0.8" />
        <circle cx="50" cy="10" r="1" fill="#FF69B4" opacity="0.6" />
        <circle cx="18" cy="34" r="2.5" fill="#FFC0CB" opacity="0.7" />
      </svg>

      {/* Falling petals right side */}
      <svg className="absolute -bottom-1 -right-1 w-12 h-12 opacity-50" viewBox="0 0 48 48" fill="none">
        <ellipse cx="12" cy="10" rx="3" ry="5" transform="rotate(-30 12 10)" fill="#FFB7C5" opacity="0.8" />
        <ellipse cx="30" cy="20" rx="2.5" ry="4" transform="rotate(15 30 20)" fill="#FFC0CB" opacity="0.7" />
        <ellipse cx="20" cy="35" rx="2" ry="3.5" transform="rotate(-45 20 35)" fill="#FFB7C5" opacity="0.6" />
        {size === 'full' && (
          <ellipse cx="40" cy="38" rx="2.5" ry="4" transform="rotate(20 40 38)" fill="#FFC0CB" opacity="0.5" />
        )}
      </svg>
    </div>
  )
}

// ─── Leaves (Jardin) ────────────────────────────────────────
// Small leaves and vine tendrils

function LeavesDecoration({ size }: { size: 'full' | 'half' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Vine top-right */}
      <svg className="absolute -top-1 -right-1 w-14 h-12 opacity-50" viewBox="0 0 56 48" fill="none">
        <path d="M54 2 C46 8, 38 14, 30 18 C24 22, 16 26, 8 24" stroke="#4ADE80" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <path d="M42 10 C44 6, 48 4, 46 10 C44 14, 40 12, 42 10Z" fill="#4ADE80" opacity="0.8" />
        <path d="M30 18 C28 14, 32 12, 34 16 C36 20, 30 20, 30 18Z" fill="#22C55E" opacity="0.7" />
        <path d="M16 24 C14 20, 18 18, 20 22 C22 26, 16 26, 16 24Z" fill="#4ADE80" opacity="0.6" />
      </svg>

      {/* Small leaf bottom-left */}
      <svg className="absolute -bottom-0.5 -left-0.5 w-10 h-10 opacity-40" viewBox="0 0 40 40" fill="none">
        <path d="M8 36 C12 28, 20 22, 28 18" stroke="#22C55E" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M18 24 C16 20, 20 18, 22 22 C24 26, 18 26, 18 24Z" fill="#4ADE80" opacity="0.7" />
        {size === 'full' && (
          <path d="M28 18 C26 14, 30 12, 32 16 C34 20, 28 20, 28 18Z" fill="#22C55E" opacity="0.6" />
        )}
      </svg>
    </div>
  )
}

// ─── Stars (Chambre) ────────────────────────────────────────
// Sparkles and tiny stars, dreamy feel

function StarsDecoration({ size }: { size: 'full' | 'half' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 200 60" fill="none">
        {/* 4-point stars */}
        <path d="M20 12 L22 8 L24 12 L28 14 L24 16 L22 20 L20 16 L16 14Z" fill="#C4B5FD" opacity="0.9" />
        <path d="M170 8 L171.5 5 L173 8 L176 9.5 L173 11 L171.5 14 L170 11 L167 9.5Z" fill="#DDD6FE" opacity="0.8" />
        <path d="M85 6 L86 4 L87 6 L89 7 L87 8 L86 10 L85 8 L83 7Z" fill="#E9D5FF" opacity="0.7" />

        {/* Sparkle dots */}
        <circle cx="50" cy="15" r="1.5" fill="#F5F3FF" opacity="0.8" />
        <circle cx="130" cy="10" r="1" fill="#DDD6FE" opacity="0.7" />
        <circle cx="155" cy="45" r="1.5" fill="#C4B5FD" opacity="0.6" />
        <circle cx="40" cy="42" r="1" fill="#E9D5FF" opacity="0.5" />

        {size === 'full' && (
          <>
            <path d="M140 42 L141.5 39 L143 42 L146 43.5 L143 45 L141.5 48 L140 45 L137 43.5Z" fill="#C4B5FD" opacity="0.6" />
            <circle cx="100" cy="48" r="1.2" fill="#DDD6FE" opacity="0.6" />
          </>
        )}
      </svg>
    </div>
  )
}

// ─── Neon (Bureau) ──────────────────────────────────────────
// Neon glow lines at edges

function NeonDecoration({ size }: { size: 'full' | 'half' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Top neon line */}
      <div
        className="absolute top-0 left-4 right-4 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #818CF8 20%, #C084FC 50%, #818CF8 80%, transparent 100%)',
          boxShadow: '0 0 6px #818CF8, 0 0 12px rgba(129,140,248,0.3)',
        }}
      />
      {/* Bottom neon line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #22D3EE 30%, #818CF8 70%, transparent 100%)',
          boxShadow: '0 0 4px #22D3EE, 0 0 8px rgba(34,211,238,0.3)',
        }}
      />
      {/* Corner glow */}
      <div className="absolute top-1 right-2 w-2 h-2 rounded-full opacity-60"
        style={{ background: '#C084FC', boxShadow: '0 0 6px #C084FC' }}
      />
      {size === 'full' && (
        <div className="absolute bottom-1.5 left-3 w-1.5 h-1.5 rounded-full opacity-50"
          style={{ background: '#22D3EE', boxShadow: '0 0 5px #22D3EE' }}
        />
      )}
    </div>
  )
}

// ─── Rain (Konbini) ─────────────────────────────────────────
// Rain drops and warm neon glow, cozy night feel

function RainDecoration({ size }: { size: 'full' | 'half' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 60" fill="none">
        {/* Rain streaks */}
        <line x1="30" y1="2" x2="28" y2="14" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        <line x1="70" y1="5" x2="68" y2="18" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <line x1="120" y1="1" x2="118" y2="12" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        <line x1="160" y1="8" x2="158" y2="20" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <line x1="50" y1="30" x2="48" y2="42" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <line x1="145" y1="35" x2="143" y2="48" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        {size === 'full' && (
          <>
            <line x1="95" y1="3" x2="93" y2="16" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            <line x1="180" y1="25" x2="178" y2="38" stroke="#93C5FD" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
          </>
        )}
      </svg>
      {/* Warm glow bottom — like reflected neon on wet surface */}
      <div
        className="absolute bottom-0 left-2 right-2 h-[2px] opacity-40"
        style={{
          background: 'linear-gradient(90deg, transparent, #FB923C 30%, #FBBF24 50%, #FB923C 70%, transparent)',
          boxShadow: '0 0 6px rgba(251,146,60,0.4)',
        }}
      />
    </div>
  )
}

// ─── Cozy (Salon) ───────────────────────────────────────────
// Warm light rays and small plant accent

function CozyDecoration({ size }: { size: 'full' | 'half' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Warm light ray from top-left */}
      <div
        className="absolute -top-2 -left-2 w-20 h-20 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at top left, #FBBF24 0%, transparent 70%)',
        }}
      />
      {/* Small plant accent bottom-right */}
      <svg className="absolute -bottom-0.5 -right-0.5 w-10 h-10 opacity-40" viewBox="0 0 40 40" fill="none">
        <path d="M30 38 C28 30, 26 24, 28 18" stroke="#4ADE80" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M28 22 C24 18, 28 14, 32 18 C34 22, 28 24, 28 22Z" fill="#4ADE80" opacity="0.7" />
        <path d="M26 28 C22 26, 22 22, 26 24 C28 26, 26 30, 26 28Z" fill="#22C55E" opacity="0.6" />
      </svg>
      {size === 'full' && (
        <div
          className="absolute -top-1 -right-1 w-16 h-16 opacity-10"
          style={{
            background: 'radial-gradient(ellipse at top right, #FBBF24 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  )
}

// ─── Decoration selector ────────────────────────────────────

export function ButtonDecoration({ id, size }: { id: DecorationId; size: 'full' | 'half' }) {
  switch (id) {
    case 'sakura': return <SakuraDecoration size={size} />
    case 'leaves': return <LeavesDecoration size={size} />
    case 'stars': return <StarsDecoration size={size} />
    case 'neon': return <NeonDecoration size={size} />
    case 'rain': return <RainDecoration size={size} />
    case 'cozy': return <CozyDecoration size={size} />
    default: return null
  }
}
