// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react'
import { useSessionStore } from '../store/sessionStore'
import { useClientStore } from '../store/clientStore'
import { useMaterialStore } from '../store/materialStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, Users, BookOpen, Activity } from 'lucide-react'

export const Dashboard = () => {
  const { sessions } = useSessionStore()
  const { clients } = useClientStore()
  const { materials } = useMaterialStore()
  const [sessionStats, setSessionStats] = useState<any[]>([])

  useEffect(() => {
    // Calculate session statistics by status
    const stats = sessions.reduce((acc: any, session) => {
      const month = new Date(session.session_date).toLocaleString('default', { month: 'short' })
      if (!acc[month]) {
        acc[month] = { month, completed: 0, scheduled: 0, cancelled: 0 }
      }
      acc[month][session.status]++
      return acc
    }, {})

    setSessionStats(Object.values(stats))
  }, [sessions])

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Upcoming Sessions"
          value={sessions.filter(s => s.status === 'scheduled').length}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Materials"
          value={materials.length}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Session Completion Rate"
          value={`${Math.round((sessions.filter(s => s.status === 'completed').length / sessions.length) * 100)}%`}
          icon={Activity}
          color="bg-yellow-500"
        />
      </div>

      {/* Sessions Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Session Statistics</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="Completed" />
              <Bar dataKey="scheduled" fill="#3B82F6" name="Scheduled" />
              <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
        <div className="space-y-4">
          {sessions
            .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime())
            .slice(0, 5)
            .map((session) => (
              <div key={session.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{session.client?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(session.session_date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}