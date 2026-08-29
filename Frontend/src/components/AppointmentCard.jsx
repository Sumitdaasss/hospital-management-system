import { Link } from 'react-router-dom'
import { Calendar, Clock, User, Stethoscope, Eye } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate, formatTime } from '../utils/dateUtils'

export default function AppointmentCard({ appointment, onCancel, onStatusChange, onView, showPatient = true, showDoctor = true, viewLink }) {
  return (
    <div className="card p-5 animate-slide-up hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          {showPatient && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={16} className="text-slate-400" />
              <span className="truncate">{appointment.patientName || appointment.patient?.name || 'Patient'}</span>
            </div>
          )}
          {showDoctor && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Stethoscope size={16} className="text-slate-400" />
              <span className="truncate">Dr. {appointment.doctorName || appointment.doctor?.name || 'Doctor'}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar size={16} className="text-slate-400" />
            <span>{formatDate(appointment.appointmentDate || appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={16} className="text-slate-400" />
            <span>{formatTime(appointment.appointmentTime || appointment.time)}</span>
          </div>
          {appointment.problem && (
            <p className="text-sm text-slate-500 mt-2 bg-slate-50 rounded-lg px-3 py-2">{appointment.problem}</p>
          )}
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {viewLink && (
          <Link to={viewLink} className="btn-secondary text-sm flex-1 flex items-center justify-center gap-1">
            <Eye size={16} /> View Details
          </Link>
        )}
        {onView && !viewLink && (
          <button onClick={() => onView(appointment.id)} className="btn-secondary text-sm flex-1 flex items-center justify-center gap-1">
            <Eye size={16} /> View Details
          </button>
        )}
        {onStatusChange && appointment.status === 'BOOKED' && (
          <>
            <button onClick={() => onStatusChange(appointment.id, 'COMPLETED')} className="btn-primary text-sm flex-1">
              Mark Completed
            </button>
            <button onClick={() => onStatusChange(appointment.id, 'CANCELLED')} className="btn-danger text-sm flex-1">
              Cancel
            </button>
          </>
        )}
        {onCancel && appointment.status === 'BOOKED' && (
          <button onClick={() => onCancel(appointment.id)} className="btn-danger text-sm flex-1">
            Cancel Appointment
          </button>
        )}
      </div>
    </div>
  )
}
