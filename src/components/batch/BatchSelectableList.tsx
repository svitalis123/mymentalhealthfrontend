import { useBatchOperations } from "@/hooks/useBatchOperations"
import { BatchActionBar } from "./BatchActionBar"

// src/components/batch/BatchSelectableList.tsx
interface BatchSelectableListProps<T> {
  items: T[]
  renderItem: (item: T, isSelected: boolean, onToggle: () => void) => React.ReactNode
  batchOperations: Array<{
    id: string
    label: string
    action: (items: T[]) => Promise<void>
    icon?: React.ComponentType
    isDestructive?: boolean
  }>
}

export function BatchSelectableList<T extends { id: number | string }>({
  items,
  renderItem,
  batchOperations
}: BatchSelectableListProps<T>) {
  const {
    selectedItems,
    isProcessing,
    toggleItem,
    toggleAll,
    executeBatchOperation,
    isSelected,
    selectedCount,
    clearSelection
  } = useBatchOperations(items, batchOperations)

  return (
    <div className="relative">
      {/* Selection Header */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-indigo-600"
            checked={selectedCount === items.length}
            onChange={toggleAll}
          />
          <span className="ml-3 text-sm text-gray-600">
            {selectedCount === items.length
              ? 'All items selected'
              : selectedCount === 0
              ? 'Select items'
              : `${selectedCount} selected`}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-200">
        {items.map(item => (
          <div key={item.id}>
            {renderItem(item, isSelected(item), () => toggleItem(item))}
          </div>
        ))}
      </div>

      {/* Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedCount}
        isProcessing={isProcessing}
        operations={batchOperations}
        onExecute={executeBatchOperation}
        onClear={clearSelection}
      />
    </div>
  )
}