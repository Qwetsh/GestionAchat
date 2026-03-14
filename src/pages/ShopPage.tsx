import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGemStore } from '@/stores/gemStore'
import { useBudgetStore } from '@/stores/budgetStore'
import { useMascotStore, CAT_SKINS, BACKGROUNDS } from '@/stores/mascotStore'
import { useTalentStore, getUnlockedBudgetBoostsFromStore } from '@/stores/talentStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { CatMascot } from '@/components/CatMascot'
import { ArrowLeft, Sparkles, RotateCcw, Lock, Gem } from 'lucide-react'
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

export function ShopPage() {
  const navigate = useNavigate()
  const {
    getAvailableGems,
    spendGems,
    getWheelWinChance,
    spinWheel,
  } = useGemStore()

  const { addWeeklyBonus, getWeeklyBonus } = useBudgetStore()

  const {
    isCatUnlocked,
    isBackgroundUnlocked,
    unlockCat,
    unlockBackground,
    selectCat,
    selectBackground,
    selectedCat,
    selectedBackground,
  } = useMascotStore()

  const { isShopItemUnlocked } = useTalentStore()

  const gems = getAvailableGems()
  const currentBonus = getWeeklyBonus()
  const wheelChance = getWheelWinChance()
  const isDev = window.location.hostname === 'localhost'
  const wheelUnlocked = isShopItemUnlocked('wheel')
  const budgetBoosts = getUnlockedBudgetBoostsFromStore()

  const handleDebugAddGems = () => {
    useGemStore.getState().addGems(10)
    toast.success('+10 rubis (debug)')
  }

  const [showWheelDialog, setShowWheelDialog] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelResult, setWheelResult] = useState<'won' | 'lost' | null>(null)
  const [activeTab, setActiveTab] = useState<'budget' | 'mascot'>('budget')

  const handleSpinWheel = () => {
    if (gems < 5) {
      toast.error('Pas assez de gemmes', {
        description: 'Il te faut 5 gemmes pour tourner la roue',
      })
      return
    }
    setShowWheelDialog(true)
    setWheelResult(null)
  }

  const doSpin = () => {
    spendGems(5)
    setIsSpinning(true)

    setTimeout(() => {
      const won = spinWheel()
      setWheelResult(won ? 'won' : 'lost')
      setIsSpinning(false)

      if (won) {
        addWeeklyBonus(30)
        toast.success('+30 € de budget cette semaine !')
      }
    }, 2000)
  }

  const handleCatClick = (catId: string, gemCost: number) => {
    const unlocked = isCatUnlocked(catId)
    if (unlocked) {
      selectCat(catId)
      toast.success('Chat sélectionné !')
    } else if (gems >= gemCost) {
      spendGems(gemCost)
      unlockCat(catId)
      selectCat(catId)
      toast.success('Nouveau chat débloqué !')
    } else {
      toast.error('Pas assez de gemmes')
    }
  }

  const handleBackgroundClick = (bgId: string, gemCost: number) => {
    const unlocked = isBackgroundUnlocked(bgId)
    if (unlocked) {
      selectBackground(bgId)
      toast.success('Fond sélectionné !')
    } else if (gems >= gemCost) {
      spendGems(gemCost)
      unlockBackground(bgId)
      selectBackground(bgId)
      toast.success('Nouveau fond débloqué !')
    } else {
      toast.error('Pas assez de gemmes')
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
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
            <h1 className="text-xl font-semibold text-text">Boutique</h1>
            <p className="text-sm text-muted">Dépense tes gemmes</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isDev && (
              <button
                onClick={handleDebugAddGems}
                className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-lg border border-green-500/30 transition-colors"
              >
                +10 <Gem className="h-3.5 w-3.5 inline" />
              </button>
            )}
            <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
              <Gem className="h-5 w-5 text-amber-400" />
              <span className="text-xl font-bold text-amber-400">{gems}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab('budget')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all',
              activeTab === 'budget'
                ? 'bg-primary text-white'
                : 'text-muted hover:text-text'
            )}
          >
            💰 Budget
          </button>
          <button
            onClick={() => setActiveTab('mascot')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all',
              activeTab === 'mascot'
                ? 'bg-primary text-white'
                : 'text-muted hover:text-text'
            )}
          >
            🐱 Mascotte
          </button>
        </div>

        {activeTab === 'mascot' ? (
          <>
            {/* Mascot Preview */}
            <Card className="text-center overflow-hidden">
              <CardContent className="py-8">
                <CatMascot size="xl" className="mx-auto mb-4" />
                <p className="text-lg font-semibold text-text">
                  {CAT_SKINS.find(c => c.id === selectedCat)?.name}
                </p>
                <p className="text-sm text-muted mt-1">
                  Ton compagnon adorable !
                </p>
              </CardContent>
            </Card>

            {/* Cats */}
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">🐱 Chatons</h3>
              <div className="grid grid-cols-2 gap-3">
                {CAT_SKINS.map((cat) => {
                  const unlocked = isCatUnlocked(cat.id)
                  const isSelected = selectedCat === cat.id
                  const canAfford = gems >= cat.gemCost

                  return (
                    <Card
                      key={cat.id}
                      className={cn(
                        'cursor-pointer transition-all overflow-hidden',
                        isSelected && 'ring-2 ring-primary',
                        !unlocked && !canAfford && 'opacity-50'
                      )}
                      onClick={() => handleCatClick(cat.id, cat.gemCost)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-2">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-sm font-medium text-text">{cat.emoji} {cat.name}</p>
                        {unlocked ? (
                          <p className="text-xs text-success mt-1">{isSelected ? '✓ Sélectionné' : 'Débloqué'}</p>
                        ) : (
                          <p className="text-xs text-amber-400 mt-1 flex items-center gap-1 justify-center"><Gem className="h-3 w-3" /> {cat.gemCost}</p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Backgrounds */}
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">✨ Décors</h3>
              <div className="grid grid-cols-2 gap-3">
                {BACKGROUNDS.map((bg) => {
                  const unlocked = isBackgroundUnlocked(bg.id)
                  const isSelected = selectedBackground === bg.id
                  const canAfford = gems >= bg.gemCost

                  return (
                    <Card
                      key={bg.id}
                      className={cn(
                        'cursor-pointer transition-all overflow-hidden',
                        isSelected && 'ring-2 ring-primary',
                        !unlocked && !canAfford && 'opacity-50'
                      )}
                      onClick={() => handleBackgroundClick(bg.id, bg.gemCost)}
                    >
                      <CardContent className="p-0">
                        {bg.image ? (
                          <div className="relative">
                            <img src={bg.image} alt={bg.name} className="w-full h-24 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-xs font-medium text-white">{bg.emoji} {bg.name}</p>
                              {unlocked ? (
                                isSelected && <span className="text-xs text-success">✓</span>
                              ) : (
                                <p className="text-xs text-amber-400 flex items-center gap-1"><Gem className="h-3 w-3" /> {bg.gemCost}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center h-24 flex flex-col items-center justify-center">
                            <span className="text-2xl">{bg.emoji}</span>
                            <p className="text-xs font-medium text-text mt-1">{bg.name}</p>
                            {isSelected && <span className="text-xs text-success">✓</span>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Current week bonus info */}
            {currentBonus > 0 && (
              <Card className="border-emerald-500/30 bg-emerald-500/10">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted">Bonus cette semaine</p>
                  <p className="text-2xl font-bold text-emerald-400">+{formatAmount(currentBonus)}</p>
                </CardContent>
              </Card>
            )}

            {/* Shop Items */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Augmenter ton budget
              </h2>

              <div className="space-y-4">
                {/* Talent-unlocked budget boosts */}
                {budgetBoosts.length > 0 ? (
                  budgetBoosts.map((boost) => {
                    const handleBuy = () => {
                      if (gems < boost.cost) {
                        toast.error('Pas assez de rubis')
                        return
                      }
                      spendGems(boost.cost)
                      addWeeklyBonus(boost.amount)
                      toast.success(`+${boost.amount} € de budget cette semaine !`, {
                        description: `-${boost.cost} rubis`,
                      })
                    }
                    return (
                      <Card key={`boost-${boost.amount}`} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-text text-lg">+{boost.amount} € de budget</h3>
                                <p className="text-sm text-muted mt-1">
                                  Ajoute {boost.amount} € à ta semaine en cours
                                </p>
                              </div>
                              <div className="text-4xl">💰</div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Gem className="h-5 w-5 text-amber-400" />
                                <span className="text-2xl font-bold text-amber-400">{boost.cost}</span>
                              </div>
                              <Button
                                onClick={handleBuy}
                                disabled={gems < boost.cost}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                              >
                                Échanger
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="overflow-hidden border-white/5">
                    <CardContent className="p-5 text-center">
                      <Lock className="h-8 w-8 text-white/20 mx-auto mb-2" />
                      <p className="text-sm text-muted">Aucun boost débloqué</p>
                      <p className="text-xs text-white/30 mt-1">Débloque des boosts via l'arbre de talents</p>
                      <Button
                        onClick={() => navigate('/talents')}
                        variant="outline"
                        className="mt-3 text-xs"
                      >
                        Voir l'arbre de talents
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Wheel of Fortune - locked by talent */}
                <Card className={cn(
                  'overflow-hidden border-purple-500/30',
                  wheelUnlocked
                    ? 'bg-gradient-to-br from-purple-500/10 to-transparent'
                    : 'opacity-50'
                )}>
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-text text-lg flex items-center gap-2">
                            Roue de la Chance
                            {!wheelUnlocked && <Lock className="h-4 w-4 text-white/30" />}
                          </h3>
                          {wheelUnlocked ? (
                            <>
                              <p className="text-sm text-muted mt-1">
                                Tente ta chance pour +30 € de budget !
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                                  {wheelChance}% de chance
                                </span>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted mt-1">
                              Talent "Roue de la chance" requis (Niv. 3)
                            </p>
                          )}
                        </div>
                        <div className="text-4xl">{wheelUnlocked ? '🎰' : '🔒'}</div>
                      </div>

                      {wheelUnlocked && (
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gem className="h-5 w-5 text-amber-400" />
                            <span className="text-2xl font-bold text-amber-400">5</span>
                          </div>
                          <Button
                            onClick={handleSpinWheel}
                            disabled={gems < 5}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Tourner
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* How it works */}
            <Card className="bg-white/5">
              <CardContent className="p-5">
                <h3 className="font-semibold text-text mb-3">Comment ça marche ?</h3>
                <div className="space-y-2 text-sm text-muted">
                  <p><Gem className="h-3.5 w-3.5 inline text-amber-400" /> Tu gagnes des <span className="text-primary">rubis</span> en restant sous budget chaque semaine</p>
                  <p>🌳 Débloque des <span className="text-amber-400">talents</span> pour accéder aux boosts budget et à la roue</p>
                  <p>🎰 La roue se débloque via le <span className="text-purple-400">talent Niv. 3</span></p>
                  <p>📈 Tes chances à la roue augmentent si tu perds !</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Wheel Dialog */}
      <Dialog open={showWheelDialog} onOpenChange={setShowWheelDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {isSpinning ? '🎰 La roue tourne...' : wheelResult === 'won' ? '🎉 JACKPOT !' : wheelResult === 'lost' ? '😢 Perdu...' : '🎰 Roue de la Chance'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isSpinning
                ? 'Croise les doigts !'
                : wheelResult === 'won'
                  ? '+30 € ajoutés à ton budget cette semaine !'
                  : wheelResult === 'lost'
                    ? `Pas de chance cette fois. Tes chances passent à ${getWheelWinChance()}% !`
                    : `Tu as ${wheelChance}% de chance de gagner`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            <div className={`text-8xl ${isSpinning ? 'animate-spin' : ''}`}>
              {isSpinning ? '🎰' : wheelResult === 'won' ? '🎁' : wheelResult === 'lost' ? '💨' : '🎰'}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2">
            {!wheelResult && !isSpinning && (
              <Button onClick={doSpin} className="w-full bg-gradient-to-r from-purple-500 to-purple-600">
                Tourner la roue (-5 rubis)
              </Button>
            )}
            {(wheelResult || isSpinning) && (
              <Button
                onClick={() => {
                  setShowWheelDialog(false)
                  setWheelResult(null)
                }}
                variant="outline"
                className="w-full"
                disabled={isSpinning}
              >
                Fermer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
