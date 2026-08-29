import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, User, Stethoscope, FileText, Activity, Trash2 } from 'lucide-react'
import { getAppointmentById, cancelAppointment } from '../../services/appointmentService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastContext'
import { getErrorMessage } from '../../utils/auth'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function PatientAppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelTarget, setCancelTarget] = useState(null)

  const fetchAppointment = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAppointmentById(id)
      setAppointment(res.data || null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchAppointment() }, [fetchAppointment])

  const handleCancel = async () => {
    try {
      await cancelAppointment(cancelTarget.id)
      toast.success('Appointment cancelled successfully')
      setCancelTarget(null)
      fetchAppointment()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner message="Loading appointment..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchAppointment} />
  if (!appointment) return <EmptyState title="Appointment not found" message="This appointment does not exist." icon={Calendar} />

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/patient/appointments" className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
        <ArrowLeft size={16} /> Back to My Appointments
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Appointment #{appointment.id}</h1>
            <p className="text-slate-500 mt-1">Appointment details and status</p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard icon={Stethoscope} label="Doctor" value={`Dr. ${appointment.doctorName || appointment.doctor?.name || 'N/A'}`} />
          <InfoCard icon={User} label="Patient" value={appointment.patientName || appointment.patient?.name || 'N/A'} />
          <InfoCard icon={Calendar} label="Date" value={formatDate(appointment.appointmentDate || appointment.date)} />
          <InfoCard icon={Clock} label="Time" value={formatTime(appointment.appointmentTime || appointment.time)} />
          <InfoCard icon={Activity} label="Status" value={appointment.status} />
          <InfoCard icon={FileText} label="Created" value={formatDate(appointment.createdAt || appointment.createdDate)} />
        </div>

        {appointment.problem && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Problem</label>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700">{appointment.problem}</div>
          </div>
        )}

        {appointment.status === 'BOOKED' && (
          <div className="mt-6">
            <button onClick={() => setCancelTarget(appointment)} className="btn-danger flex items-center gap-2">
              <Trash2 size={18} /> Cancel Appointment
            </button>
          </div>
        )}
      </div>

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

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4">
      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="text-primary-600" size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  )
}
