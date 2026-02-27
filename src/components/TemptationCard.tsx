import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TimerCircle } from '@/components/TimerCircle'
import {
  type Temptation,
  getTimeRemaining,
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
} from '@/features/temptation/temptationService'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TemptationCardProps {
  temptation: Temptation
  onCrack?: (id: string) => void
  compact?: boolean
}

export function TemptationCard({ temptation, onCrack, compact = false }: TemptationCardProps) {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const remaining = getTimeRemaining(temptation)
  const isActive = temptation.status === 'active'
  const isResisted = temptation.status === 'resisted'
  const isCracked = temptation.status === 'cracked'

  const handleCrack = () => {
    setShowConfirm(false)
    onCrack?.(temptation.id)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Card
        className={cn(
          'overflow-hidden transition-all cursor-pointer hover:shadow-lg border-muted/30',
          isResisted && 'border-success/30 bg-success/5',
          isCracked && 'border-warning/30 bg-warning/5 opacity-60'
        )}
        onClick={() => navigate(`/temptation/${temptation.id}`)}
      >
        <CardContent className={cn('p-4', compact && 'p-3')}>
          <div className="flex gap-4">
            {/* Photo */}
            {temptation.photoUrl ? (
              <div
                className={cn(
                  'flex-shrink-0 rounded-xl overflow-hidden bg-muted/30',
                  compact ? 'w-16 h-16' : 'w-20 h-20'
                )}
              >
                <img
                  src={temptation.photoUrl}
                  alt="Tentation"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  'flex-shrink-0 rounded-xl bg-primary/5 flex items-center justify-center',
                  compact ? 'w-16 h-16' : 'w-20 h-20'
                )}
              >
                <span className="text-2xl">
                  {CATEGORY_EMOJIS[temptation.category]}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-lg text-text">
                    {formatAmount(temptation.amount)}
                  </p>
                  <p className="text-sm text-muted">
                    {CATEGORY_EMOJIS[temptation.category]}{' '}
                    {CATEGORY_LABELS[temptation.category]}
                  </p>
                </div>

                {/* Timer or Status */}
                {isActive ? (
                  <TimerCircle remaining={remaining} size="sm" />
                ) : (
                  <div
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      isResisted && 'bg-success/20 text-success',
                      isCracked && 'bg-warning/20 text-warning'
                    )}
                  >
                    {isResisted ? '✓ Résisté' : '× Craqué'}
                  </div>
                )}
              </div>

              {/* Date and action */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted">
                  {formatDate(temptation.createdAt)}
                </p>

                {isActive && onCrack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowConfirm(true)
                    }}
                    className="text-warning hover:text-warning hover:bg-warning/10 h-7 px-2 text-xs"
                  >
                    J'ai craque
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tu es sûre ?</DialogTitle>
            <DialogDescription>
              Ce n'est pas grave de craquer parfois. L'important c'est d'en être consciente !
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
              Oui, j'ai craqué
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
