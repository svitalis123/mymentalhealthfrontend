// src/components/settings/UserSettings.tsx
import { useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import { Moon, Sun, Globe, Bell, Layout } from 'lucide-react'

export const UserSettings = () => {
  const settings = useSettingsStore()
  const [activeTab, setActiveTab] = useState('appearance')

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Settings Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8 px-6" aria-label="Settings">
          {[
            { id: 'appearance', icon: Sun, label: 'Appearance' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'preferences', icon: Globe, label: 'Preferences' },
            { id: 'dashboard', icon: Layout, label: 'Dashboard' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="p-6">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Theme</h3>
              <div className="mt-4 space-y-4">
                {['light', 'dark', 'system'].map((theme) => (
                  <div key={theme} className="flex items-center">
                    <input
                      type="radio"
                      id={`theme-${theme}`}
                      name="theme"
                      value={theme}
                      checked={settings.theme === theme}
                      onChange={(e) => settings.setTheme(e.target.value as any)}
                      className="h-4 w-4 border-gray-300 text-indigo-600"
                    />
                    <label
                      htmlFor={`theme-${theme}`}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications' },
                { id: 'browser', label: 'Browser Notifications' },
                { id: 'sessionReminders', label: 'Session Reminders' },
                { id: 'materialUpdates', label: 'Material Updates' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <button
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.notifications[id as keyof typeof settings.notifications]
                        ? 'bg-indigo-600'
                        : 'bg-gray-200'
                    }`}
                    onClick={() =>
                      settings.updateNotifications({
                        [id]: !settings.notifications[id as keyof typeof settings.notifications],
                      })
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        settings.notifications[id as keyof typeof settings.notifications]
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Language</h3>
              <select
                value={settings.language}
                onChange={(e) => settings.setLanguage(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Timezone</h3>
              <select
                value={settings.timezone}
                onChange={(e) => settings.setTimezone(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300"
              >
                {Intl.supportedValuesOf('timeZone').map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Dashboard Layout</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Visible Widgets
                </h4>
                <div className="space-y-2">
                  {settings.dashboardLayout.map((widgetId, index) => (
                    <div
                      key={widgetId}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-600">
                        {widgetId.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          disabled={index === 0}
                          onClick={() => {
                            const newLayout = [...settings.dashboardLayout]
                            ;[newLayout[index], newLayout[index - 1]] = 
                              [newLayout[index - 1], newLayout[index]]
                            settings.updateDashboardLayout(newLayout)
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          disabled={index === settings.dashboardLayout.length - 1}
                          onClick={() => {
                            const newLayout = [...settings.dashboardLayout]
                            ;[newLayout[index], newLayout[index + 1]] = 
                              [newLayout[index + 1], newLayout[index]]
                            settings.updateDashboardLayout(newLayout)
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}