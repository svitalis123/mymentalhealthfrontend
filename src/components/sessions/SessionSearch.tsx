// src/components/sessions/SessionSearch.tsx
import { useState, useMemo } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useClientStore } from '../../store/clientStore'
import { format, isWithinInterval, startOfDay, endOfDay, subDays } from 'date-fns'
import { Search, Filter, ChevronDown, X } from 'lucide-react'

interface FilterState {
  searchTerm: string
  dateRange: 'today' | 'week' | 'month' | 'all'
  status: string[]
  clients: number[]
}

export const SessionSearch = () => {
  const { sessions } = useSessionStore()
  const { clients } = useClientStore()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    dateRange: 'all',
    status: [],
    clients: []
  })

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesClient = session.client.name.toLowerCase().includes(searchLower)
        const matchesNotes = session.notes?.toLowerCase().includes(searchLower)
        if (!matchesClient && !matchesNotes) return false
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const sessionDate = new Date(session.session_date)
        const today = new Date()
        let rangeStart: Date

        switch (filters.dateRange) {
          case 'today':
            if (!isWithinInterval(sessionDate, {
              start: startOfDay(today),
              end: endOfDay(today)
            })) return false
            break
          case 'week':
            rangeStart = subDays(today, 7)
            if (sessionDate < rangeStart) return false
            break
          case 'month':
            rangeStart = subDays(today, 30)
            if (sessionDate < rangeStart) return false
            break
        }
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(session.status)) {
        return false
      }

      // Client filter
      if (filters.clients.length > 0 && !filters.clients.includes(session.client_id)) {
        return false
      }

      return true
    })
  }, [sessions, filters])

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      dateRange: 'all',
      status: [],
      clients: []
    })
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sessions by client name or notes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-4 px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as FilterState['dateRange'] }))}
                className="w-full rounded-lg border-gray-300"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['scheduled', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter(s => s !== status)
                        : [...prev.status, status]
                    }))}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.status.includes(status)
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clients
              </label>
              <select
                multiple
                value={filters.clients.map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => Number(option.value))
                  setFilters(prev => ({ ...prev, clients: selected }))
                }}
                className="w-full rounded-lg border-gray-300"
                size={4}
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(filters.status.length > 0 || filters.clients.length > 0 || filters.dateRange !== 'all') && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.dateRange !== 'all' && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                {filters.dateRange}
                <button onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status.map(status => (
              <span key={status} className="px-2 py-1 bg-indigo-100 rounded-full text-sm flex items-center gap-1">
                {status}
                <button onClick={() => setFilters(prev => ({
                  ...prev,
                  status: prev.status.filter(s => s !== status)
                }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Found {filteredSessions.length} sessions
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredSessions.map(session => (
          <div key={session.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">{session.client.name}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(session.session_date), 'PPP p')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                session.status === 'completed' ? 'bg-green-100 text-green-800' :
                session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {session.status}
              </span>
            </div>
            {session.notes && (
              <p className="mt-2 text-sm text-gray-600">{session.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}