// src/components/common/EmptyState.tsx
import { FolderOpen } from 'lucide-react'

interface EmptyStateProps {
  message: string
  description?: string
}

export const EmptyState = ({ message, description }: EmptyStateProps) => (
  <div className="text-center py-12">
    <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">{message}</h3>
    {description && (
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    )}
  </div>
)