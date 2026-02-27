import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PinInput } from '@/features/auth/PinInput'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-text">
            {step === 'create' ? 'Crée ton code PIN' : 'Confirme ton code'}
          </CardTitle>
          <CardDescription className="text-muted">
            {step === 'create'
              ? 'Choisis un code à 4 chiffres pour sécuriser ton app'
              : 'Entre à nouveau ton code pour confirmer'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
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
            <p className="text-center text-sm text-red-600 animate-in fade-in">
              {displayError}
            </p>
          )}

          <div className="flex gap-3">
            {step === 'confirm' && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1"
              >
                Retour
              </Button>
            )}

            <Button
              onClick={step === 'create' ? handleContinue : handleRegister}
              disabled={isLoading || (step === 'create' ? pin.length !== 4 : confirmPin.length !== 4)}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? 'Création...' : step === 'create' ? 'Continuer' : 'Créer mon compte'}
            </Button>
          </div>

          <p className="text-center text-xs text-muted">
            Ton code est stocké de manière sécurisée et ne sera jamais partagé.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
