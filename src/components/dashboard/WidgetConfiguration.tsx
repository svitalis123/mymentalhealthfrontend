// src/components/dashboard/WidgetConfiguration.tsx
interface WidgetConfig {
  refreshInterval?: number
  showTitle?: boolean
  customStyles?: {
    backgroundColor?: string
    textColor?: string
  }
}

interface WidgetConfigurationProps {
  widgetId: string
  config: WidgetConfig
  onConfigChange: (config: WidgetConfig) => void
}

export const WidgetConfiguration = ({
  // widgetId,
  config,
  onConfigChange,
}: WidgetConfigurationProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.showTitle}
            onChange={(e) => onConfigChange({
              ...config,
              showTitle: e.target.checked
            })}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Show Title</span>
        </label>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Refresh Interval
        </label>
        <select
          value={config.refreshInterval}
          onChange={(e) => onConfigChange({
            ...config,
            refreshInterval: Number(e.target.value)
          })}
          className="block w-full rounded-md border-gray-300"
        >
          <option value={0}>Never</option>
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Background Color
        </label>
        <input
          type="color"
          value={config.customStyles?.backgroundColor || '#ffffff'}
          onChange={(e) => onConfigChange({
            ...config,
            customStyles: {
              ...config.customStyles,
              backgroundColor: e.target.value
            }
          })}
          className="block w-full rounded-md border-gray-300 h-8"
        />
      </div>
    </div>
  )
}
