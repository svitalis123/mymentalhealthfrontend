import { format } from "date-fns";
import { PrintStyles } from "./PrintStyles";

// src/components/print/PrintableClientReport.tsx
export const PrintableClientReport = ({ client, sessions, materials }: any) => (
  <div className="print-container">
    <PrintStyles />
    
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Client Progress Report</h1>
        <p className="text-gray-600">
          Report generated on {format(new Date(), 'PPPP')}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Client Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
          </div>
          <div>
            <p><strong>Start Date:</strong> {format(new Date(client.created_at), 'PP')}</p>
            <p><strong>Total Sessions:</strong> {sessions.length}</p>
            <p><strong>Materials Assigned:</strong> {materials.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 print-break-before">
        <h2 className="text-xl font-medium mb-4">Session History</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Key Points</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session: any) => (
              <tr key={session.id} className="border-t">
                <td className="py-2">{format(new Date(session.session_date), 'PP')}</td>
                <td className="py-2">{session.duration} minutes</td>
                <td className="py-2">{session.status}</td>
                <td className="py-2">{session.ai_summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 print-break-before">
        <h2 className="text-xl font-medium mb-4">Materials Progress</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Material</th>
              <th className="text-left py-2">Assigned Date</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material: any) => (
              <tr key={material.id} className="border-t">
                <td className="py-2">{material.title}</td>
                <td className="py-2">
                  {format(new Date(material.assigned_to[0].assigned_at), 'PP')}
                </td>
                <td className="py-2">
                  {material.assigned_to[0].completed_at ? 'Completed' : 'In Progress'}
                </td>
                <td className="py-2">{material.assigned_to[0].ai_feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-8 border-t">
        <p className="text-sm text-gray-500">
          This report is confidential and intended only for therapeutic purposes.
        </p>
      </div>
    </div>
  </div>
)