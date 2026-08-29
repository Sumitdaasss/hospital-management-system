import { useState, useEffect, useCallback } from 'react'
import { CalendarDays } from 'lucide-react'
import { getPatientAppointments, cancelAppointment } from '../../services/appointmentService'
import AppointmentCard from '../../components/AppointmentCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastContext'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/auth'

export default function PatientAppointments() {
  const { userId } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cancelTarget, setCancelTarget] = useState(null)
  const toast = useToast()

  const fetchAppointments = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const res = await getPatientAppointments(userId)
      setAppointments(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const filtered = statusFilter ? appointments.filter((a) => a.status === statusFilter) : appointments

  const handleCancel = async () => {
    try {
      await cancelAppointment(cancelTarget)
      toast.success('Appointment cancelled successfully')
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
        <p className="text-slate-500 mt-1">View and manage your appointments</p>
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
        <div className="card"><EmptyState title="No appointments found" message="Book an appointment to see it here." icon={CalendarDays} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AppointmentCard key={a.id} appointment={a} showDoctor={true} showPatient={false} onCancel={(id) => setCancelTarget(id)} viewLink={`/patient/appointments/${a.id}`} />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Cancel Appointment"
      />
    </div>
  )
}
