// src/components/materials/MaterialPreview.tsx
import { useState } from 'react'
import { useClientStore } from '../../store/clientStore'
import { BookOpen, Users, Star, Clock, ChevronRight, Download } from 'lucide-react'
import { format } from 'date-fns'

interface MaterialPreviewProps {
  material: any
  onClose: () => void
}

export const MaterialPreview = ({ material, onClose }: MaterialPreviewProps) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'stats' | 'assignments'>('preview')
  const { clients } = useClientStore()

  const getCompletionStats = () => {
    if (!material.assigned_to?.length) return { rate: 0, total: 0, completed: 0 }
    
    const total = material.assigned_to.length
    const completed = material.assigned_to.filter((a: any) => a.completed_at).length
    const rate = Math.round((completed / total) * 100)
    
    return { rate, total, completed }
  }

  const stats = getCompletionStats()

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8">
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{material.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {material.category} • {material.difficulty_level}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'preview', label: 'Preview', icon: BookOpen },
              { id: 'stats', label: 'Statistics', icon: Star },
              { id: 'assignments', label: 'Assignments', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center
                  ${activeTab === id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {material.ai_enhancements && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-800">AI Enhancements</h3>
                  <p className="mt-1 text-sm text-purple-600">
                    {material.ai_enhancements}
                  </p>
                </div>
              )}

              <div className="prose max-w-none">
                {material.content}
              </div>

              <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Material
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Assignments</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="text-2xl font-bold">{stats.rate}%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Avg. Completion Time</p>
                      <p className="text-2xl font-bold">3.2 days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Statistics */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Completion Trends</h3>
                <div className="h-64">
                  {/* Add completion trend chart here using recharts */}
                </div>
              </div>

              {/* Client Feedback Summary */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Client Feedback</h3>
                <div className="space-y-4">
                  {material.assigned_to?.slice(0, 3).map((assignment: any) => (
                    <div key={assignment.id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{assignment.client.name}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(assignment.assigned_at), 'PPP')}
                          </p>
                        </div>
                        {assignment.completed_at && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      {assignment.ai_feedback && (
                        <p className="mt-2 text-sm text-gray-600">
                          {assignment.ai_feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-6">
              {/* Client Assignment Status */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {material.assigned_to?.map((assignment: any) => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {assignment.client.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {assignment.client.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(assignment.assigned_at), 'PP')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assignment.completed_at
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.completed_at ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${assignment.completed_at ? '100' : '0'}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assign to New Clients */}
              <div className="mt-6">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Users className="w-4 h-4 mr-2" />
                  Assign to New Clients
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}