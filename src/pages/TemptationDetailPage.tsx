import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  getTemptationById,
  getTimeRemaining,
  markAsCracked,
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
} from '@/features/temptation/temptationService'
import { TimerCircle } from '@/components/TimerCircle'
import { useGamificationStore } from '@/stores/gamificationStore'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'

export function TemptationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addXP } = useGamificationStore()
  const [showConfirm, setShowConfirm] = useState(false)

  const temptation = id ? getTemptationById(id) : null

  if (!temptation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-muted mb-6">Tentation introuvable</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-deep text-white rounded-xl"
          >
            Retour
          </Button>
        </div>
      </div>
    )
  }

  const remaining = getTimeRemaining(temptation)
  const isActive = temptation.status === 'active'
  const isResisted = temptation.status === 'resisted'

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCrack = () => {
    if (!id) return
    markAsCracked(id)
    addXP(5)
    toast('Depense consciente notee', {
      description: '+5 XP - La conscience, c\'est deja une victoire !',
      duration: 4000,
    })
    setShowConfirm(false)
    navigate('/')
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-muted/20 px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted hover:text-text" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-light">Details</h1>
        </div>

        <div className="max-w-md mx-auto">
          {/* Photo Hero */}
          {temptation.photoUrl ? (
            <div className="relative">
              <img
                src={temptation.photoUrl}
                alt="Tentation"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center bg-primary/5">
              <span className="text-6xl">{CATEGORY_EMOJIS[temptation.category]}</span>
            </div>
          )}

          <div className="p-6 space-y-8 -mt-8 relative">
            {/* Amount Card */}
            <div className="bg-surface rounded-2xl p-6 shadow-xl shadow-primary/5 border border-muted/10">
              <div className="text-center">
                <p className="text-4xl font-light text-primary mb-1">
                  {formatAmount(temptation.amount)}
                </p>
                <p className="text-sm text-muted">
                  {CATEGORY_EMOJIS[temptation.category]} {CATEGORY_LABELS[temptation.category]}
                </p>
              </div>
            </div>

            {/* Timer / Status */}
            <div className="text-center py-4">
              {isActive ? (
                <>
                  <p className="text-sm text-muted mb-4">Temps restant</p>
                  <TimerCircle remaining={remaining} size="lg" />
                  <p className="text-xs text-muted mt-4">
                    Tiens bon, tu y es presque
                  </p>
                </>
              ) : (
                <div className="py-4">
                  {isResisted ? (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                        <span className="text-3xl">✓</span>
                      </div>
                      <p className="text-xl font-light text-success">Resiste</p>
                      <p className="text-sm text-muted mt-1">Bravo, tu as tenu !</p>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 mb-4">
                        <span className="text-3xl">✗</span>
                      </div>
                      <p className="text-xl font-light text-warning">Craque</p>
                      <p className="text-sm text-muted mt-1">Ce n'est pas grave</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-3 border-b border-muted/10">
                <span className="text-muted">Cree le</span>
                <span>{formatDate(temptation.createdAt)}</span>
              </div>
              {temptation.resolvedAt && (
                <div className="flex justify-between py-3">
                  <span className="text-muted">{isResisted ? 'Resiste le' : 'Craque le'}</span>
                  <span>{formatDate(temptation.resolvedAt)}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {isActive && (
              <div className="pt-4">
                <Button
                  onClick={() => setShowConfirm(true)}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-warning/30 text-warning hover:bg-warning/5"
                >
                  J'ai craque
                </Button>
                <p className="text-center text-xs text-muted mt-3">
                  +5 XP pour la conscience
                </p>
              </div>
            )}

            {/* Motivation */}
            {isActive && (
              <div className="text-center py-6 bg-primary/5 rounded-2xl">
                <p className="text-2xl mb-2">💜</p>
                <p className="text-sm text-muted">
                  Chaque minute compte.<br />
                  Tu es plus forte que cette envie.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-light text-xl">Tu es sure ?</DialogTitle>
            <DialogDescription className="text-muted">
              Ce n'est pas grave de craquer parfois. L'important c'est d'en etre consciente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="flex-1 h-12 rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCrack}
              className="flex-1 h-12 rounded-xl bg-warning hover:bg-warning/90 text-white"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
