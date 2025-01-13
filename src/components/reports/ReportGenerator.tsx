// src/components/reports/ReportGenerator.tsx
import { useState, useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useClientStore } from '../../store/clientStore'
import { useMaterialStore } from '../../store/materialStore'
import { format } from 'date-fns'
import { FileText, Download, Filter, Printer } from 'lucide-react'

interface ReportConfig {
  type: 'sessions' | 'clients' | 'materials'
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'custom'
  format: 'pdf' | 'csv' | 'excel'
  includeFields: string[]
  customDateRange?: {
    start: Date
    end: Date
  }
}

export const ReportGenerator = () => {
  const { sessions } = useSessionStore()
  const { clients } = useClientStore()
  const { materials } = useMaterialStore()
  const [config, setConfig] = useState<ReportConfig>({
    type: 'sessions',
    dateRange: 'month',
    format: 'pdf',
    includeFields: []
  })

  const availableFields = useMemo(() => ({
    sessions: [
      'date', 'client', 'therapist', 'duration', 'status', 'notes', 'ai_summary'
    ],
    clients: [
      'name', 'email', 'phone', 'created_at', 'session_count', 'ai_insights'
    ],
    materials: [
      'title', 'category', 'difficulty_level', 'assigned_count', 'completion_rate'
    ]
  }), [])

  const generateReport = async () => {
    let reportData: any[] = []
    
    switch (config.type) {
      case 'sessions':
        reportData = sessions.map(session => ({
          date: format(new Date(session.session_date), 'PPP'),
          client: session.client.name,
          therapist: session.therapist.name,
          duration: `${session.duration} minutes`,
          status: session.status,
          notes: session.notes,
          ai_summary: session.ai_summary
        }))
        break
      
      case 'clients':
        reportData = clients.map(client => ({
          name: client.name,
          email: client.email,
          phone: client.phone,
          created_at: format(new Date(client.created_at), 'PPP'),
          session_count: sessions.filter(s => s.client_id === client.id).length,
          ai_insights: client.ai_insights
        }))
        break
      
      case 'materials':
        reportData = materials.map(material => ({
          title: material.title,
          category: material.category,
          difficulty_level: material.difficulty_level,
          assigned_count: material.assigned_to?.length || 0,
          completion_rate: `${calculateCompletionRate(material.id)}%`
        }))
        break
    }

    // Filter fields based on configuration
    reportData = reportData.map(item => {
      const filteredItem: any = {}
      config.includeFields.forEach(field => {
        if (item[field] !== undefined) {
          filteredItem[field] = item[field]
        }
      })
      return filteredItem
    })

    // Export based on format
    switch (config.format) {
      case 'csv':
        exportCSV(reportData)
        break
      case 'excel':
        exportExcel(reportData)
        break
      case 'pdf':
        exportPDF(reportData)
        break
    }
  }

  const calculateCompletionRate = (materialId: number) => {
    const material = materials.find(m => m.id === materialId)
    if (!material?.assigned_to?.length) return 0
    
    const completedCount = material.assigned_to.filter(a => a.completed_at).length
    return Math.round((completedCount / material.assigned_to.length) * 100)
  }

  const exportCSV = (data: any[]) => {
    const headers = config.includeFields.join(',')
    const rows = data.map(row => 
      config.includeFields.map(field => `"${row[field]}"`).join(',')
    )
    
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${config.type}-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportExcel = (data: any[]) => {
    // Similar to CSV but with Excel formatting
    // In a real app, you might want to use a library like xlsx
    exportCSV(data) // Fallback to CSV for this example
  }

  const exportPDF = (data: any[]) => {
    // In a real app, you would use a library like pdfmake or jspdf
    console.log('PDF export not implemented in this example')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Generate Report</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={config.type}
              onChange={(e) => setConfig({
                ...config,
                type: e.target.value as ReportConfig['type'],
                includeFields: []
              })}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="sessions">Sessions Report</option>
              <option value="clients">Clients Report</option>
              <option value="materials">Materials Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <select
              value={config.dateRange}
              onChange={(e) => setConfig({
                ...config,
                dateRange: e.target.value as ReportConfig['dateRange']
              })}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {config.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={config.customDateRange?.start?.toISOString().split('T')[0]}
                  onChange={(e) => setConfig({
                    ...config,
                    customDateRange: {
                      ...config.customDateRange,
                      start: new Date(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={config.customDateRange?.end?.toISOString().split('T')[0]}
                  onChange={(e) => setConfig({
                    ...config,
                    customDateRange: {
                      ...config.customDateRange,
                      end: new Date(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Include Fields</label>
            <div className="mt-2 space-y-2">
              {availableFields[config.type].map(field => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.includeFields.includes(field)}
                    onChange={(e) => {
                      const newFields = e.target.checked
                        ? [...config.includeFields, field]
                        : config.includeFields.filter(f => f !== field)
                      setConfig({ ...config, includeFields: newFields })
                    }}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {field.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Export Format</label>
            <div className="mt-2 flex space-x-4">
              {['pdf', 'csv', 'excel'].map(format => (
                <label key={format} className="flex items-center">
                  <input
                    type="radio"
                    checked={config.format === format}
                    onChange={() => setConfig({ ...config, format: format as ReportConfig['format'] })}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {format.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setConfig({
              type: 'sessions',
              dateRange: 'month',
              format: 'pdf',
              includeFields: []
            })}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={generateReport}
            disabled={config.includeFields.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}