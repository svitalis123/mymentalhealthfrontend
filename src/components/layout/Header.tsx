// src/components/layout/Header.tsx
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, User } from 'lucide-react'

export const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          <span className="text-gray-700">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <LogOut className="w-5 h-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  )
}