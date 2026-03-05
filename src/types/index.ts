// Re-export types from constants for convenience
export type { Category } from '@/lib/constants'

// App-specific types
export interface UIState {
  isLoading: boolean
  error: string | null
}
