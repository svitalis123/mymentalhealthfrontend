// src/components/timeline/ClientTimeline.tsx
import { useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useMaterialStore } from '../../store/materialStore'
import { format, isSameDay } from 'date-fns'
import { MessageCircle, BookOpen, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface TimelineEvent {
  id: string
  date: Date
  type: 'session' | 'material' | 'note' | 'milestone'
  title: string
  description?: string
  status?: string
  icon?: any
}

interface ClientTimelineProps {
  clientId: number
}

export const ClientTimeline = ({ clientId }: ClientTimelineProps) => {
  const { sessions } = useSessionStore()
  const { materials } = useMaterialStore()

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = []

    // Add sessions to timeline
    sessions
      .filter(session => session.client_id === clientId)
      .forEach(session => {
        events.push({
          id: `session-${session.id}`,
          date: new Date(session.session_date),
          type: 'session',
          title: 'Therapy Session',
          description: session.notes,
          status: session.status,
          icon: session.status === 'completed' ? CheckCircle : 
                session.status === 'scheduled' ? Clock : AlertCircle
        })
      })

    // Add material assignments to timeline
    materials
      .filter(material => 
        material.assigned_to?.some(assignment => 
          assignment.client_id === clientId
        )
      )
      .forEach(material => {
        const assignment = material.assigned_to!.find(a => a.client_id === clientId)!
        events.push({
          id: `material-${material.id}`,
          date: new Date(assignment.assigned_at),
          type: 'material',
          title: material.title,
          description: `Assigned: ${material.category}`,
          status: assignment.completed_at ? 'completed' : 'in-progress',
          icon: BookOpen
        })
      })

    // Sort events by date
    return events.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [sessions, materials, clientId])

  const groupedEvents = useMemo(() => {
    return timelineEvents.reduce((groups: { [key: string]: TimelineEvent[] }, event) => {
      const dateKey = format(event.date, 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(event)
      return groups
    }, {})
  }, [timelineEvents])

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([dateKey, events]) => (
        <div key={dateKey} className="relative">
          <div className="sticky top-0 bg-gray-50 px-4 py-2 rounded-lg mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              {format(new Date(dateKey), 'MMMM d, yyyy')}
            </h3>
          </div>

          <div className="ml-4">
            {events.map((event) => (
              <div key={event.id} className="relative pb-8">
                {/* Timeline line */}
                <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />

                <div className="relative flex items-start space-x-3">
                  {/* Icon */}
                  <div className="relative">
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      event.type === 'session' ? 'bg-blue-100' :
                      event.type === 'material' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {event.icon && <event.icon className={`h-5 w-5 ${
                        event.type === 'session' ? 'text-blue-600' :
                        event.type === 'material' ? 'text-purple-600' :
                        'text-gray-600'
                      }`} />}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {format(event.date, 'h:mm a')}
                          </p>
                        </div>
                        {event.status && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.status === 'completed' ? 'bg-green-100 text-green-800' :
                            event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}