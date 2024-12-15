// src/pages/sessions/SessionList.tsx
import { useEffect, useState } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { sessionService } from '../../services/api'
import { SessionForm } from './SessionForm'
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '../../components/ui/alert'

export const SessionList = () => {
  const { sessions, setSessions, removeSession } = useSessionStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [error, setError] = useState('')

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const data = await sessionService.getAll()
      setSessions(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.delete(id)
        removeSession(id)
      } catch (err: any) {
        setError(err.message)
      }
    }
  }

  const groupSessionsByDate = () => {
    const grouped = sessions.reduce((acc: any, session) => {
      const date = new Date(session.session_date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(session)
      return acc
    }, {})
    return grouped
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
          </button>
          <button
            onClick={() => {
              setSelectedSession(null)
              setIsFormOpen(true)
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {viewMode === 'list' ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Therapist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(session.session_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.session_date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {session.client.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.client.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {session.therapist.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedSession(session)
                        setIsFormOpen(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          {Object.entries(groupSessionsByDate()).map(([date, sessions]: [string, any]) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-semibold mb-4">{date}</h3>
              <div className="space-y-4">
                {sessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{session.client.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.session_date).toLocaleTimeString()} -{' '}
                        {session.duration} minutes
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
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
                      <button
                        onClick={() => {
                          setSelectedSession(session)
                          setIsFormOpen(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <SessionForm
          session={selectedSession}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            loadSessions()
          }}
        />
      )}
    </div>
  )
}