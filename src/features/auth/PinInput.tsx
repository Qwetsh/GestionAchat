import { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PinInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
  autoFocus?: boolean
}

export function PinInput({
  length = 4,
  value,
  onChange,
  error = false,
  disabled = false,
  autoFocus = true,
}: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  // Split value into array for display
  const digits = value.split('').slice(0, length)

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleChange = useCallback(
    (index: number, inputValue: string) => {
      // Only allow digits
      const digit = inputValue.replace(/\D/g, '').slice(-1)

      if (digit) {
        // Build new value
        const newDigits = [...digits]
        while (newDigits.length < index) {
          newDigits.push('')
        }
        newDigits[index] = digit
        const newValue = newDigits.join('').slice(0, length)
        onChange(newValue)

        // Move to next input
        if (index < length - 1 && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus()
        }
      }
    },
    [digits, length, onChange]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault()

        if (digits[index]) {
          // Clear current digit
          const newDigits = [...digits]
          newDigits[index] = ''
          onChange(newDigits.join(''))
        } else if (index > 0) {
          // Move to previous input and clear it
          const newDigits = [...digits]
          newDigits[index - 1] = ''
          onChange(newDigits.join(''))
          inputRefs.current[index - 1]?.focus()
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [digits, length, onChange]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      if (pastedData) {
        onChange(pastedData)
        // Focus last filled input or last input
        const focusIndex = Math.min(pastedData.length, length - 1)
        inputRefs.current[focusIndex]?.focus()
      }
    },
    [length, onChange]
  )

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          disabled={disabled}
          className={cn(
            'w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 bg-red-50 text-red-700'
              : focusedIndex === index
                ? 'border-primary bg-primary-soft/30'
                : digits[index]
                  ? 'border-primary/50 bg-surface'
                  : 'border-muted/30 bg-surface'
          )}
          aria-label={`Chiffre ${index + 1} du code PIN`}
        />
      ))}
    </div>
  )
}
