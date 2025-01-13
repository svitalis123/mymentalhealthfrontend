// src/components/dashboard/AnalyticsDashboard.tsx
import React, { useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useClientStore } from '../../store/clientStore'
import { useMaterialStore } from '../../store/materialStore'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { startOfMonth, format, differenceInMonths } from 'date-fns'

export const AnalyticsDashboard = () => {
  const { sessions } = useSessionStore()
  const { clients } = useClientStore()
  const { materials } = useMaterialStore()

  // Session Statistics
  const sessionStats = useMemo(() => {
    const stats = {
      total: sessions.length,
      completed: sessions.filter(s => s.status === 'completed').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length,
      completionRate: 0
    }
    stats.completionRate = Math.round((stats.completed / stats.total) * 100)
    return stats
  }, [sessions])

  // Monthly Session Trends
  const monthlyTrends = useMemo(() => {
    const trends = sessions.reduce((acc: any, session) => {
      const month = format(new Date(session.session_date), 'MMM yyyy')
      if (!acc[month]) {
        acc[month] = { month, total: 0, completed: 0, cancelled: 0 }
      }
      acc[month].total++
      acc[month][session.status]++
      return acc
    }, {})
    return Object.values(trends)
  }, [sessions])

  // Client Retention
  const retentionData = useMemo(() => {
    return clients.map(client => {
      const clientSessions = sessions.filter(s => s.client_id === client.id)
      const firstSession = new Date(Math.min(...clientSessions.map(s => new Date(s.session_date).getTime())))
      const months = differenceInMonths(new Date(), firstSession)
      return {
        name: client.name,
        months,
        sessions: clientSessions.length
      }
    }).filter(d => d.months > 0)
  }, [clients, sessions])

  // Material Usage
  const materialUsage = useMemo(() => {
    const usage = materials.reduce((acc: any, material) => {
      if (!acc[material.category]) {
        acc[material.category] = { name: material.category, value: 0 }
      }
      acc[material.category].value++
      return acc
    }, {})
    return Object.values(usage)
  }, [materials])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Sessions',
            value: sessionStats.total,
            color: 'bg-blue-500'
          },
          {
            title: 'Completion Rate',
            value: `${sessionStats.completionRate}%`,
            color: 'bg-green-500'
          },
          {
            title: 'Active Clients',
            value: clients.length,
            color: 'bg-purple-500'
          },
          {
            title: 'Available Materials',
            value: materials.length,
            color: 'bg-yellow-500'
          }
        ].map((metric, i) => (
          <div key={i} className={`${metric.color} rounded-lg p-6 text-white`}>
            <h3 className="text-lg font-medium">{metric.title}</h3>
            <p className="text-3xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Session Trends */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Monthly Session Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10B981" />
              <Line type="monotone" dataKey="cancelled" stroke="#EF4444" />
              <Line type="monotone" dataKey="total" stroke="#6366F1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Retention */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Client Retention</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionData}>
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#6366F1" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="months" fill="#6366F1" name="Months Active" />
                <Bar yAxisId="right" dataKey="sessions" fill="#10B981" name="Total Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Usage by Category */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Material Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialUsage}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {materialUsage.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}