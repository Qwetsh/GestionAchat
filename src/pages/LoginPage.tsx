import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PinInput } from '@/features/auth/PinInput'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  const [pin, setPin] = useState('')

  const handleLogin = async () => {
    if (pin.length !== 4) {
      return
    }

    const success = await login(pin)
    if (success) {
      toast.success('Content de te revoir ! 👋', {
        duration: 3000,
      })
      navigate('/')
    }
  }

  // Auto-submit when PIN is complete
  const handlePinComplete = (value: string) => {
    setPin(value)
    clearError()
    if (value.length === 4) {
      // Small delay to show the last digit
      setTimeout(() => {
        login(value).then((success) => {
          if (success) {
            toast.success('Content de te revoir ! 👋', {
              duration: 3000,
            })
            navigate('/')
          }
        })
      }, 150)
    }
  }

  return (
    <div className="min-h-screen lg:min-h-0 lg:h-full flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm lg:max-w-none">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-text mb-2">Bon retour</h1>
          <p className="text-muted">Entre ton code PIN</p>
        </div>

        <Card className="border-muted/20 shadow-xl shadow-primary/5">
          <CardContent className="p-8 space-y-8">
            <PinInput
              value={pin}
              onChange={handlePinComplete}
              error={!!error}
              disabled={isLoading}
            />

            {error && (
              <p className="text-center text-sm text-warning animate-in fade-in">
                {error}
              </p>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoading || pin.length !== 4}
              className="w-full h-12 bg-primary hover:bg-primary-deep text-white rounded-xl font-light"
            >
              {isLoading ? 'Connexion...' : 'Continuer'}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary hover:text-primary-deep font-medium">
            Creer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
