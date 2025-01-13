// src/components/print/PrintableSession.tsx
import { format } from 'date-fns'
import { PrintStyles } from './PrintStyles'

interface PrintableSessionProps {
  session: any
}

export const PrintableSession = ({ session }: PrintableSessionProps) => (
  <div className="print-container">
    <PrintStyles />
    
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Session Report</h1>
        <p className="text-gray-600">
          {format(new Date(session.session_date), 'PPPP')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Client Information</h2>
          <p><strong>Name:</strong> {session.client.name}</p>
          <p><strong>Email:</strong> {session.client.email}</p>
          <p><strong>Phone:</strong> {session.client.phone}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">Session Details</h2>
          <p><strong>Duration:</strong> {session.duration} minutes</p>
          <p><strong>Status:</strong> {session.status}</p>
          <p><strong>Therapist:</strong> {session.therapist.name}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Session Notes</h2>
        <div className="whitespace-pre-line">
          {session.notes}
        </div>
      </div>

      {session.ai_summary && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">AI Summary</h2>
          <div className="whitespace-pre-line">
            {session.ai_summary}
          </div>
        </div>
      )}

      <div className="mt-8 pt-8 border-t">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Printed on: {format(new Date(), 'PPP')}</p>
          </div>
          <div className="text-sm text-gray-500">
            Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  </div>
)
