// src/components/sessions/Calendar.tsx
import { useState, useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface CalendarEvent {
  id: number
  title: string
  start: Date
  status: string
  client: {
    name: string
  }
}

export const Calendar = () => {
  const { sessions } = useSessionStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  const calendarEvents: CalendarEvent[] = useMemo(() => 
    sessions.map(session => ({
      id: session.id,
      title: `${session.client.name} - ${session.duration}min`,
      start: parseISO(session.session_date),
      status: session.status,
      client: session.client
    }))
  , [sessions])

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate)
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
  }, [currentDate])

  const timeSlots = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => i + 8) // 8 AM to 8 PM
  , [])

  const getEventsForDateAndTime = (date: Date, hour: number) => {
    return calendarEvents.filter(event => {
      const eventDate = event.start
      return isSameDay(eventDate, date) && eventDate.getHours() === hour
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(d => addDays(d, -7))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(d => addDays(d, 7))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex">
        {/* Time Labels */}
        <div className="w-20 border-r">
          <div className="h-12 border-b"></div>
          {timeSlots.map(hour => (
            <div key={hour} className="h-20 border-b text-sm text-gray-500 text-right pr-2">
              {`${hour}:00`}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="flex-1 grid grid-cols-7">
          {/* Day Headers */}
          {weekDays.map(day => (
            <div
              key={day.toString()}
              className="h-12 border-b border-r text-center py-2"
            >
              <div className="text-sm font-medium">
                {format(day, 'EEE')}
              </div>
              <div className="text-sm text-gray-500">
                {format(day, 'd')}
              </div>
            </div>
          ))}

          {/* Time Slots */}
          {timeSlots.map(hour => (
            <React.Fragment key={hour}>
              {weekDays.map(day => (
                <div
                  key={`${day}-${hour}`}
                  className="h-20 border-b border-r relative group"
                >
                  {getEventsForDateAndTime(day, hour).map(event => (
                    <div
                      key={event.id}
                      className={`absolute inset-x-1 top-0 mt-1 p-1 rounded text-sm ${
                        event.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <div className="font-medium truncate">{event.client.name}</div>
                      <div className="text-xs truncate">
                        {format(event.start, 'HH:mm')}
                      </div>
                    </div>
                  ))}
                  
                  {/* Hover effect for adding new sessions */}
                  <div className="hidden group-hover:flex absolute inset-0 bg-gray-50 bg-opacity-75 items-center justify-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      + Add Session
                    </button>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}