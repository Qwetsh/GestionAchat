import { useMascotStore, CAT_SKINS, BACKGROUNDS } from '@/stores/mascotStore'
import { CatMascot } from '@/components/CatMascot'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface MascotPickerProps {
  open: boolean
  onClose: () => void
}

export function MascotPicker({ open, onClose }: MascotPickerProps) {
  const {
    unlockedCats,
    unlockedBackgrounds,
    selectedCat,
    selectedBackground,
    selectCat,
    selectBackground,
  } = useMascotStore()

  if (!open) return null

  const ownedCats = CAT_SKINS.filter((c) => unlockedCats.includes(c.id))
  const ownedBackgrounds = BACKGROUNDS.filter((b) => unlockedBackgrounds.includes(b.id))

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-x-4 top-16 bottom-16 lg:inset-x-auto lg:right-8 lg:top-20 lg:bottom-20 lg:w-80 bg-background border border-muted/20 rounded-2xl shadow-2xl shadow-black/60 z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-muted/10">
          <h2 className="text-lg font-semibold text-text">Ma mascotte</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="py-4 text-center border-b border-muted/10">
          <CatMascot size="lg" className="mx-auto mb-2" />
          <p className="text-sm font-medium text-text">
            {CAT_SKINS.find((c) => c.id === selectedCat)?.name}
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Cats */}
          <div>
            <p className="text-xs text-muted mb-2 font-medium">Chatons</p>
            <div className="grid grid-cols-4 gap-2">
              {ownedCats.map((cat) => {
                const isSelected = selectedCat === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      selectCat(cat.id)
                      toast.success(`${cat.emoji} ${cat.name}`)
                    }}
                    className={cn(
                      'flex flex-col items-center p-2 rounded-xl transition-all',
                      isSelected
                        ? 'bg-primary/15 ring-2 ring-primary'
                        : 'bg-muted/5 hover:bg-muted/10'
                    )}
                  >
                    <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain" />
                    <span className="text-[10px] text-muted mt-1 truncate w-full text-center">
                      {cat.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Backgrounds */}
          <div>
            <p className="text-xs text-muted mb-2 font-medium">Décors</p>
            <div className="grid grid-cols-3 gap-2">
              {ownedBackgrounds.map((bg) => {
                const isSelected = selectedBackground === bg.id
                return (
                  <button
                    key={bg.id}
                    onClick={() => {
                      selectBackground(bg.id)
                      toast.success(`${bg.emoji} ${bg.name}`)
                    }}
                    className={cn(
                      'rounded-xl overflow-hidden transition-all',
                      isSelected
                        ? 'ring-2 ring-primary'
                        : 'hover:opacity-80'
                    )}
                  >
                    {bg.image ? (
                      <div className="relative h-16">
                        <img src={bg.image} alt={bg.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-1 left-1 text-[10px] text-white font-medium">
                          {bg.name}
                        </span>
                      </div>
                    ) : (
                      <div className="h-16 bg-muted/5 flex flex-col items-center justify-center">
                        <span className="text-lg">{bg.emoji}</span>
                        <span className="text-[10px] text-muted">{bg.name}</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
