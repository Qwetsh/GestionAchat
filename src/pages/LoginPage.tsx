import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PinInput } from '@/features/auth/PinInput'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-text">Bon retour !</CardTitle>
          <CardDescription className="text-muted">
            Entre ton code PIN pour continuer
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <PinInput
            value={pin}
            onChange={handlePinComplete}
            error={!!error}
            disabled={isLoading}
          />

          {error && (
            <p className="text-center text-sm text-red-600 animate-in fade-in">
              {error}
            </p>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading || pin.length !== 4}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <p className="text-center text-sm text-muted">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
