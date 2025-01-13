// src/components/dashboard/CustomDashboard.tsx
import { useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import { AnalyticsDashboard } from './AnalyticsDashboard'
import { ActivityFeed } from '../activity/ActivityFeed'
import { ClientProgress } from '../progress/ClientProgress'
import { SessionPlanner } from '../sessions/SessionPlanner'
import { Settings, Maximize2, Minimize2 } from 'lucide-react'

interface Widget {
  id: string
  title: string
  component: React.ComponentType<any>
  defaultSize: 'small' | 'medium' | 'large'
}

const availableWidgets: Widget[] = [
  {
    id: 'analytics',
    title: 'Analytics Overview',
    component: AnalyticsDashboard,
    defaultSize: 'large',
  },
  {
    id: 'upcoming-sessions',
    title: 'Upcoming Sessions',
    component: SessionPlanner,
    defaultSize: 'medium',
  },
  {
    id: 'recent-activities',
    title: 'Recent Activities',
    component: ActivityFeed,
    defaultSize: 'medium',
  },
  {
    id: 'client-stats',
    title: 'Client Statistics',
    component: ClientProgress,
    defaultSize: 'small',
  },
]

export const CustomDashboard = () => {
  const { dashboardLayout } = useSettingsStore()
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)
  const [isCustomizing, setIsCustomizing] = useState(false)

  const getWidgetSize = (widget: Widget) => {
    if (expandedWidget === widget.id) return 'large'
    return widget.defaultSize
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Customize Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardLayout.map((widgetId) => {
          const widget = availableWidgets.find((w) => w.id === widgetId)
          if (!widget) return null

          const WidgetComponent = widget.component
          const size = getWidgetSize(widget)

          return (
            <div
              key={widget.id}
              className={`bg-white rounded-lg shadow-sm ${
                size === 'large' ? 'col-span-full' :
                size === 'medium' ? 'md:col-span-2 lg:col-span-2' :
                ''
              }`}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">{widget.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setExpandedWidget(
                      expandedWidget === widget.id ? null : widget.id
                    )}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {expandedWidget === widget.id ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <WidgetComponent />
              </div>
            </div>
          )
        })}
      </div>

      {/* Customization Modal */}
      {isCustomizing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Customize Dashboard
              </h3>
              <button
                onClick={() => setIsCustomizing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Drag and drop widgets to reorder them on your dashboard.
              </p>

              <div className="space-y-2">
                {availableWidgets.map((widget) => (
                  <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-move"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded">
                      <Settings className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {widget.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {widget.defaultSize.charAt(0).toUpperCase() + 
                         widget.defaultSize.slice(1)} widget
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dashboardLayout.includes(widget.id)}
                    onChange={(e) => {
                      const newLayout = e.target.checked
                        ? [...dashboardLayout, widget.id]
                        : dashboardLayout.filter(id => id !== widget.id)
                      useSettingsStore.getState().updateDashboardLayout(newLayout)
                    }}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Widget Sizes
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {['small', 'medium', 'large'].map((size) => (
                  <div
                    key={size}
                    className="border rounded p-3 text-center"
                  >
                    <div className={`bg-gray-100 rounded mb-2 ${
                      size === 'small' ? 'h-16' :
                      size === 'medium' ? 'h-20' :
                      'h-24'
                    }`} />
                    <span className="text-sm text-gray-600">
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsCustomizing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save layout changes
                  setIsCustomizing(false)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)
}