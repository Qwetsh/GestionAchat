import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGemStore } from '@/stores/gemStore'
import { useMascotStore, CAT_SKINS, BACKGROUNDS } from '@/stores/mascotStore'
import { getStats } from '@/features/temptation/temptationService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CatMascot } from '@/components/CatMascot'
import { ArrowLeft, Gift, Sparkles, RotateCcw } from 'lucide-react'
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
  const stats = getStats()
  const {
    getGems,
    spendGems,
    addVoucher,
    getActiveVouchers,
    useVoucher,
    getWheelWinChance,
    spinWheel,
  } = useGemStore()

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

  const gems = getGems(stats.totalSaved)
  const vouchers = getActiveVouchers()
  const wheelChance = getWheelWinChance()

  const [showWheelDialog, setShowWheelDialog] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelResult, setWheelResult] = useState<'won' | 'lost' | null>(null)
  const [showVoucherDialog, setShowVoucherDialog] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'vouchers' | 'mascot'>('vouchers')

  const handleBuyDirect = () => {
    if (gems < 20) {
      toast.error('Pas assez de gemmes', {
        description: 'Il te faut 20 gemmes pour acheter un bon',
      })
      return
    }

    spendGems(20)
    addVoucher('direct', 20)
    toast.success('Bon d\'achat obtenu !', {
      description: 'Tu peux maintenant acheter quelque chose ≤ 20€',
    })
  }

  const handleSpinWheel = () => {
    if (gems < 10) {
      toast.error('Pas assez de gemmes', {
        description: 'Il te faut 10 gemmes pour tourner la roue',
      })
      return
    }

    setShowWheelDialog(true)
    setWheelResult(null)
  }

  const doSpin = () => {
    spendGems(10)
    setIsSpinning(true)

    setTimeout(() => {
      const won = spinWheel()
      setWheelResult(won ? 'won' : 'lost')
      setIsSpinning(false)

      if (won) {
        addVoucher('wheel', 30)
        toast.success('🎉 Jackpot !', {
          description: 'Tu as gagné un bon d\'achat ≤ 30€ !',
        })
      }
    }, 2000)
  }

  const handleUseVoucher = (id: string) => {
    setSelectedVoucher(id)
    setShowVoucherDialog(true)
  }

  const confirmUseVoucher = () => {
    if (selectedVoucher) {
      useVoucher(selectedVoucher)
      setShowVoucherDialog(false)
      setSelectedVoucher(null)
      toast.success('Bon utilisé !', {
        description: 'Profite bien de ton achat sans culpabilité 🎁',
      })
    }
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
      toast.success('Nouveau chat débloqué ! 🐱')
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
      toast.success('Nouveau fond débloqué ! ✨')
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
          <div className="ml-auto flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
            <span className="text-xl">💎</span>
            <span className="text-xl font-bold text-amber-400">{gems}</span>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab('vouchers')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all',
              activeTab === 'vouchers'
                ? 'bg-primary text-white'
                : 'text-muted hover:text-text'
            )}
          >
            🎁 Bons d'achat
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
            <Card className="text-center">
              <CardContent className="py-8">
                <CatMascot size="lg" className="mx-auto mb-4" />
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
              <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                🐱 Chatons
              </h3>
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
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm font-medium text-text">
                          {cat.emoji} {cat.name}
                        </p>
                        {unlocked ? (
                          <p className="text-xs text-success mt-1">
                            {isSelected ? '✓ Sélectionné' : 'Débloqué'}
                          </p>
                        ) : (
                          <p className="text-xs text-amber-400 mt-1 flex items-center justify-center gap-1">
                            💎 {cat.gemCost}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Backgrounds */}
            <div>
              <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                ✨ Fonds
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {BACKGROUNDS.map((bg) => {
                  const unlocked = isBackgroundUnlocked(bg.id)
                  const isSelected = selectedBackground === bg.id
                  const canAfford = gems >= bg.gemCost

                  return (
                    <Card
                      key={bg.id}
                      className={cn(
                        'cursor-pointer transition-all',
                        isSelected && 'ring-2 ring-primary',
                        !unlocked && !canAfford && 'opacity-50'
                      )}
                      onClick={() => handleBackgroundClick(bg.id, bg.gemCost)}
                    >
                      <CardContent className="p-3 text-center">
                        <span className="text-2xl">{bg.emoji}</span>
                        <p className="text-xs font-medium text-text mt-1">
                          {bg.name}
                        </p>
                        {unlocked ? (
                          <p className="text-xs text-success mt-1">
                            {isSelected ? '✓' : ''}
                          </p>
                        ) : bg.gemCost > 0 ? (
                          <p className="text-xs text-amber-400 mt-1">
                            💎 {bg.gemCost}
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Active Vouchers */}
            {vouchers.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Mes bons d'achat
                </h2>
                <div className="space-y-3">
                  {vouchers.map((voucher) => (
                    <Card
                      key={voucher.id}
                      className="border-success/30 bg-success/10 cursor-pointer hover:scale-[1.01] transition-all"
                      onClick={() => handleUseVoucher(voucher.id)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-text">
                            Bon {voucher.type === 'wheel' ? '🎰' : '💎'} ≤ {formatAmount(voucher.maxAmount)}
                          </p>
                          <p className="text-sm text-muted">
                            Clique pour utiliser
                          </p>
                        </div>
                        <div className="text-3xl">🎁</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Shop Items */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Échanger des gemmes
              </h2>

              <div className="space-y-4">
                {/* Direct Purchase */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-text text-lg">Achat Direct</h3>
                          <p className="text-sm text-muted mt-1">
                            Obtiens un bon d'achat ≤ 20€ sans culpabilité
                          </p>
                        </div>
                        <div className="text-4xl">🛍️</div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💎</span>
                          <span className="text-2xl font-bold text-amber-400">20</span>
                        </div>
                        <Button
                          onClick={handleBuyDirect}
                          disabled={gems < 20}
                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                        >
                          Échanger
                        </Button>
                      </div>
                    </div>

                    {gems < 20 && (
                      <div className="px-5 pb-4">
                        <p className="text-xs text-muted mb-2">
                          Encore {20 - gems} gemme{20 - gems > 1 ? 's' : ''} ({formatAmount((20 - gems) * 10)} à économiser)
                        </p>
                        <Progress value={(gems / 20) * 100} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Wheel of Fortune */}
                <Card className="overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-text text-lg">Roue de la Chance</h3>
                          <p className="text-sm text-muted mt-1">
                            Tente ta chance pour un bon ≤ 30€ !
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                              {wheelChance}% de chance
                            </span>
                          </div>
                        </div>
                        <div className="text-4xl">🎰</div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💎</span>
                          <span className="text-2xl font-bold text-amber-400">10</span>
                        </div>
                        <Button
                          onClick={handleSpinWheel}
                          disabled={gems < 10}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Tourner
                        </Button>
                      </div>
                    </div>

                    {gems < 10 && (
                      <div className="px-5 pb-4">
                        <p className="text-xs text-muted mb-2">
                          Encore {10 - gems} gemme{10 - gems > 1 ? 's' : ''} ({formatAmount((10 - gems) * 10)} à économiser)
                        </p>
                        <Progress value={(gems / 10) * 100} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* How it works */}
            <Card className="bg-white/5">
              <CardContent className="p-5">
                <h3 className="font-semibold text-text mb-3">Comment ça marche ?</h3>
                <div className="space-y-2 text-sm text-muted">
                  <p>💎 Tu gagnes <span className="text-primary">1 gemme</span> tous les 10€ économisés</p>
                  <p>🛍️ <span className="text-amber-400">20 gemmes</span> = bon d'achat garanti ≤ 20€</p>
                  <p>🎰 <span className="text-purple-400">10 gemmes</span> = roue avec chance de gagner ≤ 30€</p>
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
                  ? 'Tu as gagné un bon d\'achat ≤ 30€ !'
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
                Tourner la roue (-10 💎)
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

      {/* Use Voucher Dialog */}
      <Dialog open={showVoucherDialog} onOpenChange={setShowVoucherDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Utiliser ce bon ?</DialogTitle>
            <DialogDescription>
              Une fois utilisé, ce bon sera marqué comme consommé. Assure-toi d'avoir fait ton achat !
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowVoucherDialog(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmUseVoucher}
              className="flex-1 bg-success hover:bg-success/90"
            >
              J'ai acheté ! 🎁
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
