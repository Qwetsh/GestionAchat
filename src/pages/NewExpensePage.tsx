import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useExpenseStore } from '@/stores/expenseStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_EMOJIS,
  XP_REWARDS,
  type ExpenseCategory,
} from '@/lib/constants'
import { toast } from 'sonner'
import { ArrowLeft, User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NewExpensePage() {
  const navigate = useNavigate()
  const { addExpense } = useExpenseStore()
  const { addXP } = useGamificationStore()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory | null>(null)
  const [forSelf, setForSelf] = useState(true)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!amount || !category) return

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Entre un montant valide')
      return
    }

    setIsSubmitting(true)

    try {
      addExpense({
        amount: parsedAmount,
        category,
        forSelf,
        description: description.trim(),
      })

      addXP(XP_REWARDS.ADD_EXPENSE)

      toast.success(`Dépense de ${parsedAmount.toFixed(2)} € ajoutée`, {
        description: `+${XP_REWARDS.ADD_EXPENSE} XP${!forSelf ? ' · Pour quelqu\'un' : ''}`,
      })

      navigate('/')
    } catch (error) {
      console.error('Error creating expense:', error)
      toast.error('Erreur lors de l\'ajout')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = amount && category && parseFloat(amount.replace(',', '.')) > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile only */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-muted/20 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted hover:text-text" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-light">Nouvelle dépense</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-muted/10 px-8 py-6">
        <h1 className="text-2xl font-light text-text">Nouvelle dépense</h1>
        <p className="text-muted mt-1">Enregistre une dépense</p>
      </div>

      <div className="p-6 lg:p-8 space-y-8 max-w-md mx-auto lg:mx-0">
        {/* Amount Section */}
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

        {/* Category Section */}
        <div>
          <p className="text-sm text-muted mb-4 text-center">Catégorie</p>
          <div className="grid grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'py-4 rounded-2xl flex flex-col items-center gap-2 transition-all',
                  category === cat
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-muted/5 hover:bg-muted/10'
                )}
              >
                <span className="text-2xl">{EXPENSE_CATEGORY_EMOJIS[cat]}</span>
                <span className={cn(
                  'text-xs text-center leading-tight px-1',
                  category === cat ? 'text-primary font-medium' : 'text-muted'
                )}>
                  {EXPENSE_CATEGORY_LABELS[cat]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* For Self / For Someone */}
        <div>
          <p className="text-sm text-muted mb-4 text-center">C'est pour qui ?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setForSelf(true)}
              className={cn(
                'py-4 rounded-2xl flex flex-col items-center gap-2 transition-all',
                forSelf
                  ? 'bg-primary/10 ring-2 ring-primary'
                  : 'bg-muted/5 hover:bg-muted/10'
              )}
            >
              <User className={cn('h-6 w-6', forSelf ? 'text-primary' : 'text-muted')} />
              <span className={cn('text-sm', forSelf ? 'text-primary font-medium' : 'text-muted')}>
                Pour moi
              </span>
            </button>
            <button
              onClick={() => setForSelf(false)}
              className={cn(
                'py-4 rounded-2xl flex flex-col items-center gap-2 transition-all',
                !forSelf
                  ? 'bg-primary/10 ring-2 ring-primary'
                  : 'bg-muted/5 hover:bg-muted/10'
              )}
            >
              <Users className={cn('h-6 w-6', !forSelf ? 'text-primary' : 'text-muted')} />
              <span className={cn('text-sm', !forSelf ? 'text-primary font-medium' : 'text-muted')}>
                Pour quelqu'un
              </span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted mb-4 text-center">Description (optionnel)</p>
          <input
            type="text"
            placeholder="Ex: Courses Leclerc, Cadeau maman..."
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
            className="w-full h-14 text-lg font-light bg-primary hover:bg-primary-deep text-white rounded-2xl shadow-xl shadow-primary/20 transition-all disabled:opacity-40 disabled:shadow-none"
          >
            {isSubmitting ? 'Ajout...' : 'Ajouter la dépense'}
          </Button>

          <p className="text-center text-xs text-muted mt-4">
            <span className="text-primary">+{XP_REWARDS.ADD_EXPENSE} XP</span> pour chaque dépense enregistrée
          </p>
        </div>
      </div>
    </div>
  )
}
