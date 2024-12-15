// src/pages/materials/AssignMaterialForm.tsx
import { useState, useEffect } from 'react'
import { materialService, clientService } from '../../services/api'
import { X } from 'lucide-react'
import { Alert, AlertDescription } from '../../components/ui/alert';

interface AssignMaterialFormProps {
  material: any
  onClose: () => void
  onSuccess: () => void
}

export const AssignMaterialForm = ({ material, onClose, onSuccess }: AssignMaterialFormProps) => {
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    client_id: '',
    material_id: material.id,
    ai_feedback: ''
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
      await materialService.assign(formData)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Assign Material</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <h3 className="font-medium">Material:</h3>
          <p className="text-gray-600">{material.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Client
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            >
              <option value="">Choose a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              AI Feedback/Notes
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={4}
              value={formData.ai_feedback}
              onChange={(e) => setFormData({ ...formData, ai_feedback: e.target.value })}
              placeholder="Enter any specific feedback or notes about this assignment..."
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
              Assign Material
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}