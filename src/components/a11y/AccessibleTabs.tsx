// src/components/a11y/AccessibleTabs.tsx
import { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface AccessibleTabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export const AccessibleTabs = ({ tabs, defaultTab }: AccessibleTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id)

  const handleKeyNav = (e: React.KeyboardEvent, index: number) => {
    const lastIndex = tabs.length - 1
    let newIndex = index

    switch (e.key) {
      case 'ArrowLeft':
        newIndex = index === 0 ? lastIndex : index - 1
        break
      case 'ArrowRight':
        newIndex = index === lastIndex ? 0 : index + 1
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = lastIndex
        break
      default:
        return
    }

    e.preventDefault()
    const newTab = tabs[newIndex]
    setActiveTab(newTab.id)
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Tab navigation"
        className="border-b border-gray-200"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyNav(e, index)}
            className={`px-4 py-2 text-sm font-medium border-b-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="py-4 focus:outline-none"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}