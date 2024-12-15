// src/pages/materials/MaterialList.tsx
import { useEffect, useState } from 'react'
import { useMaterialStore } from '../../store/materialStore'
import { materialService } from '../../services/api'
import { MaterialForm } from './MaterialForm'
import { AssignMaterialForm } from './AssignMaterialForm'
import { Plus, Edit, Trash2, UserPlus, Search } from 'lucide-react'
import { Alert, AlertDescription } from '../../components/ui/alert';

export const MaterialList = () => {
  const { materials, setMaterials, removeMaterial } = useMaterialStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [currentCategory, setCurrentCategory] = useState('all')

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async () => {
    try {
      const data = await materialService.getAll()
      setMaterials(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await materialService.delete(id)
        removeMaterial(id)
      } catch (err: any) {
        setError(err.message)
      }
    }
  }

  const categories = ['all', ...new Set(materials.map(m => m.category))].filter(Boolean)

  const filteredMaterials = materials.filter(material => 
    (currentCategory === 'all' || material.category === currentCategory) &&
    (material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Educational Materials</h1>
        <button
          onClick={() => {
            setSelectedMaterial(null)
            setIsFormOpen(true)
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search materials..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-4 py-2"
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-lg shadow-sm border p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{material.title}</h3>
                <p className="text-sm text-gray-500">{material.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedMaterial(material)
                    setIsAssignFormOpen(true)
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMaterial(material)
                    setIsFormOpen(true)
                  }}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 line-clamp-3">
              {material.content}
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                Difficulty: {material.difficulty_level || 'Not specified'}
              </span>
              {material.ai_enhancements && (
                <span className="text-green-600">AI Enhanced</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <MaterialForm
          material={selectedMaterial}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            loadMaterials()
          }}
        />
      )}

      {isAssignFormOpen && selectedMaterial && (
        <AssignMaterialForm
          material={selectedMaterial}
          onClose={() => setIsAssignFormOpen(false)}
          onSuccess={() => {
            setIsAssignFormOpen(false)
            loadMaterials()
          }}
        />
      )}
    </div>
  )
}