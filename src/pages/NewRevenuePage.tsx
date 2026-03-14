import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useRevenueStore } from '@/stores/revenueStore'
import {
  REVENUE_SOURCES,
  REVENUE_SOURCE_LABELS,
  REVENUE_SOURCE_EMOJIS,
  type RevenueSource,
} from '@/lib/constants'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NewRevenuePage() {
  const navigate = useNavigate()
  const { addRevenue } = useRevenueStore()

  const [amount, setAmount] = useState('')
  const [source, setSource] = useState<RevenueSource | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!amount || !source) return

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Entre un montant valide')
      return
    }

    setIsSubmitting(true)

    try {
      addRevenue({
        amount: parsedAmount,
        source,
        description: description.trim(),
      })

      toast.success(`Revenu de ${parsedAmount.toFixed(2)} € ajouté`, {
        description: REVENUE_SOURCE_LABELS[source],
      })

      navigate('/')
    } catch (error) {
      console.error('Error creating revenue:', error)
      toast.error('Erreur lors de l\'ajout')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = amount && source && parseFloat(amount.replace(',', '.')) > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile only */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-muted/20 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted hover:text-text" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-light">Nouveau revenu</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-muted/10 px-8 py-6">
        <h1 className="text-2xl font-light text-text">Nouveau revenu</h1>
        <p className="text-muted mt-1">Enregistre un revenu</p>
      </div>

      <div className="p-6 lg:p-8 space-y-8 max-w-md mx-auto lg:mx-0">
        {/* Amount */}
        <div className="text-center">
          <p className="text-sm text-muted mb-4">Combien ?</p>
          <div className="relative inline-block">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-48 text-5xl font-light text-center bg-transparent border-none outline-none text-text placeholder:text-muted/30"
            />
            <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-3xl font-light text-muted">€</span>
          </div>
        </div>

        {/* Source */}
        <div>
          <p className="text-sm text-muted mb-4 text-center">Source</p>
          <div className="grid grid-cols-3 gap-2">
            {REVENUE_SOURCES.map((src) => (
              <button
                key={src}
                onClick={() => setSource(src)}
                className={cn(
                  'py-4 rounded-2xl flex flex-col items-center gap-2 transition-all',
                  source === src
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-muted/5 hover:bg-muted/10'
                )}
              >
                <span className="text-2xl">{REVENUE_SOURCE_EMOJIS[src]}</span>
                <span className={cn(
                  'text-xs',
                  source === src ? 'text-primary font-medium' : 'text-muted'
                )}>
                  {REVENUE_SOURCE_LABELS[src]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted mb-4 text-center">Description (optionnel)</p>
          <input
            type="text"
            placeholder="Ex: Salaire mars, Cadeau mamie..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm bg-muted/10 border border-muted/20 rounded-xl py-3 px-4 text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full h-14 text-lg font-light bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-600/20 transition-all disabled:opacity-40 disabled:shadow-none"
          >
            {isSubmitting ? 'Ajout...' : 'Ajouter le revenu'}
          </Button>
        </div>
      </div>
    </div>
  )
}
