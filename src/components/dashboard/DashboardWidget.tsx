import { Maximize2, Minimize2 } from "lucide-react"

// src/components/dashboard/DashboardWidget.tsx
interface DashboardWidgetProps {
  title: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  onSizeChange?: () => void
  isExpanded?: boolean
}

export const DashboardWidget = ({
  title,
  children,
  size = 'medium',
  onSizeChange,
  isExpanded = false,
}: DashboardWidgetProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${
      size === 'large' || isExpanded ? 'col-span-full' :
      size === 'medium' ? 'md:col-span-2 lg:col-span-2' :
      ''
    }`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        {onSizeChange && (
          <button
            onClick={onSizeChange}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}