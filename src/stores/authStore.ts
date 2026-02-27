import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { registerUser, loginUser, checkUserExists } from '@/features/auth/authService'

interface AuthState {
  userId: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasAccount: boolean | null
  setUserId: (userId: string) => void
  login: (pin: string) => Promise<boolean>
  register: (pin: string) => Promise<boolean>
  logout: () => void
  checkAccount: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasAccount: null,

      setUserId: (userId: string) => set({ userId, isAuthenticated: true }),

      login: async (pin: string) => {
        set({ isLoading: true, error: null })
        const result = await loginUser(pin)
        if (result.success && result.userId) {
          set({ userId: result.userId, isAuthenticated: true, isLoading: false })
          return true
        } else {
          set({ error: result.error || 'Erreur de connexion', isLoading: false })
          return false
        }
      },

      register: async (pin: string) => {
        set({ isLoading: true, error: null })
        const result = await registerUser(pin)
        if (result.success && result.userId) {
          set({
            userId: result.userId,
            isAuthenticated: true,
            isLoading: false,
            hasAccount: true,
          })
          return true
        } else {
          set({ error: result.error || "Erreur d'inscription", isLoading: false })
          return false
        }
      },

      logout: () =>
        set({
          userId: null,
          isAuthenticated: false,
          error: null,
        }),

      checkAccount: async () => {
        const exists = await checkUserExists()
        set({ hasAccount: exists })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
        hasAccount: state.hasAccount,
      }),
    }
  )
)
