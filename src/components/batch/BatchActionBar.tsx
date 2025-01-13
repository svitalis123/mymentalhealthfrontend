// src/components/batch/BatchActionBar.tsx
import { Check, Trash2, Archive, Share2, Download } from 'lucide-react'

interface BatchActionBarProps<T> {
  selectedCount: number
  isProcessing: boolean
  operations: Array<{
    id: string
    label: string
    icon?: React.ComponentType
    isDestructive?: boolean
  }>
  onExecute: (operationId: string) => void
  onClear: () => void
}

export function BatchActionBar<T>({
  selectedCount,
  isProcessing,
  operations,
  onExecute,
  onClear
}: BatchActionBarProps<T>) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg transform translate-y-0 transition-transform">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={onClear}
              className="ml-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {operations.map(operation => (
              <button
                key={operation.id}
                onClick={() => onExecute(operation.id)}
                disabled={isProcessing}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium
                  ${operation.isDestructive
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center
                `}
              >
                {operation.icon && <operation.icon className="w-4 h-4 mr-2" />}
                {operation.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}