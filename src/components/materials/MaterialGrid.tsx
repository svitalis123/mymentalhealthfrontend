
// src/components/materials/MaterialGrid.tsx
import { useMemo } from 'react'
import { useMaterialStore } from '../../store/materialStore'
import { Book, BookOpen, Bookmark } from 'lucide-react'

interface MaterialGridProps {
  filters: {
    category: string[]
    difficulty: string[]
    hasAiEnhancements: boolean | null
    searchTerm: string
  }
}

export const MaterialGrid = ({ filters }: MaterialGridProps) => {
  const { materials } = useMaterialStore()

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      // Apply search filter
      if (filters.searchTerm && !material.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !material.content.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      // Apply category filter
      if (filters.category.length > 0 && !filters.category.includes(material.category)) {
        return false
      }

      // Apply difficulty filter
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(material.difficulty_level)) {
        return false
      }

      // Apply AI enhancement filter
      if (filters.hasAiEnhancements !== null) {
        if (filters.hasAiEnhancements && !material.ai_enhancements) return false
        if (!filters.hasAiEnhancements && material.ai_enhancements) return false
      }

      return true
    })
  }, [materials, filters])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMaterials.map(material => (
        <div key={material.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {material.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Book className="w-4 h-4" />
                    {material.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {material.difficulty_level}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {material.content}
            </p>

            <div className="flex items-center justify-between">
              {material.ai_enhancements && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  AI Enhanced
                </span>
              )}
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
