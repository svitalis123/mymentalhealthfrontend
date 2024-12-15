// src/pages/materials/MaterialForm.tsx
import { useState } from 'react'
import { materialService } from '../../services/api'
import { X } from 'lucide-react'
import { Alert, AlertDescription } from '../../components/ui/alert';

interface MaterialFormProps {
  material?: any
  onClose: () => void
  onSuccess: () => void
}

export const MaterialForm = ({ material, onClose, onSuccess }: MaterialFormProps) => {
  const [formData, setFormData] = useState({
    title: material?.title || '',
    content: material?.content || '',
    category: material?.category || '',
    difficulty_level: material?.difficulty_level || 'beginner'
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (material) {
        await materialService.update(material.id, formData)
      } else {
        await materialService.create(formData)
      }
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred')
    }
  }

  const difficultyLevels = ['beginner', 'intermediate', 'advanced']

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {material ? 'Edit Material' : 'Create New Material'}
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
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Anxiety Management, Depression, Stress"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formData.difficulty_level}
              onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              minLength={50}
              placeholder="Enter the educational material content here..."
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
              {material ? 'Update Material' : 'Create Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
