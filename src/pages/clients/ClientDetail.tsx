
// src/pages/clients/ClientDetail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { clientService, sessionService, materialService } from '../../services/api'
import { Alert, AlertDescription } from '../../components/ui/alert';
export const ClientDetail = () => {
  const { id } = useParams()
  const [client, setClient] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadClientData(parseInt(id))
    }
  }, [id])

  const loadClientData = async (clientId: number) => {
    try {
      const [clientData, sessionsData, materialsData] = await Promise.all([
        clientService.getById(clientId),
        sessionService.getClientSessions(clientId),
        materialService.getClientMaterials(clientId)
      ])
      
      setClient(clientData)
      setSessions(sessionsData)
      setMaterials(materialsData)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!client) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Client Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{client.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{client.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{client.phone || '-'}</p>
          </div>
          {client.ai_insights && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">AI Insights</p>
              <p className="font-medium">{client.ai_insights}</p>
            </div>
          )}
        </div>
      </div>

      {/* Client Sessions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Sessions</h2>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {new Date(session.session_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Duration: {session.duration} minutes
                  </p>
                </div>
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
              </div>
              {session.notes && (
                <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Materials */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Assigned Materials</h2>
        <div className="space-y-4">
          {materials.map((material) => (
            <div key={material.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{material.material.title}</p>
                  <p className="text-sm text-gray-500">
                    Assigned: {new Date(material.assigned_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    material.completed_at
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {material.completed_at ? 'Completed' : 'In Progress'}
                </span>
              </div>
              {material.ai_feedback && (
                <p className="text-sm text-gray-600 mt-2">
                  {material.ai_feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}