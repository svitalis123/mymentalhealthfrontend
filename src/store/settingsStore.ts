// src/store/settingsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    browser: boolean
    sessionReminders: boolean
    materialUpdates: boolean
  }
  dashboardLayout: string[]
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: string) => void
  setTimezone: (timezone: string) => void
  updateNotifications: (notifications: Partial<SettingsState['notifications']>) => void
  updateDashboardLayout: (layout: string[]) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: true,
        browser: true,
        sessionReminders: true,
        materialUpdates: true,
      },
      dashboardLayout: ['analytics', 'upcoming-sessions', 'recent-activities', 'client-stats'],
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      updateNotifications: (notifications) => 
        set((state) => ({ 
          notifications: { ...state.notifications, ...notifications } 
        })),
      updateDashboardLayout: (layout) => set({ dashboardLayout: layout }),
    }),
    {
      name: 'user-settings',
    }
  )
)