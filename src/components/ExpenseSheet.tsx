import { useExpenseStore } from '@/stores/expenseStore'
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_EMOJIS,
} from '@/lib/constants'
import { X } from 'lucide-react'

interface ExpenseSheetProps {
  open: boolean
  onClose: () => void
}

export function ExpenseSheet({ open, onClose }: ExpenseSheetProps) {
  const { getExpensesForWeek, getCategoryBreakdown } = useExpenseStore()
  const weekExpenses = getExpensesForWeek()
  const categoryBreakdown = getCategoryBreakdown(weekExpenses)

  const sortedCategories = Object.entries(categoryBreakdown)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '75vh' }}
      >
        <div className="bg-[#0F0A1A] border-t border-white/10 rounded-t-3xl flex flex-col" style={{ maxHeight: '75vh' }}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 className="text-lg font-bold text-white">
              Dépenses de la semaine ({weekExpenses.length})
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto px-5 pb-6">
            {/* Category tags */}
            {sortedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {sortedCategories.map(([cat, amount]) => (
                  <span
                    key={cat}
                    className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-white/70"
                  >
                    {EXPENSE_CATEGORY_EMOJIS[cat as keyof typeof EXPENSE_CATEGORY_EMOJIS]}{' '}
                    {EXPENSE_CATEGORY_LABELS[cat as keyof typeof EXPENSE_CATEGORY_LABELS]}:{' '}
                    {formatAmount(amount)}
                  </span>
                ))}
              </div>
            )}

            {/* Expense list */}
            {weekExpenses.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-white font-medium">Aucune dépense cette semaine</p>
                <p className="text-sm text-white/50 mt-1">Continue comme ça !</p>
              </div>
            ) : (
              <div className="space-y-2">
                {weekExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {EXPENSE_CATEGORY_EMOJIS[expense.category]}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {expense.description || EXPENSE_CATEGORY_LABELS[expense.category]}
                        </p>
                        <p className="text-xs text-white/40">
                          {new Date(expense.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                          {!expense.forSelf && ' · Pour quelqu\'un'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">{formatAmount(expense.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
