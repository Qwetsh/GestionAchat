import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  createTemptation,
  type Category,
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
} from '@/features/temptation/temptationService'
import { useGamificationStore } from '@/stores/gamificationStore'
import { toast } from 'sonner'
import { Camera, ImagePlus, X, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES: Category[] = ['cosmetics', 'books', 'stationery', 'other']

export function NewTemptationPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addXP } = useGamificationStore()

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Compress image if needed (max 500KB)
    const compressed = await compressImage(file, 500 * 1024)
    setPhotoUrl(compressed)
  }

  const compressImage = (file: File, maxSizeBytes: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Max dimensions
          const MAX_DIM = 800
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = (height / width) * MAX_DIM
              width = MAX_DIM
            } else {
              width = (width / height) * MAX_DIM
              height = MAX_DIM
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)

          // Start with high quality and reduce if needed
          let quality = 0.8
          let result = canvas.toDataURL('image/jpeg', quality)

          while (result.length > maxSizeBytes * 1.37 && quality > 0.1) {
            quality -= 0.1
            result = canvas.toDataURL('image/jpeg', quality)
          }

          resolve(result)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async () => {
    if (!amount || !category) return

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Entre un montant valide')
      return
    }

    setIsSubmitting(true)

    try {
      createTemptation({
        photoUrl,
        amount: parsedAmount,
        category,
      })

      // Add XP for logging a temptation
      addXP(15)

      toast.success('+15 XP ! Timer 24h lancé ⏱️', {
        description: 'Tu peux le faire !',
      })

      navigate('/')
    } catch (error) {
      console.error('Error creating temptation:', error)
      toast.error('Erreur lors de la création')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = amount && category && parseFloat(amount.replace(',', '.')) > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold">Nouvelle tentation</h1>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Photo Section */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted mb-3">
              Photo (optionnel)
            </p>

            {photoUrl ? (
              <div className="relative">
                <img
                  src={photoUrl}
                  alt="Tentation"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => setPhotoUrl(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="flex-1 h-24 flex-col gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.capture = 'environment'
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-xs">Appareil photo</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-24 flex-col gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.removeAttribute('capture')
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">Galerie</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amount Section */}
        <Card>
          <CardContent className="p-4">
            <label className="text-sm font-medium text-muted mb-3 block">
              Montant *
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                placeholder="34,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-bold h-14 pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-muted">
                €
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Category Section */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted mb-3">Catégorie *</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  className={cn(
                    'h-14 flex-col gap-1',
                    category === cat && 'bg-primary text-white'
                  )}
                  onClick={() => setCategory(cat)}
                >
                  <span className="text-lg">{CATEGORY_EMOJIS[cat]}</span>
                  <span className="text-xs">{CATEGORY_LABELS[cat]}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white"
        >
          {isSubmitting ? 'Création...' : 'Lancer le timer 24h ⏱️'}
        </Button>

        <p className="text-center text-sm text-muted">
          Tu recevras <span className="font-bold text-accent">+15 XP</span> maintenant
          et <span className="font-bold text-success">+50 XP</span> si tu résistes !
        </p>
      </div>
    </div>
  )
}
