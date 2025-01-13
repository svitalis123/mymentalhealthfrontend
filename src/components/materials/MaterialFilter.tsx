// src/components/materials/MaterialFilter.tsx
import { useState } from 'react'
import { useMaterialStore } from '../../store/materialStore'
import { Filter, Tag, SlidersHorizontal } from 'lucide-react'

interface FilterState {
  category: string[]
  difficulty: string[]
  hasAiEnhancements: boolean | null
  searchTerm: string
}

export const MaterialFilter = () => {
  const { materials } = useMaterialStore()
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    difficulty: [],
    hasAiEnhancements: null,
    searchTerm: ''
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Extract unique categories and difficulty levels
  const categories = [...new Set(materials.map(m => m.category).filter(Boolean))]
  const difficultyLevels = [...new Set(materials.map(m => m.difficulty_level).filter(Boolean))]

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search materials..."
          className="w-full px-4 py-2 border rounded-lg"
          value={filters.searchTerm}
          onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => toggleFilter('category', category)}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
              filters.category.includes(category)
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            {category}
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Advanced Filters
      </button>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Difficulty Level</h4>
            <div className="flex gap-2">
              {difficultyLevels.map(level => (
                <button
                  key={level}
                  onClick={() => toggleFilter('difficulty', level)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.difficulty.includes(level)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">AI Enhancements</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  hasAiEnhancements: prev.hasAiEnhancements === true ? null : true 
                }))}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.hasAiEnhancements === true
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                AI Enhanced
              </button>
              <button
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  hasAiEnhancements: prev.hasAiEnhancements === false ? null : false 
                }))}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.hasAiEnhancements === false
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Standard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
