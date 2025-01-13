// src/components/activity/ActivityFeed.tsx
import { useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useMaterialStore } from '../../store/materialStore'
import { format, isToday, isYesterday, isThisWeek } from 'date-fns'
import { Calendar, BookOpen, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface Activity {
  id: string
  type: 'session' | 'material' | 'note'
  title: string
  description: string
  timestamp: Date
  status?: string
  icon: any
}

export const ActivityFeed = () => {
  const { sessions } = useSessionStore()
  const { materials } = useMaterialStore()

  const activities = useMemo(() => {
    const allActivities: Activity[] = [
      // Convert sessions to activities
      ...sessions.map(session => ({
        id: `session-${session.id}`,
        type: 'session',
        title: `Session with ${session.client.name}`,
        description: session.notes || 'No notes available',
        timestamp: new Date(session.session_date),
        status: session.status,
        icon: session.status === 'completed' ? CheckCircle :
              session.status === 'scheduled' ? Clock : AlertCircle
      })),
      // Convert material assignments to activities
      ...materials.flatMap(material => 
        material.assigned_to?.map(assignment => ({
          id: `material-${material.id}-${assignment.client_id}`,
          type: 'material',
          title: `Material Assigned: ${material.title}`,
          description: `Assigned to ${assignment.client.name}`,
          timestamp: new Date(assignment.assigned_at),
          status: assignment.completed_at ? 'completed' : 'in-progress',
          icon: BookOpen
        })) || []
      )
    ]

    // Sort by timestamp, most recent first
    return allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [sessions, materials])

  const groupActivities = (activities: Activity[]) => {
    return activities.reduce((groups: { [key: string]: Activity[] }, activity) => {
      let groupKey = 'Earlier'
      
      if (isToday(activity.timestamp)) {
        groupKey = 'Today'
      } else if (isYesterday(activity.timestamp)) {
        groupKey = 'Yesterday'
      } else if (isThisWeek(activity.timestamp)) {
        groupKey = 'This Week'
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(activity)
      return groups
    }, {})
  }

  const groupedActivities = groupActivities(activities)

  return (
    <div className="space-y-8">
      {Object.entries(groupedActivities).map(([group, activities]) => (
        <div key={group}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{group}</h3>
          <div className="space-y-4">
            {activities.map(activity => (
              <div 
                key={activity.id} 
                className="bg-white rounded-lg shadow-sm p-4 flex items-start space-x-4"
              >
                <div className={`p-2 rounded-full ${
                  activity.type === 'session' ? 'bg-blue-100' :
                  activity.type === 'material' ? 'bg-purple-100' :
                  'bg-gray-100'
                }`}>
                  <activity.icon className={`w-5 h-5 ${
                    activity.type === 'session' ? 'text-blue-600' :
                    activity.type === 'material' ? 'text-purple-600' :
                    'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(activity.timestamp, 'h:mm a')}
                      </p>
                    </div>
                    {activity.status && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}