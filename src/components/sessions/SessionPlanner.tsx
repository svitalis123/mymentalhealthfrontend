// src/components/sessions/SessionPlanner.tsx
import { useState, useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useClientStore } from '../../store/clientStore'
import { format, addMinutes, isSameDay, parseISO, addWeeks } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Users, Repeat, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert'

interface TimeSlot {
  time: Date
  available: boolean
  conflicts?: any[]
}

export const SessionPlanner = () => {
  const { sessions } = useSessionStore()
  const { clients } = useClientStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedClient, setSelectedClient] = useState<number | null>(null)
  const [selectedDuration, setSelectedDuration] = useState(50)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceWeeks, setRecurrenceWeeks] = useState(4)
  const [error, setError] = useState('')

  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = []
    const startHour = 8 // 8 AM
    const endHour = 20 // 8 PM
    const interval = 30 // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = new Date(selectedDate)
        time.setHours(hour, minute, 0, 0)

        // Check for conflicts
        const conflicts = sessions.filter(session => {
          const sessionStart = parseISO(session.session_date)
          const sessionEnd = addMinutes(sessionStart, session.duration)
          const slotEnd = addMinutes(time, selectedDuration)

          return (
            isSameDay(sessionStart, time) &&
            ((time >= sessionStart && time < sessionEnd) ||
             (slotEnd > sessionStart && slotEnd <= sessionEnd))
          )
        })

        slots.push({
          time,
          available: conflicts.length === 0,
          conflicts
        })
      }
    }

    return slots
  }, [selectedDate, selectedDuration, sessions])

  const handleSlotSelect = async (slot: TimeSlot) => {
    if (!slot.available) {
      setError('This time slot is not available')
      return
    }

    if (!selectedClient) {
      setError('Please select a client')
      return
    }

    try {
      const sessions = []
      let currentDate = slot.time

      // Create sessions for recurring appointments
      for (let i = 0; i < (isRecurring ? recurrenceWeeks : 1); i++) {
        sessions.push({
          client_id: selectedClient,
          session_date: currentDate.toISOString(),
          duration: selectedDuration,
          status: 'scheduled'
        })
        currentDate = addWeeks(currentDate, 1)
      }

      // TODO: Add session creation logic here
      setError('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Planning Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={selectedClient || ''}
              onChange={(e) => setSelectedClient(Number(e.target.value))}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="w-full rounded-md border-gray-300"
            >
              <option value={30}>30 minutes</option>
              <option value={50}>50 minutes</option>
              <option value={80}>80 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recurring
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-600">Weekly</span>
              </label>
              {isRecurring && (
                <select
                  value={recurrenceWeeks}
                  onChange={(e) => setRecurrenceWeeks(Number(e.target.value))}
                  className="rounded-md border-gray-300"
                >
                  {[4, 8, 12, 16].map((weeks) => (
                    <option key={weeks} value={weeks}>
                      {weeks} weeks
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Time Slots Grid */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Available Time Slots
            </h3>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleSlotSelect(slot)}
              disabled={!slot.available}
              className={`p-4 rounded-lg border ${
                slot.available
                  ? 'hover:bg-indigo-50 hover:border-indigo-200'
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {format(slot.time, 'h:mm a')}
                </span>
                {!slot.available && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-xs text-gray-500">
                {slot.available
                  ? `${selectedDuration} min available`
                  : 'Not available'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}