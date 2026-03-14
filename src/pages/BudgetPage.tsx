import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBudgetStore } from '@/stores/budgetStore'
import { useExpenseStore } from '@/stores/expenseStore'
import { WEEKLY_BUDGET } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Plus, Trash2, Pencil, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function BudgetPage() {
  const navigate = useNavigate()
  const {
    salary,
    fixedExpenses,
    setSalary,
    addFixedExpense,
    removeFixedExpense,
    updateFixedExpense,
    getTotalFixedExpenses,
    getMonthlyDisposable,
    getProjection,
  } = useBudgetStore()

  const { getTotalForMonth } = useExpenseStore()

  const [showSalaryDialog, setShowSalaryDialog] = useState(false)
  const [salaryInput, setSalaryInput] = useState(salary > 0 ? salary.toString() : '')

  const [showExpenseDialog, setShowExpenseDialog] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [expenseNameInput, setExpenseNameInput] = useState('')
  const [expenseAmountInput, setExpenseAmountInput] = useState('')

  const [showProjectionDialog, setShowProjectionDialog] = useState(false)
  const [projectionSpending, setProjectionSpending] = useState((WEEKLY_BUDGET * 4.33).toFixed(0))

  const totalFixed = getTotalFixedExpenses()
  const disposable = getMonthlyDisposable()
  const monthlySpent = getTotalForMonth()
  const weeklyBudgetMonthly = WEEKLY_BUDGET * 4.33

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const handleSaveSalary = () => {
    const parsed = parseFloat(salaryInput.replace(',', '.'))
    if (isNaN(parsed) || parsed < 0) {
      toast.error('Montant invalide')
      return
    }
    setSalary(parsed)
    setShowSalaryDialog(false)
    toast.success('Salaire mis à jour')
  }

  const handleOpenAddExpense = () => {
    setEditingExpenseId(null)
    setExpenseNameInput('')
    setExpenseAmountInput('')
    setShowExpenseDialog(true)
  }

  const handleOpenEditExpense = (id: string, name: string, amount: number) => {
    setEditingExpenseId(id)
    setExpenseNameInput(name)
    setExpenseAmountInput(amount.toString())
    setShowExpenseDialog(true)
  }

  const handleSaveExpense = () => {
    const name = expenseNameInput.trim()
    const amount = parseFloat(expenseAmountInput.replace(',', '.'))
    if (!name || isNaN(amount) || amount <= 0) {
      toast.error('Remplis le nom et un montant valide')
      return
    }

    if (editingExpenseId) {
      updateFixedExpense(editingExpenseId, name, amount)
      toast.success('Dépense modifiée')
    } else {
      addFixedExpense(name, amount)
      toast.success('Dépense ajoutée')
    }
    setShowExpenseDialog(false)
  }

  const handleDeleteExpense = (id: string) => {
    removeFixedExpense(id)
    toast('Dépense supprimée')
  }

  // Projection calculations
  const projectionMonthlySpend = parseFloat(projectionSpending.replace(',', '.')) || 0
  const projectionMonthly = disposable - projectionMonthlySpend
  const projections = [
    { label: '3 mois', value: getProjection(projectionMonthlySpend, 3) },
    { label: '6 mois', value: getProjection(projectionMonthlySpend, 6) },
    { label: '1 an', value: getProjection(projectionMonthlySpend, 12) },
    { label: '2 ans', value: getProjection(projectionMonthlySpend, 24) },
    { label: '5 ans', value: getProjection(projectionMonthlySpend, 60) },
  ]

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header - Mobile only */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-muted/20 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted hover:text-text" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-light">Budget</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-muted/10 px-8 py-6">
        <h1 className="text-2xl font-light text-text">Budget</h1>
        <p className="text-muted mt-1">Salaire, dépenses fixes et projections</p>
      </div>

      <div className="p-4 lg:p-8 space-y-6 max-w-md lg:max-w-2xl mx-auto lg:mx-0">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Salary */}
          <Card
            className="cursor-pointer hover:scale-[1.02] transition-all"
            onClick={() => {
              setSalaryInput(salary > 0 ? salary.toString() : '')
              setShowSalaryDialog(true)
            }}
          >
            <CardContent className="p-5">
              <p className="text-xs text-muted mb-1">Salaire mensuel</p>
              <p className="text-2xl font-bold text-emerald-400">
                {salary > 0 ? formatAmount(salary) : 'Non défini'}
              </p>
              <p className="text-xs text-muted mt-2">Tap pour modifier</p>
            </CardContent>
          </Card>

          {/* Disposable */}
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted mb-1">Reste après fixes</p>
              <p className={cn('text-2xl font-bold', disposable >= 0 ? 'text-text' : 'text-red-400')}>
                {salary > 0 ? formatAmount(disposable) : '—'}
              </p>
              <p className="text-xs text-muted mt-2">
                Fixes: {formatAmount(totalFixed)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget hebdo context */}
        {salary > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted">Budget hebdo actuel</p>
                  <p className="text-xl font-bold text-primary">{formatAmount(WEEKLY_BUDGET)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">~{formatAmount(weeklyBudgetMonthly)}/mois</p>
                  <p className={cn(
                    'text-sm font-medium',
                    disposable - weeklyBudgetMonthly >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {disposable - weeklyBudgetMonthly >= 0 ? '+' : ''}{formatAmount(disposable - weeklyBudgetMonthly)} restant
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fixed Expenses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-text">Dépenses incompressibles</h2>
            <Button
              onClick={handleOpenAddExpense}
              size="sm"
              className="bg-primary hover:bg-primary-deep text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {fixedExpenses.length === 0 ? (
            <Card className="border-dashed border-2 border-primary/20 bg-transparent">
              <CardContent className="py-8 text-center">
                <p className="text-muted text-sm">
                  Aucune dépense fixe. Ajoute ton loyer, abonnements, etc.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {fixedExpenses.map((expense) => (
                <Card key={expense.id} className="hover:bg-white/5 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">{expense.name}</p>
                      <p className="text-lg font-bold text-text">{formatAmount(expense.amount)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditExpense(expense.id, expense.name, expense.amount)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted hover:text-text"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-muted hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Total */}
              <div className="pt-2 flex justify-between items-center px-1">
                <span className="text-sm text-muted">Total mensuel</span>
                <span className="text-lg font-bold text-text">{formatAmount(totalFixed)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Projections */}
        {salary > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-text flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Projections
              </h2>
              <Button
                onClick={() => setShowProjectionDialog(true)}
                size="sm"
                variant="outline"
                className="rounded-xl"
              >
                Ajuster
              </Button>
            </div>

            <Card className="bg-muted/5">
              <CardContent className="p-5">
                <p className="text-sm text-muted mb-1">
                  Si tu dépenses <span className="text-primary font-medium">{formatAmount(projectionMonthlySpend)}</span>/mois en achats :
                </p>
                <p className="text-xs text-muted mb-4">
                  ({formatAmount(projectionMonthly)}/mois {projectionMonthly >= 0 ? 'économisés' : 'de déficit'})
                </p>

                <div className="space-y-3">
                  {projections.map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm text-muted">Dans {label}</span>
                      <span className={cn(
                        'text-sm font-bold',
                        value >= 0 ? 'text-emerald-400' : 'text-red-400'
                      )}>
                        {value >= 0 ? '+' : ''}{formatAmount(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current month context */}
            <Card className="mt-3">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Dépensé ce mois</span>
                  <span className="text-sm font-bold text-text">{formatAmount(monthlySpent)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Salary Dialog */}
      <Dialog open={showSalaryDialog} onOpenChange={setShowSalaryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salaire mensuel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="1500"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                className="w-full text-3xl font-light text-center bg-muted/10 border border-muted/20 rounded-xl py-4 px-4 text-text placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-light text-muted">€</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveSalary}
              className="w-full bg-primary hover:bg-primary-deep text-white"
            >
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fixed Expense Dialog */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingExpenseId ? 'Modifier la dépense' : 'Nouvelle dépense fixe'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <input
              type="text"
              placeholder="Ex: Loyer, Netflix, Assurance..."
              value={expenseNameInput}
              onChange={(e) => setExpenseNameInput(e.target.value)}
              className="w-full text-sm bg-muted/10 border border-muted/20 rounded-xl py-3 px-4 text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="50"
                value={expenseAmountInput}
                onChange={(e) => setExpenseAmountInput(e.target.value)}
                className="w-full text-2xl font-light text-center bg-muted/10 border border-muted/20 rounded-xl py-3 px-4 text-text placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-light text-muted">€/mois</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveExpense}
              className="w-full bg-primary hover:bg-primary-deep text-white"
            >
              {editingExpenseId ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Projection Dialog */}
      <Dialog open={showProjectionDialog} onOpenChange={setShowProjectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajuster la projection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted mb-4">
              Estime tes dépenses mensuelles en achats (courses, restos, loisirs...)
            </p>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="400"
                value={projectionSpending}
                onChange={(e) => setProjectionSpending(e.target.value)}
                className="w-full text-3xl font-light text-center bg-muted/10 border border-muted/20 rounded-xl py-4 px-4 text-text placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-light text-muted">€/mois</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowProjectionDialog(false)}
              className="w-full bg-primary hover:bg-primary-deep text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
