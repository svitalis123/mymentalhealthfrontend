// src/hooks/useAdvancedFilter.ts
import { useState, useMemo } from 'react'

interface FilterConfig<T> {
  field: keyof T
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in'
  value: any
  conjunction?: 'AND' | 'OR'
}

interface SortConfig<T> {
  field: keyof T
  direction: 'asc' | 'desc'
}

export function useAdvancedFilter<T>(
  data: T[],
  initialFilters: FilterConfig<T>[] = [],
  initialSort: SortConfig<T>[] = []
) {
  const [filters, setFilters] = useState<FilterConfig<T>[]>(initialFilters)
  const [sortConfig, setSortConfig] = useState<SortConfig<T>[]>(initialSort)

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    // Apply filters
    if (filters.length > 0) {
      result = result.filter(item =>
        filters.every(filter => {
          const fieldValue = item[filter.field]
          switch (filter.operator) {
            case 'equals':
              return fieldValue === filter.value
            case 'contains':
              return String(fieldValue)
                .toLowerCase()
                .includes(String(filter.value).toLowerCase())
            case 'greaterThan':
              return fieldValue > filter.value
            case 'lessThan':
              return fieldValue < filter.value
            case 'between':
              return fieldValue >= filter.value[0] && fieldValue <= filter.value[1]
            case 'in':
              return filter.value.includes(fieldValue)
            default:
              return true
          }
        })
      )
    }

    // Apply sorting
    if (sortConfig.length > 0) {
      result.sort((a, b) => {
        for (const sort of sortConfig) {
          const aVal = a[sort.field]
          const bVal = b[sort.field]
          
          if (aVal === bVal) continue
          
          const comparison = aVal < bVal ? -1 : 1
          return sort.direction === 'asc' ? comparison : -comparison
        }
        return 0
      })
    }

    return result
  }, [data, filters, sortConfig])

  return {
    filteredData: filteredAndSortedData,
    filters,
    sortConfig,
    setFilters,
    setSortConfig,
    addFilter: (filter: FilterConfig<T>) =>
      setFilters(prev => [...prev, filter]),
    removeFilter: (index: number) =>
      setFilters(prev => prev.filter((_, i) => i !== index)),
    addSort: (sort: SortConfig<T>) =>
      setSortConfig(prev => [...prev, sort]),
    removeSort: (index: number) =>
      setSortConfig(prev => prev.filter((_, i) => i !== index)),
    clearFilters: () => setFilters([]),
    clearSort: () => setSortConfig([])
  }
}