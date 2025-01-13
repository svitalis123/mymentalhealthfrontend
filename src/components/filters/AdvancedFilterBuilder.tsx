// src/components/filters/AdvancedFilterBuilder.tsx
import { Fragment } from 'react'
import { Filter, X, Plus, ArrowUpDown } from 'lucide-react'


interface FilterBuilderProps<T> {
  fields: Array<{
    name: keyof T
    label: string
    type: 'text' | 'number' | 'date' | 'select'
    options?: string[]
  }>
  filters: FilterConfig<T>[]
  onAddFilter: (filter: FilterConfig<T>) => void
  onRemoveFilter: (index: number) => void
  onClearFilters: () => void
  sortConfig: SortConfig<T>[]
  onAddSort: (sort: SortConfig<T>) => void
  onRemoveSort: (index: number) => void
  onClearSort: () => void
}

export function AdvancedFilterBuilder<T>({
  fields,
  filters,
  onAddFilter,
  onRemoveFilter,
  onClearFilters,
  sortConfig,
  onAddSort,
  onRemoveSort,
  onClearSort
}: FilterBuilderProps<T>) {
  return (
    <div className="space-y-4">
      {/* Filter Builder */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <div className="flex space-x-2">
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="space-y-2">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-gray-50 p-2 rounded"
            >
              <span className="text-sm text-gray-700">
                {fields.find(f => f.name === filter.field)?.label}
              </span>
              <span className="text-sm text-gray-500">{filter.operator}</span>
              <span className="text-sm font-medium">
                {Array.isArray(filter.value)
                  ? filter.value.join(' - ')
                  : filter.value}
              </span>
              <button
                onClick={() => onRemoveFilter(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Filter Form */}
        <form
          onSubmit={e => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            onAddFilter({
              field: formData.get('field') as keyof T,
              operator: formData.get('operator') as FilterConfig<T>['operator'],
              value: formData.get('value')
            })
            ;(e.target as HTMLFormElement).reset()
          }}
          className="mt-4 grid grid-cols-4 gap-2"
        >
          <select
            name="field"
            className="rounded-md border-gray-300"
            required
          >
            <option value="">Select Field</option>
            {fields.map(field => (
              <option key={String(field.name)} value={String(field.name)}>
                {field.label}
              </option>
            ))}
          </select>

          <select
            name="operator"
            className="rounded-md border-gray-300"
            required
          >
            <option value="">Select Operator</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
            <option value="greaterThan">Greater Than</option>
            <option value="lessThan">Less Than</option>
            <option value="between">Between</option>
            <option value="in">In List</option>
          </select>

          <input
            name="value"
            placeholder="Value"
            className="rounded-md border-gray-300"
            required
          />

          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Filter
          </button>
        </form>
      </div>

      {/* Sort Builder */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Sort</h3>
          <button
            onClick={onClearSort}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Sort
          </button>
        </div>

        {/* Active Sort */}
        <div className="space-y-2">
          {sortConfig.map((sort, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-gray-50 p-2 rounded"
            >
              <span className="text-sm text-gray-700">
                {fields.find(f => f.name === sort.field)?.label}
              </span>
              <span className="text-sm text-gray-500">
                {sort.direction === 'asc' ? '↑' : '↓'}
              </span>
              <button
                onClick={() => onRemoveSort(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Sort Form */}
        <form
          onSubmit={e => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            onAddSort({
              field: formData.get('field') as keyof T,
              direction: formData.get('direction') as 'asc' | 'desc'
            })
            ;(e.target as HTMLFormElement).reset()
          }}
          className="mt-4 grid grid-cols-3 gap-2"
        >
          <select
            name="field"
            className="rounded-md border-gray-300"
            required
          >
            <option value="">Select Field</option>
            {fields.map(field => (
              <option key={String(field.name)} value={String(field.name)}>
                {field.label}
              </option>
            ))}
          </select>

          <select
            name="direction"
            className="rounded-md border-gray-300"
            required
          >
            <option value="">Select Direction</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Add Sort
          </button>
        </form>
      </div>
    </div>
  )
}