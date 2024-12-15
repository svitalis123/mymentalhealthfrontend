// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { Users, Calendar, BookOpen, Layout } from 'lucide-react'

export const Sidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname.startsWith(path)

  const menuItems = [
    { path: '/dashboard', icon: Layout, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/sessions', icon: Calendar, label: 'Sessions' },
    { path: '/materials', icon: BookOpen, label: 'Materials' },
  ]

  return (
    <div className="flex flex-col w-64 bg-gray-800 min-h-screen p-4">
      <div className="text-white text-xl font-bold mb-8">Therapy Manager</div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 mt-2 text-gray-100 rounded-lg ${
              isActive(item.path)
                ? 'bg-gray-700'
                : 'hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}