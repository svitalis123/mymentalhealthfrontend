// src/components/sessions/SessionTemplates.tsx
import { useState } from 'react'
// import { useSettingsStore } from '../../store/settingsStore'
import { Plus, Copy, Trash2, Edit2 } from 'lucide-react'

interface SessionTemplate {
  id: string
  name: string
  duration: number
  structure: string
  defaultNotes: string
  goals: string[]
}

export const SessionTemplates = () => {
  const [templates, setTemplates] = useState<SessionTemplate[]>([
    {
      id: '1',
      name: 'Initial Consultation',
      duration: 50,
      structure: `1. Introduction and rapport building
2. Current concerns and presenting problems
3. Brief history and background
4. Goals and expectations
5. Treatment options discussion
6. Next steps and scheduling`,
      defaultNotes: `Client presented for initial consultation. 
Key concerns discussed:
• 
• 
• 

Mental Status:
• Appearance:
• Mood/Affect:
• Thought Process:
• Risk Assessment:`,
      goals: ['Establish therapeutic alliance', 'Assess presenting problems', 'Develop initial treatment plan']
    },
    {
      id: '2',
      name: 'Follow-up Session',
      duration: 50,
      structure: `1. Check-in and updates
2. Review previous session
3. Address current concerns
4. Skill practice/intervention
5. Homework assignment
6. Session summary`,
      defaultNotes: `Session Focus:
Progress Review:
• 
• 

Interventions Used:
• 

Homework Assigned:
• 

Plan for Next Session:
• `,
      goals: ['Review progress', 'Address current concerns', 'Practice skills']
    }
  ])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<SessionTemplate>>({})
  const [showTemplateForm, setShowTemplateForm] = useState(false)

  const handleSaveTemplate = (template: Partial<SessionTemplate>) => {
    if (isEditing) {
      setTemplates(prev => 
        prev.map(t => t.id === isEditing ? { ...t, ...template } : t)
      )
      setIsEditing(null)
    } else {
      setTemplates(prev => [...prev, {
        ...template,
        id: Date.now().toString(),
      } as SessionTemplate])
    }
    setShowTemplateForm(false)
    setNewTemplate({})
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Session Templates</h2>
        <button
          onClick={() => setShowTemplateForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Template List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-lg border p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {template.duration} minutes
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(template.id)
                    setNewTemplate(template)
                    setShowTemplateForm(true)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const newTemplate = { ...template, id: Date.now().toString() }
                    setTemplates(prev => [...prev, newTemplate])
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTemplates(prev => prev.filter(t => t.id !== template.id))
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Session Structure
              </h4>
              <div className="text-sm text-gray-600 whitespace-pre-line">
                {template.structure}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Session Goals
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {template.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                // Use template logic here
                console.log('Using template:', template)
              }}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Edit Template' : 'Create New Template'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name || ''}
                  onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newTemplate.duration || ''}
                  onChange={e => setNewTemplate({ ...newTemplate, duration: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Session Structure
                </label>
                <textarea
                  value={newTemplate.structure || ''}
                  onChange={e => setNewTemplate({ ...newTemplate, structure: e.target.value })}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Notes Template
                </label>
                <textarea
                  value={newTemplate.defaultNotes || ''}
                  onChange={e => setNewTemplate({ ...newTemplate, defaultNotes: e.target.value })}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Session Goals (one per line)
                </label>
                <textarea
                  value={newTemplate.goals?.join('\n') || ''}
                  onChange={e => setNewTemplate({
                    ...newTemplate,
                    goals: e.target.value.split('\n').filter(Boolean)
                  })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTemplateForm(false)
                  setNewTemplate({})
                  setIsEditing(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveTemplate(newTemplate)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {isEditing ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}