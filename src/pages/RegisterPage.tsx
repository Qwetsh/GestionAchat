import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PinInput } from '@/features/auth/PinInput'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

type Step = 'create' | 'confirm'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [step, setStep] = useState<Step>('create')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handlePinChange = (value: string) => {
    setPin(value)
    setLocalError(null)
    clearError()
  }

  const handleConfirmPinChange = (value: string) => {
    setConfirmPin(value)
    setLocalError(null)
    clearError()
  }

  const handleContinue = () => {
    if (pin.length !== 4) {
      setLocalError('Le code PIN doit contenir 4 chiffres')
      return
    }
    setStep('confirm')
  }

  const handleRegister = async () => {
    if (confirmPin.length !== 4) {
      setLocalError('Le code PIN doit contenir 4 chiffres')
      return
    }

    if (pin !== confirmPin) {
      setLocalError('Les codes PIN ne correspondent pas')
      setConfirmPin('')
      return
    }

    const success = await register(pin)
    if (success) {
      toast.success('Bienvenue ! Prête à résister ? 💪', {
        description: 'Ton compte a été créé avec succès.',
        duration: 4000,
      })
      navigate('/')
    }
  }

  const handleBack = () => {
    setStep('create')
    setConfirmPin('')
    setLocalError(null)
    clearError()
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-text mb-2">
            {step === 'create' ? 'Bienvenue' : 'Confirme'}
          </h1>
          <p className="text-muted">
            {step === 'create'
              ? 'Choisis un code a 4 chiffres'
              : 'Entre a nouveau ton code'}
          </p>
        </div>

        <Card className="border-muted/20 shadow-xl shadow-primary/5">
          <CardContent className="p-8 space-y-8">
            {step === 'create' ? (
              <PinInput
                value={pin}
                onChange={handlePinChange}
                error={!!displayError}
                disabled={isLoading}
              />
            ) : (
              <PinInput
                value={confirmPin}
                onChange={handleConfirmPinChange}
                error={!!displayError}
                disabled={isLoading}
              />
            )}

            {displayError && (
              <p className="text-center text-sm text-warning animate-in fade-in">
                {displayError}
              </p>
            )}

            <div className="flex gap-3">
              {step === 'confirm' && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-xl border-muted/30"
                >
                  Retour
                </Button>
              )}

              <Button
                onClick={step === 'create' ? handleContinue : handleRegister}
                disabled={isLoading || (step === 'create' ? pin.length !== 4 : confirmPin.length !== 4)}
                className="flex-1 h-12 bg-primary hover:bg-primary-deep text-white rounded-xl font-light"
              >
                {isLoading ? 'Creation...' : step === 'create' ? 'Continuer' : 'Creer mon compte'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted mt-6">
          Ton code est stocke de maniere securisee
        </p>
      </div>
    </div>
  )
}
