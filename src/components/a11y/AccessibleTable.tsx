// src/components/a11y/AccessibleTable.tsx
interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

interface AccessibleTableProps<T> {
  data: T[]
  columns: Column<T>[]
  caption?: string
  onRowClick?: (item: T) => void
}

export function AccessibleTable<T>({
  data,
  columns,
  caption,
  onRowClick
}: AccessibleTableProps<T>) {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Data table" tabIndex={0}>
      <table className="min-w-full divide-y divide-gray-200">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={String(column.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onRowClick?.(item)
                }
              }}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'button' : undefined}
              className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
            >
              {columns.map(column => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div
          className="text-center py-8 text-gray-500"
          role="status"
          aria-live="polite"
        >
          No data available
        </div>
      )}
    </div>
  )
}