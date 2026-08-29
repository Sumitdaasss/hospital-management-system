import { Stethoscope, Mail, Phone, MapPin, Award, Clock } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function DoctorCard({ doctor, onView, onBook, showBook = false }) {
  return (
    <div className="card p-6 animate-slide-up hover:shadow-lg transition-all duration-200 hover:border-primary-300">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Stethoscope className="text-primary-600" size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-lg truncate">Dr. {doctor.name || doctor.username}</h3>
          <p className="text-primary-600 text-sm font-medium">{doctor.specialization || 'General'}</p>
        </div>
        <StatusBadge status={doctor.available ? 'COMPLETED' : 'CANCELLED'} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        {doctor.qualification && (
          <div className="flex items-center gap-2">
            <Award size={16} className="text-slate-400" />
            <span>{doctor.qualification}</span>
          </div>
        )}
        {doctor.experience != null && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <span>{doctor.experience} years experience</span>
          </div>
        )}
        {doctor.email && (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-slate-400" />
            <span className="truncate">{doctor.email}</span>
          </div>
        )}
        {doctor.phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-slate-400" />
            <span>{doctor.phone}</span>
          </div>
        )}
        {doctor.address && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <span className="truncate">{doctor.address}</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        {onView && (
          <button onClick={() => onView(doctor)} className="btn-secondary flex-1 text-sm">
            View Details
          </button>
        )}
        {showBook && onBook && (
          <button onClick={() => onBook(doctor)} className="btn-primary flex-1 text-sm">
            Book Appointment
          </button>
        )}
      </div>
    </div>
  )
}
