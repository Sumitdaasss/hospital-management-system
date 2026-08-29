import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Eye } from 'lucide-react'
import { getDoctorAppointments, updateAppointmentStatus } from '../../services/appointmentService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastContext'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage, formatDate, formatTime } from '../../utils/auth'

export default function DoctorAppointments() {
  const { userId } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [statusUpdate, setStatusUpdate] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const toast = useToast()

  const fetchAppointments = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const res = await getDoctorAppointments(userId)
      setAppointments(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [userId])

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
        <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
        <p className="text-slate-500 mt-1">View and manage your patient appointments</p>
      </div>

      <div className="card p-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-56">
          <option value="">All Statuses</option>
          <option value="BOOKED">BOOKED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState title="No appointments found" message="Appointments will appear here once booked." icon={CalendarDays} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="card p-5 animate-slide-up">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-slate-800">{a.patientName || a.patient?.name || 'Patient'}</p>
                  <p className="text-sm text-slate-500">{formatDate(a.appointmentDate || a.date)} at {formatTime(a.appointmentTime || a.time)}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.problem && <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 mt-2">{a.problem}</p>}
              <div className="flex gap-2 mt-4">
                <Link to={`/doctor/appointments/${a.id}`} className="btn-secondary text-sm flex-1 flex items-center justify-center gap-1">
                  <Eye size={16} /> View Details
                </Link>
                {a.status === 'BOOKED' && (
                  <>
                    <button onClick={() => openStatusUpdate(a, 'COMPLETED')} className="btn-primary text-sm flex-1">Complete</button>
                    <button onClick={() => openStatusUpdate(a, 'CANCELLED')} className="btn-danger text-sm flex-1">Cancel</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!statusUpdate}
        onClose={() => setStatusUpdate(null)}
        onConfirm={handleStatusUpdate}
        title="Update Appointment Status?"
        message={`Are you sure you want to mark this appointment as ${newStatus}?`}
        confirmText="Confirm"
        danger={newStatus === 'CANCELLED'}
      />
    </div>
  )
}
