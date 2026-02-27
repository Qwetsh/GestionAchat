import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { ArrowLeft, Calendar, Tag, Euro, Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-4xl mb-3">404</p>
            <p className="text-muted mb-4">Tentation non trouvee</p>
            <Button onClick={() => navigate('/')}>Retour</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const remaining = getTimeRemaining(temptation)
  const isActive = temptation.status === 'active'
  const isResisted = temptation.status === 'resisted'
  const isCracked = temptation.status === 'cracked'

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
      year: 'numeric',
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
      <div className="min-h-screen bg-background pb-6">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Details</h1>
        </div>

        <div className="p-4 space-y-4 max-w-md mx-auto">
          {/* Photo */}
          {temptation.photoUrl && (
            <Card className="overflow-hidden">
              <img
                src={temptation.photoUrl}
                alt="Tentation"
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Status & Timer */}
          <Card
            className={cn(
              'overflow-hidden',
              isResisted && 'border-success/50 bg-success/5',
              isCracked && 'border-warning/50 bg-warning/5'
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  {isActive ? (
                    <>
                      <p className="text-sm text-muted mb-1">Temps restant</p>
                      <TimerCircle remaining={remaining} size="lg" />
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isResisted ? (
                        <>
                          <CheckCircle className="h-8 w-8 text-success" />
                          <div>
                            <p className="font-bold text-success">Resiste !</p>
                            <p className="text-sm text-muted">Bravo, tu as tenu !</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-8 w-8 text-warning" />
                          <div>
                            <p className="font-bold text-warning">Craque</p>
                            <p className="text-sm text-muted">Ce n'est pas grave !</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {isActive && (
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(true)}
                    className="text-warning border-warning hover:bg-warning/10"
                  >
                    J'ai craque
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardContent className="p-5 space-y-4">
              {/* Amount */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Euro className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Montant</p>
                  <p className="text-2xl font-bold">{formatAmount(temptation.amount)}</p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Tag className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Categorie</p>
                  <p className="font-medium">
                    {CATEGORY_EMOJIS[temptation.category]} {CATEGORY_LABELS[temptation.category]}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <p className="text-sm text-muted">Cree le</p>
                  <p className="font-medium">{formatDate(temptation.createdAt)}</p>
                </div>
              </div>

              {/* Resolved Date */}
              {temptation.resolvedAt && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isResisted ? 'bg-success/10' : 'bg-warning/10'
                  )}>
                    <Clock className={cn(
                      'h-5 w-5',
                      isResisted ? 'text-success' : 'text-warning'
                    )} />
                  </div>
                  <div>
                    <p className="text-sm text-muted">
                      {isResisted ? 'Resiste le' : 'Craque le'}
                    </p>
                    <p className="font-medium">{formatDate(temptation.resolvedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Motivation */}
          {isActive && (
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-5 text-center">
                <p className="text-4xl mb-2">💪</p>
                <p className="font-medium text-text">Tu peux le faire !</p>
                <p className="text-sm text-muted mt-1">
                  Chaque minute qui passe te rapproche de la victoire.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tu es sure ?</DialogTitle>
            <DialogDescription>
              Ce n'est pas grave de craquer parfois. L'important c'est d'en etre consciente !
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCrack}
              className="flex-1 bg-warning hover:bg-warning/90 text-white"
            >
              Oui, j'ai craque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
