export * from './database'

// App-specific types
export interface AuthState {
  userId: string | null
  isAuthenticated: boolean
}

export interface UIState {
  isLoading: boolean
  error: string | null
}
