// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from './components/auth/LoginForm'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { SkipLink } from './components/a11y/SkipLink'
import { PrintStyles } from './components/print/PrintStyles'

// Pages
import { Dashboard } from './pages/Dashboard'
import { ClientList } from './pages/clients/ClientList'
import { ClientDetail } from './pages/clients/ClientDetail'
import { SessionList } from './pages/sessions/SessionList'
import { SessionPlanner } from './components/sessions/SessionPlanner'
import { MaterialList } from './pages/materials/MaterialList'
import { SessionTemplates } from './components/sessions/SessionTemplates'
import { UserSettings } from './components/settings/UserSettings'

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Accessibility Skip Link */}
        <SkipLink />
        
        {/* Print Styles */}
        <PrintStyles />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Clients */}
            <Route path="/clients">
              <Route index element={<ClientList />} />
              <Route path=":id" element={<ClientDetail />} />
              <Route path="new" element={<ClientDetail />} />
            </Route>

            {/* Sessions */}
            <Route path="/sessions">
              <Route index element={<SessionList />} />
              <Route path="scheduler" element={<SessionPlanner />} />
              <Route path="templates" element={<SessionTemplates />} />
            </Route>

            {/* Materials */}
            <Route path="/materials">
              <Route index element={<MaterialList />} />
              <Route path=":id/assign" element={<MaterialList />} />
              <Route path=":id/preview" element={<MaterialList />} />
            </Route>

            {/* Reports */}
            <Route path="/reports">
              <Route path="sessions" element={<SessionList />} />
              <Route path="clients" element={<ClientList />} />
              <Route path="materials" element={<MaterialList />} />
            </Route>

            {/* Settings */}
            <Route path="/settings">
              <Route index element={<UserSettings />} />
              <Route path="profile" element={<UserSettings />} />
              <Route path="notifications" element={<UserSettings />} />
              <Route path="templates" element={<SessionTemplates />} />
            </Route>

            {/* Catch all - 404 */}
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600">Page not found</p>
                </div>
              </div>
            } />
          </Route>
        </Routes>

        {/* Error Boundary */}
        <div id="error-boundary" />

        {/* Modal Container */}
        <div id="modal-root" />

        {/* Toast Container */}
        <div id="toast-root" />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App