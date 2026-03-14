import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGamificationStore, getLevelTitle } from '@/stores/gamificationStore'
import { LEVEL_THRESHOLDS } from '@/lib/constants'
import { useGemStore } from '@/stores/gemStore'
import { useTalentStore } from '@/stores/talentStore'
import { useMascotStore } from '@/stores/mascotStore'
import { TALENTS, BRANCHES, getTalentLevels, type Talent, type TalentBranch } from '@/lib/talents'
import { ArrowLeft, Lock, Check, Gem } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function colorToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export function TalentTreePage() {
  const navigate = useNavigate()
  const { xp, level, getLevelProgress, getNextLevelXP } = useGamificationStore()
  const levelProgress = getLevelProgress() * 100
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextLevelXP = getNextLevelXP()
  const { getAvailableGems, spendGems, addGems } = useGemStore()
  const { purchaseTalent, isTalentPurchased } = useTalentStore()
  const { unlockCat, unlockBackground } = useMascotStore()
  const gems = getAvailableGems()
  const levels = getTalentLevels()

  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const branches: TalentBranch[] = ['cosmetic', 'unlock', 'gems']

  const handleTalentClick = (talent: Talent) => {
    setSelectedTalent(talent)
    setShowConfirm(false)
  }

  const handleBuyClick = () => {
    if (!selectedTalent) return
    if (gems < selectedTalent.gemCost) {
      toast.error('Pas assez de rubis')
      return
    }
    setShowConfirm(true)
  }

  const confirmPurchase = () => {
    if (!selectedTalent) return
    const talent = selectedTalent

    spendGems(talent.gemCost)
    purchaseTalent(talent.id)

    switch (talent.effect.type) {
      case 'unlock_cat':
        unlockCat(talent.effect.catId)
        break
      case 'unlock_background':
        unlockBackground(talent.effect.backgroundId)
        break
      case 'one_time_gems':
        addGems(talent.effect.gems)
        break
    }

    toast.success(`${talent.name} débloqué !`, {
      description: talent.description,
    })
    setSelectedTalent(null)
    setShowConfirm(false)
  }

  const getEffectDescription = (talent: Talent): string => {
    const e = talent.effect
    switch (e.type) {
      case 'unlock_cat': return 'Débloque un chat exclusif dans ta collection. Ce chat n\'est pas disponible en boutique.'
      case 'unlock_background': return 'Débloque un fond d\'écran exclusif. Ce fond n\'est pas disponible en boutique.'
      case 'unlock_shop_item': return 'Débloque un nouvel article dans la boutique que tu pourras utiliser à volonté.'
      case 'passive_no_expense_day': return `Chaque jour où tu n'enregistres aucune dépense, tu gagnes ${e.gemsPerDay} rubis automatiquement.`
      case 'upgrade_weekly_savings': return `Tes gains hebdomadaires passent à ${e.gemsPerTranche} rubis par tranche de 10€ économisés (au lieu de 1).`
      case 'combo_days': return `Si tu passes ${e.days} jours consécutifs sans dépense, tu gagnes ${e.gems} rubis bonus.`
      case 'one_time_gems': return `Tu reçois ${e.gems} rubis immédiatement à l'achat. Bonus unique.`
      case 'monthly_under_budget': return `Si tu restes sous budget pendant tout le mois, tu gagnes ${e.gems} rubis bonus en fin de mois.`
      case 'unlock_budget_boost': return `Débloque l'option "+${e.amount}€ de budget par semaine" en boutique pour seulement ${e.cost} rubis.`
      case 'weekly_half_saved': return `Si tu termines la semaine avec 50% ou plus de ton budget restant, tu gagnes ${e.gems} rubis bonus.`
      case 'monthly_no_expense_double': return 'Si tu ne fais aucun achat pendant un mois entier, tous tes rubis sont doublés. Récompense ultime.'
    }
  }

  const getTalentState = (talent: Talent): 'purchased' | 'available' | 'locked_level' | 'locked_gems' => {
    if (isTalentPurchased(talent.id)) return 'purchased'
    if (level < talent.level) return 'locked_level'
    if (gems < talent.gemCost) return 'locked_gems'
    return 'available'
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/60 backdrop-blur-xl border-b border-primary/10 px-4 py-4">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-text">Arbre de talents</h1>
            <p className="text-sm text-muted">Niveau {level}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <Gem className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{gems}</span>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* XP Progress — glowing banner */}
        <div
          className="relative mb-6 p-4 rounded-2xl border border-violet-500/20 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 100%)',
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">Niv. {level}</span>
                <span className="text-xs text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full font-medium">
                  {getLevelTitle(level)}
                </span>
              </div>
              <span className="text-xs text-violet-200/60 font-medium">
                {xp - currentThreshold} / {nextLevelXP - currentThreshold} XP
              </span>
            </div>
            <div className="w-full h-3.5 bg-black/30 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${levelProgress}%`,
                  background: 'linear-gradient(90deg, #8B5CF6, #6366F1, #A78BFA)',
                  boxShadow: '0 0 12px rgba(139,92,246,0.5)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Branch headers */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {branches.map((b) => {
            const meta = BRANCHES[b]
            return (
              <div key={b} className="text-center">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})`,
                    boxShadow: `0 2px 8px rgba(${colorToRgb(meta.color)},0.3)`,
                  }}
                >
                  <span>{meta.emoji}</span>
                  <span>{meta.name}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tree grid */}
        <div className="relative">
          {/* Vertical connection lines — more visible */}
          {branches.map((b, bi) => (
            <div
              key={b}
              className="absolute top-0 bottom-0"
              style={{
                left: `${(bi * 2 + 1) * (100 / 6)}%`,
                width: '2px',
                background: `linear-gradient(to bottom, ${BRANCHES[b].color}40, ${BRANCHES[b].color}10, transparent)`,
              }}
            />
          ))}

          {/* Level rows */}
          {levels.map((lvl) => {
            const talentsAtLevel = TALENTS.filter((t) => t.level === lvl)
            const isLevelReached = level >= lvl

            return (
              <div key={lvl} className="relative mb-5">
                {/* Level indicator — badge style */}
                <div className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg mb-2.5 border',
                  isLevelReached
                    ? 'bg-white/10 text-white border-white/15'
                    : 'bg-white/[0.03] text-white/25 border-white/5'
                )}>
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isLevelReached ? 'bg-emerald-400' : 'bg-white/15'
                  )} />
                  Niv. {lvl}
                </div>

                {/* Talent nodes */}
                <div className="grid grid-cols-3 gap-2.5">
                  {branches.map((branch) => {
                    const talent = talentsAtLevel.find((t) => t.branch === branch)
                    const branchMeta = BRANCHES[branch]
                    const rgb = colorToRgb(branchMeta.color)

                    // Empty slot — placeholder node
                    if (!talent) {
                      return (
                        <div key={branch} className="flex items-center justify-center py-4">
                          <div className="w-3 h-3 rounded-full border border-dashed border-white/10" />
                        </div>
                      )
                    }

                    const state = getTalentState(talent)

                    return (
                      <button
                        key={talent.id}
                        onClick={() => handleTalentClick(talent)}
                        className={cn(
                          'relative flex flex-col items-center text-center p-3 rounded-2xl border transition-all',
                          // Purchased — glowing branch color
                          state === 'purchased' && 'border-transparent',
                          // Available — ready to buy, subtle pulse
                          state === 'available' && 'border-white/20 active:scale-95 talent-available',
                          // Locked gems — can see but can't afford
                          state === 'locked_gems' && 'border-white/10 opacity-70',
                          // Locked level — visible but muted
                          state === 'locked_level' && 'border-white/8 opacity-50',
                        )}
                        style={{
                          background: state === 'purchased'
                            ? `linear-gradient(135deg, rgba(${rgb},0.2) 0%, rgba(${rgb},0.05) 100%)`
                            : state === 'available'
                              ? `linear-gradient(135deg, rgba(${rgb},0.08) 0%, rgba(255,255,255,0.03) 100%)`
                              : state === 'locked_level'
                                ? `linear-gradient(135deg, rgba(${rgb},0.04) 0%, rgba(255,255,255,0.02) 100%)`
                                : `linear-gradient(135deg, rgba(${rgb},0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                          boxShadow: state === 'purchased'
                            ? `0 0 20px rgba(${rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
                            : state === 'available'
                              ? `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
                              : undefined,
                          borderColor: state === 'purchased'
                            ? `rgba(${rgb},0.4)`
                            : undefined,
                        }}
                      >
                        {/* Status badge */}
                        <div className="absolute -top-1.5 -right-1.5 z-10">
                          {state === 'purchased' && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${branchMeta.gradient[0]}, ${branchMeta.gradient[1]})`,
                                boxShadow: `0 0 8px rgba(${rgb},0.5)`,
                              }}
                            >
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          {state === 'locked_level' && (
                            <div className="w-5 h-5 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                              <Lock className="h-2.5 w-2.5 text-white/30" />
                            </div>
                          )}
                        </div>

                        {/* Icon — large, centered */}
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-1.5',
                            state === 'locked_level' && 'grayscale opacity-60',
                          )}
                          style={{
                            background: state === 'purchased'
                              ? `linear-gradient(135deg, rgba(${rgb},0.3), rgba(${rgb},0.1))`
                              : state === 'available'
                                ? `rgba(${rgb},0.12)`
                                : 'rgba(255,255,255,0.04)',
                          }}
                        >
                          {talent.icon}
                        </div>

                        {/* Name */}
                        <p className={cn(
                          'text-[11px] font-semibold leading-tight',
                          state === 'purchased' ? 'text-white' : state === 'locked_level' ? 'text-white/30' : 'text-white/80'
                        )}>
                          {talent.name}
                        </p>

                        {/* Cost or status */}
                        {state === 'purchased' ? (
                          <p className="text-[10px] mt-1 font-medium" style={{ color: branchMeta.color }}>
                            Acquis
                          </p>
                        ) : state === 'locked_level' ? (
                          <p className="text-[10px] text-white/20 mt-1">Niv. {talent.level}</p>
                        ) : (
                          <div className="flex items-center gap-1 mt-1">
                            <Gem className="h-3 w-3 text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-400">{talent.gemCost}</span>
                          </div>
                        )}

                        {/* Branch color accent line */}
                        <div
                          className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                          style={{
                            background: state === 'purchased'
                              ? `linear-gradient(90deg, transparent, rgba(${rgb},0.6), transparent)`
                              : state === 'available'
                                ? `linear-gradient(90deg, transparent, rgba(${rgb},0.3), transparent)`
                                : `linear-gradient(90deg, transparent, rgba(${rgb},0.1), transparent)`,
                          }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* "À venir" row */}
          <div className="mt-4 mb-2">
            <div className="grid grid-cols-3 gap-2.5">
              {branches.map((b) => (
                <div
                  key={b}
                  className="flex flex-col items-center justify-center py-4 rounded-2xl border border-dashed border-white/8"
                >
                  <div className="w-3 h-3 rounded-full border border-dashed border-white/15 mb-1.5" />
                  <p className="text-[10px] text-white/15 font-medium">à venir</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Talent detail dialog */}
      <Dialog open={!!selectedTalent} onOpenChange={() => { setSelectedTalent(null); setShowConfirm(false) }}>
        <DialogContent className="sm:max-w-sm">
          {selectedTalent && (() => {
            const state = getTalentState(selectedTalent)
            const branchMeta = BRANCHES[selectedTalent.branch]
            const rgb = colorToRgb(branchMeta.color)
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/10"
                      style={{
                        background: `linear-gradient(135deg, rgba(${rgb},0.25), rgba(${rgb},0.08))`,
                        boxShadow: `0 0 16px rgba(${rgb},0.15)`,
                      }}
                    >
                      {selectedTalent.icon}
                    </div>
                    <div>
                      <DialogTitle className="text-lg">{selectedTalent.name}</DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                          style={{
                            background: `linear-gradient(135deg, ${branchMeta.gradient[0]}, ${branchMeta.gradient[1]})`,
                            boxShadow: `0 2px 6px rgba(${rgb},0.3)`,
                          }}
                        >
                          {branchMeta.emoji} {branchMeta.name}
                        </span>
                        <span className="text-[10px] text-white/40">Niv. {selectedTalent.level}</span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <DialogDescription className="text-sm leading-relaxed pt-2">
                  {getEffectDescription(selectedTalent)}
                </DialogDescription>

                {state === 'purchased' ? (
                  <div
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border"
                    style={{
                      background: `linear-gradient(135deg, rgba(${rgb},0.12), rgba(${rgb},0.04))`,
                      borderColor: `rgba(${rgb},0.25)`,
                    }}
                  >
                    <Check className="h-5 w-5" style={{ color: branchMeta.color }} />
                    <span className="text-sm font-semibold" style={{ color: branchMeta.color }}>
                      Talent acquis
                    </span>
                  </div>
                ) : state === 'locked_level' ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl border border-white/5">
                    <Lock className="h-4 w-4 text-white/30" />
                    <span className="text-sm text-white/40">Niveau {selectedTalent.level} requis (tu es niv. {level})</span>
                  </div>
                ) : showConfirm ? (
                  <div className="space-y-3">
                    <p className="text-xs text-center text-red-400/80">
                      Ce choix est permanent et ne peut pas être annulé.
                    </p>
                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                      <Button
                        onClick={confirmPurchase}
                        className="w-full text-white"
                        style={{
                          background: `linear-gradient(135deg, ${branchMeta.gradient[0]}, ${branchMeta.gradient[1]})`,
                          boxShadow: `0 4px 12px rgba(${rgb},0.3)`,
                        }}
                      >
                        Confirmer l'achat ({selectedTalent.gemCost} rubis)
                      </Button>
                      <Button onClick={() => setShowConfirm(false)} variant="outline" className="w-full">
                        Retour
                      </Button>
                    </DialogFooter>
                  </div>
                ) : (
                  <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button
                      onClick={handleBuyClick}
                      disabled={gems < selectedTalent.gemCost}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600"
                      style={{ boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
                    >
                      <Gem className="h-4 w-4 mr-2" />
                      Acheter pour {selectedTalent.gemCost} rubis
                    </Button>
                    {gems < selectedTalent.gemCost && (
                      <p className="text-xs text-center text-white/30">
                        Il te manque {selectedTalent.gemCost - gems} rubis
                      </p>
                    )}
                  </DialogFooter>
                )}
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
