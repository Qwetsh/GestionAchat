import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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

const CATEGORIES: Category[] = ['cosmetics', 'books', 'stationery', 'videogames', 'other']

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

      addXP(15)

      toast.success('+15 XP ! Timer 24h lance', {
        description: 'Tu peux le faire !',
      })

      navigate('/')
    } catch (error) {
      console.error('Error creating temptation:', error)
      toast.error('Erreur lors de la creation')
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
        <h1 className="text-lg font-light">Nouvelle tentation</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-muted/10 px-8 py-6">
        <h1 className="text-2xl font-light text-text">Nouvelle tentation</h1>
        <p className="text-muted mt-1">Ajoute une tentation à résister</p>
      </div>

      <div className="p-6 lg:p-8 space-y-10 max-w-md mx-auto lg:mx-0">
        {/* Photo Section */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />

          {photoUrl ? (
            <div className="relative">
              <img
                src={photoUrl}
                alt="Tentation"
                className="w-full h-52 object-cover rounded-2xl"
              />
              <button
                onClick={() => setPhotoUrl(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.capture = 'environment'
                    fileInputRef.current.click()
                  }
                }}
                className="flex-1 h-32 rounded-2xl border-2 border-dashed border-muted/30 flex flex-col items-center justify-center gap-2 text-muted hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Camera className="h-6 w-6" />
                <span className="text-xs">Photo</span>
              </button>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute('capture')
                    fileInputRef.current.click()
                  }
                }}
                className="flex-1 h-32 rounded-2xl border-2 border-dashed border-muted/30 flex flex-col items-center justify-center gap-2 text-muted hover:border-primary/50 hover:text-primary transition-colors"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs">Galerie</span>
              </button>
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="text-center">
          <p className="text-sm text-muted mb-4">Combien ca coute ?</p>
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
          <p className="text-sm text-muted mb-4 text-center">C'est quoi ?</p>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
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
                <span className="text-2xl">{CATEGORY_EMOJIS[cat]}</span>
                <span className={cn(
                  'text-xs',
                  category === cat ? 'text-primary font-medium' : 'text-muted'
                )}>
                  {CATEGORY_LABELS[cat]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full h-14 text-lg font-light bg-primary hover:bg-primary-deep text-white rounded-2xl shadow-xl shadow-primary/20 transition-all disabled:opacity-40 disabled:shadow-none"
          >
            {isSubmitting ? 'Creation...' : 'Lancer le timer'}
          </Button>

          <p className="text-center text-xs text-muted mt-4">
            <span className="text-primary">+15 XP</span> maintenant
            {' '}&bull;{' '}
            <span className="text-success">+50 XP</span> si tu resistes 24h
          </p>
        </div>
      </div>
    </div>
  )
}
