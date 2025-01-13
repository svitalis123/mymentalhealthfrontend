// src/components/progress/ClientProgress.tsx
import { useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useMaterialStore } from '../../store/materialStore'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react'

interface ClientProgressProps {
  clientId: number
}

export const ClientProgress = ({ clientId }: ClientProgressProps) => {
  const { sessions } = useSessionStore()
  const { materials } = useMaterialStore()

  // Calculate session attendance and completion rates
  const sessionStats = useMemo(() => {
    const clientSessions = sessions.filter(s => s.client_id === clientId)
    const total = clientSessions.length
    const completed = clientSessions.filter(s => s.status === 'completed').length
    const cancelled = clientSessions.filter(s => s.status === 'cancelled').length
    const attendanceRate = total > 0 ? (completed / total) * 100 : 0

    return {
      total,
      completed,
      cancelled,
      attendanceRate
    }
  }, [sessions, clientId])

  // Calculate material progress
  const materialProgress = useMemo(() => {
    const assignedMaterials = materials.filter(m => 
      m.assigned_to?.some(a => a.client_id === clientId)
    )
    const completed = assignedMaterials.filter(m =>
      m.assigned_to?.find(a => a.client_id === clientId)?.completed_at
    ).length
    const total = assignedMaterials.length
    const completionRate = total > 0 ? (completed / total) * 100 : 0

    return {
      total,
      completed,
      completionRate
    }
  }, [materials, clientId])

  // Generate monthly progress data
  const monthlyProgress = useMemo(() => {
    const progressData = sessions
      .filter(s => s.client_id === clientId)
      .reduce((acc: any, session) => {
        const month = new Date(session.session_date).toLocaleString('default', { month: 'short' })
        if (!acc[month]) {
          acc[month] = {
            month,
            sessions: 0,
            completed: 0,
            materials: 0
          }
        }
        acc[month].sessions++
        if (session.status === 'completed') {
          acc[month].completed++
        }
        return acc
      }, {})

    return Object.values(progressData)
  }, [sessions, clientId])

  const COLORS = ['#10B981', '#EF4444', '#6366F1']

  return (
    <div className="space-y-6">
      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Session Attendance</p>
              <p className="text-2xl font-bold">{sessionStats.attendanceRate.toFixed(1)}%</p>
            </div>
            <CheckCircle className={`w-8 h-8 ${
              sessionStats.attendanceRate >= 80 ? 'text-green-500' :
              sessionStats.attendanceRate >= 60 ? 'text-yellow-500' :
              'text-red-500'
            }`} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {sessionStats.completed} of {sessionStats.total} sessions completed
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Material Completion</p>
              <p className="text-2xl font-bold">{materialProgress.completionRate.toFixed(1)}%</p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${
              materialProgress.completionRate >= 80 ? 'text-green-500' :
              materialProgress.completionRate >= 60 ? 'text-yellow-500' :
              'text-red-500'
            }`} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {materialProgress.completed} of {materialProgress.total} materials completed
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold">4 weeks</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Last session: 2 days ago
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Progress Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Monthly Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProgress}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  name="Completed Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="materials" 
                  stroke="#6366F1" 
                  name="Materials Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Session Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: sessionStats.completed },
                    { name: 'Cancelled', value: sessionStats.cancelled },
                    { name: 'Scheduled', value: sessionStats.total - sessionStats.completed - sessionStats.cancelled }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
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