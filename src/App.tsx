// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from './components/auth/LoginForm'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { ClientList } from './pages/clients/ClientList'
import { SessionList } from './pages/sessions/SessionList'
import { MaterialList } from './pages/materials/MaterialList'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="sessions" element={<SessionList />} />
          <Route path="materials" element={<MaterialList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;