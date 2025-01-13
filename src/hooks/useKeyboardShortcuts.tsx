// src/hooks/useKeyboardShortcuts.ts
import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '../store/settingsStore'

interface ShortcutAction {
  description: string
  action: () => void
  global?: boolean
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate()
  const settings = useSettingsStore()

  // Define all available shortcuts
  const shortcuts: Record<string, ShortcutAction> = {
    'n+s': {
      description: 'New Session',
      action: () => navigate('/sessions/new')
    },
    'n+c': {
      description: 'New Client',
      action: () => navigate('/clients/new')
    },
    'n+m': {
      description: 'New Material',
      action: () => navigate('/materials/new')
    },
    '/': {
      description: 'Search',
      action: () => document.querySelector<HTMLInputElement>('[data-search]')?.focus(),
      global: true
    },
    'g+d': {
      description: 'Go to Dashboard',
      action: () => navigate('/dashboard'),
      global: true
    },
    'g+c': {
      description: 'Go to Clients',
      action: () => navigate('/clients'),
      global: true
    },
    'g+s': {
      description: 'Go to Sessions',
      action: () => navigate('/sessions'),
      global: true
    },
    'g+m': {
      description: 'Go to Materials',
      action: () => navigate('/materials'),
      global: true
    },
    'escape': {
      description: 'Close Modal/Clear Selection',
      action: () => document.dispatchEvent(new CustomEvent('app:escape')),
      global: true
    }
  }

  // Track pressed keys
  let pressedKeys: string[] = []
  let pressTimer: NodeJS.Timeout

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      if (event.key !== 'Escape') return
    }

    pressedKeys.push(event.key.toLowerCase())
    clearTimeout(pressTimer)

    // Reset pressed keys after a delay
    pressTimer = setTimeout(() => {
      pressedKeys = []
    }, 1000)

    // Check for shortcuts
    const pressedShortcut = pressedKeys.join('+')
    const shortcut = shortcuts[pressedShortcut]

    if (shortcut) {
      event.preventDefault()
      shortcut.action()
      pressedKeys = []
    }
  }, [navigate])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    shortcuts,
    ShortcutHelper: () => (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => settings.toggleShortcutsHelp()}
          className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
          title="Keyboard Shortcuts"
        >
          ⌘
        </button>
      </div>
    ),
    ShortcutsModal: () => (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(shortcuts).map(([key, { description, global }]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-600">{description}</span>
                <div className="flex items-center space-x-2">
                  {global && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Global
                    </span>
                  )}
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                    {key.split('+').map(k => k.toUpperCase()).join(' + ')}
                  </kbd>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}