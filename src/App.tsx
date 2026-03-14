import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { AppShell } from '@/components/AppShell'
import { RegisterPage } from '@/pages/RegisterPage'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { NewExpensePage } from '@/pages/NewExpensePage'
import { NewRevenuePage } from '@/pages/NewRevenuePage'
import { StatsPage } from '@/pages/StatsPage'
import { ShopPage } from '@/pages/ShopPage'
import { BudgetPage } from '@/pages/BudgetPage'
import { TalentTreePage } from '@/pages/TalentTreePage'

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Auth route wrapper (redirect to home if already authenticated)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasAccount, checkAccount } = useAuthStore()

  useEffect(() => {
    if (hasAccount === null) {
      checkAccount()
    }
  }, [hasAccount, checkAccount])

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// Initial route - redirects based on auth state
function InitialRoute() {
  const { isAuthenticated, hasAccount, checkAccount } = useAuthStore()

  useEffect(() => {
    if (hasAccount === null) {
      checkAccount()
    }
  }, [hasAccount, checkAccount])

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (hasAccount === false) {
    return <Navigate to="/register" replace />
  }

  if (hasAccount === true) {
    return <Navigate to="/login" replace />
  }

  return null
}

function App() {
  return (
    <HashRouter>
      <AppShell>
      <Routes>
        <Route path="/auth" element={<InitialRoute />} />

        {/* Auth routes */}
        <Route
          path="/register"
          element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <NewExpensePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-revenue"
          element={
            <ProtectedRoute>
              <NewRevenuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <ShopPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/talents"
          element={
            <ProtectedRoute>
              <TalentTreePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
      </AppShell>
    </HashRouter>
  )
}

export default App
