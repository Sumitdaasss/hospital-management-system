import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Eye } from 'lucide-react'
import { getAppointments, updateAppointmentStatus } from '../../services/appointmentService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastContext'
import { getErrorMessage, formatDate, formatTime } from '../../utils/auth'
import { APPOINTMENT_STATUSES } from '../../utils/constants'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [statusUpdate, setStatusUpdate] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const toast = useToast()

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAppointments()
      setAppointments(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const filtered = statusFilter ? appointments.filter((a) => a.status === statusFilter) : appointments

  const openStatusUpdate = (appt, status) => {
    setStatusUpdate(appt)
    setNewStatus(status)
  }

  const handleStatusUpdate = async () => {
    try {
      await updateAppointmentStatus(statusUpdate.id, newStatus)
      toast.success(`Appointment marked as ${newStatus}`)
      fetchAppointments()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner message="Loading appointments..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchAppointments} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Appointment Management</h1>
        <p className="text-slate-500 mt-1">View and manage all appointments</p>
      </div>

      <div className="card p-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-56">
          <option value="">All Statuses</option>
          {APPOINTMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState title="No appointments found" message="Appointments will appear here once booked." icon={CalendarDays} /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Problem</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">#{a.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{a.patientName || a.patient?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600">{a.doctorName || a.doctor?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(a.appointmentDate || a.date)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatTime(a.appointmentTime || a.time)}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{a.problem || 'N/A'}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <Link to={`/admin/appointments/${a.id}`} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg" title="View"><Eye size={16} /></Link>
                        {a.status === 'BOOKED' && (
                          <>
                            <button onClick={() => openStatusUpdate(a, 'COMPLETED')} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200 transition-colors">Complete</button>
                            <button onClick={() => openStatusUpdate(a, 'CANCELLED')} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-200 transition-colors">Cancel</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!statusUpdate}
        onClose={() => setStatusUpdate(null)}
        onConfirm={handleStatusUpdate}
        title="Update Appointment Status?"
        message={`Are you sure you want to mark appointment #${statusUpdate?.id} as ${newStatus}?`}
        confirmText="Confirm"
        danger={newStatus === 'CANCELLED'}
      />
    </div>
  )
}
