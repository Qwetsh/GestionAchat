import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { AppShell } from '@/components/AppShell'
import { RegisterPage } from '@/pages/RegisterPage'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { NewTemptationPage } from '@/pages/NewTemptationPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { TemptationDetailPage } from '@/pages/TemptationDetailPage'
import { StatsPage } from '@/pages/StatsPage'

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

  // If we know there's no account, go to register
  if (hasAccount === false) {
    return <Navigate to="/register" replace />
  }

  // If there's an account, go to login
  if (hasAccount === true) {
    return <Navigate to="/login" replace />
  }

  // Still checking, show nothing (or loading)
  return null
}

function App() {
  return (
    <HashRouter>
      <AppShell>
      <Routes>
        {/* Initial route - determines where to go */}
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
              <NewTemptationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/temptation/:id"
          element={
            <ProtectedRoute>
              <TemptationDetailPage />
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

        {/* Catch all - redirect to auth check */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
      </AppShell>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </HashRouter>
  )
}

export default App
