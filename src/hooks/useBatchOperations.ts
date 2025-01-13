// src/hooks/useBatchOperations.ts
import { useState } from 'react'

interface BatchOperation<T> {
  id: string
  label: string
  icon?: React.ComponentType
  action: (items: T[]) => Promise<void>
  isDestructive?: boolean
}

export function useBatchOperations<T extends { id: number | string }>(
  items: T[],
  operations: BatchOperation<T>[]
) {
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleItem = (item: T) => {
    setSelectedItems(prev =>
      prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    )
  }

  const toggleAll = () => {
    setSelectedItems(prev => 
      prev.length === items.length ? [] : [...items]
    )
  }

  const executeBatchOperation = async (operationId: string) => {
    const operation = operations.find(op => op.id === operationId)
    if (!operation || selectedItems.length === 0) return

    setIsProcessing(true)
    try {
      await operation.action(selectedItems)
      setSelectedItems([])
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    selectedItems,
    isProcessing,
    toggleItem,
    toggleAll,
    executeBatchOperation,
    hasSelection: selectedItems.length > 0,
    isSelected: (item: T) => selectedItems.some(i => i.id === item.id),
    selectedCount: selectedItems.length,
    clearSelection: () => setSelectedItems([])
  }
}