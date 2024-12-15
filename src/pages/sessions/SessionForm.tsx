// src/pages/sessions/SessionForm.tsx
import { useState, useEffect } from 'react'
import { useClientStore } from '../../store/clientStore'
import { sessionService, clientService } from '../../services/api'
import { X } from 'lucide-react'
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAuthStore } from '../../store/authStore'

interface SessionFormProps {
  session?: any
  onClose: () => void
  onSuccess: () => void
}

export const SessionForm = ({ session, onClose, onSuccess }: SessionFormProps) => {
  const { user: therapist } = useAuthStore()
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    client_id: session?.client_id || '',
    therapist_id: session?.therapist_id || therapist?.id,
    session_date: session?.session_date ? 
      new Date(session.session_date).toISOString().slice(0, 16) : 
      '',
    duration: session?.duration || 50,
    notes: session?.notes || '',
    status: session?.status || 'scheduled'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const data = await clientService.getAll()
      setClients(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (session) {
        await sessionService.update(session.id, formData)
      } else {
        await sessionService.create(formData)
      }
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {session ? 'Edit Session' : 'Schedule New Session'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.session_date}
              onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              required
              min="15"
              max="120"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {session ? 'Update Session' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}