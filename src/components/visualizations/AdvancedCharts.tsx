// src/components/visualizations/AdvancedCharts.tsx
import { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  AreaChart, Area, ScatterChart, Scatter, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { useSessionStore } from '../../store/sessionStore'
import { useClientStore } from '../../store/clientStore'
import { useMaterialStore } from '../../store/materialStore'
import { format, startOfWeek, addDays, differenceInWeeks } from 'date-fns'

export const SessionTrendsChart = () => {
  const { sessions } = useSessionStore()
  
  const trendData = useMemo(() => {
    const weeklyData: Record<string, any> = {}
    
    sessions.forEach(session => {
      const weekStart = format(startOfWeek(new Date(session.session_date)), 'yyyy-MM-dd')
      if (!weeklyData[weekStart]) {
        weeklyData[weekStart] = {
          week: weekStart,
          total: 0,
          completed: 0,
          cancelled: 0,
          duration: 0
        }
      }
      
      weeklyData[weekStart].total++
      weeklyData[weekStart][session.status]++
      weeklyData[weekStart].duration += session.duration
    })

    return Object.values(weeklyData)
  }, [sessions])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="week" 
            tickFormatter={(date) => format(new Date(date), 'MMM d')}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Completed"
          />
          <Area
            type="monotone"
            dataKey="cancelled"
            stackId="1"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.6}
            name="Cancelled"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export const ClientEngagementRadar = () => {
  const { clients } = useClientStore()
  const { sessions } = useSessionStore()
  const { materials } = useMaterialStore()

  const engagementData = useMemo(() => {
    return clients.map(client => {
      const clientSessions = sessions.filter(s => s.client_id === client.id)
      const clientMaterials = materials.filter(m => 
        m.assigned_to?.some(a => a.client_id === client.id)
      )
      
      return {
        name: client.name,
        sessions: clientSessions.length,
        completion: clientSessions.filter(s => s.status === 'completed').length,
        materials: clientMaterials.length,
        progress: clientMaterials.filter(m => 
          m.assigned_to?.find(a => a.client_id === client.id && a.completed_at)
        ).length
      }
    })
  }, [clients, sessions, materials])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={engagementData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <Radar
            name="Sessions"
            dataKey="sessions"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.6}
          />
          <Radar
            name="Completed"
            dataKey="completion"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
          />
          <Radar
            name="Materials"
            dataKey="materials"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const MaterialCompletionBubble = () => {
  const { materials } = useMaterialStore()
  
  const bubbleData = useMemo(() => 
    materials.map(material => {
      const assignments = material.assigned_to || []
      const completions = assignments.filter(a => a.completed_at).length
      const avgTime = assignments.reduce((acc, curr) => {
        if (curr.completed_at) {
          const time = differenceInWeeks(
            new Date(curr.completed_at),
            new Date(curr.assigned_at)
          )
          return acc + time
        }
        return acc
      }, 0) / (completions || 1)

      return {
        name: material.title,
        assignments: assignments.length,
        completions,
        avgCompletionTime: avgTime,
        category: material.category
      }
    }),
    [materials]
  )

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="assignments" 
            name="Total Assignments"
            unit=" assigned"
          />
          <YAxis 
            dataKey="completions" 
            name="Completions"
            unit=" completed"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload, label }) => {
              if (payload && payload[0]) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-4 rounded shadow-lg border">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-gray-500">{data.category}</p>
                    <div className="mt-2">
                      <p>Assignments: {data.assignments}</p>
                      <p>Completions: {data.completions}</p>
                      <p>Avg Time: {data.avgCompletionTime.toFixed(1)} weeks</p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Scatter 
            name="Materials" 
            data={bubbleData}
            fill="#8B5CF6"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}