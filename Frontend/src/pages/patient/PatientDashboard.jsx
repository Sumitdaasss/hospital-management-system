import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Stethoscope, CalendarPlus, CalendarCheck, User } from 'lucide-react'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { getPatientAppointments } from '../../services/appointmentService'
import { getAvailableDoctors } from '../../services/doctorService'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage, formatDate, formatTime } from '../../utils/auth'

export default function PatientDashboard() {
  const { userId, username } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])

  const fetchData = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const [apptRes, docRes] = await Promise.all([
        getPatientAppointments(userId),
        getAvailableDoctors(),
      ])
      setAppointments(apptRes.data || [])
      setDoctors(docRes.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />

  const upcoming = appointments.filter((a) => a.status === 'BOOKED' && new Date(a.appointmentDate || a.date) >= new Date())
  const sortedUpcoming = [...upcoming].sort((a, b) => new Date(a.appointmentDate || a.date) - new Date(b.appointmentDate || b.date))
  const nextAppointment = sortedUpcoming[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {username}</h1>
        <p className="text-slate-500 mt-1">Your healthcare dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={CalendarCheck} label="Upcoming Appointment" value={upcoming.length} color="primary" />
        <StatCard icon={CalendarDays} label="Total Appointments" value={appointments.length} color="accent" />
        <StatCard icon={Stethoscope} label="Available Doctors" value={doctors.length} color="green" />
      </div>

      {nextAppointment && (
        <div className="card p-6 bg-gradient-to-r from-primary-600 to-accent-600 border-0 text-white">
          <h2 className="text-lg font-semibold mb-3">Next Appointment</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold">Dr. {nextAppointment.doctorName || nextAppointment.doctor?.name || 'Doctor'}</p>
              <p className="text-primary-100 mt-1">{formatDate(nextAppointment.appointmentDate || nextAppointment.date)} at {formatTime(nextAppointment.appointmentTime || nextAppointment.time)}</p>
              {nextAppointment.problem && <p className="text-primary-100 text-sm mt-2">{nextAppointment.problem}</p>}
            </div>
            <StatusBadge status={nextAppointment.status} />
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/patient/book-appointment" className="card p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200 flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <CalendarPlus className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Book Appointment</p>
              <p className="text-sm text-slate-500">Schedule a visit</p>
            </div>
          </Link>
          <Link to="/patient/doctors" className="card p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200 flex items-center gap-4 group">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:bg-accent-200 transition-colors">
              <Stethoscope className="text-accent-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">View Doctors</p>
              <p className="text-sm text-slate-500">Browse specialists</p>
            </div>
          </Link>
          <Link to="/patient/appointments" className="card p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200 flex items-center gap-4 group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <CalendarDays className="text-green-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">My Appointments</p>
              <p className="text-sm text-slate-500">View history</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <EmptyState title="No upcoming appointments" message="Book an appointment to see it here." icon={CalendarDays} />
        ) : (
          <div className="space-y-3">
            {sortedUpcoming.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Dr. {a.doctorName || a.doctor?.name || 'Doctor'}</p>
                    <p className="text-sm text-slate-500">{formatDate(a.appointmentDate || a.date)} at {formatTime(a.appointmentTime || a.time)}</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
