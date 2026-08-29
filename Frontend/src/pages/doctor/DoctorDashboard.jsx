import { useState, useEffect, useCallback } from 'react'
import { CalendarDays, CalendarCheck, Clock, CalendarClock } from 'lucide-react'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { getDoctorAppointments } from '../../services/appointmentService'
import { getDoctorAvailability } from '../../services/availabilityService'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage, formatDate, formatTime, isToday } from '../../utils/auth'

export default function DoctorDashboard() {
  const { userId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState([])
  const [availability, setAvailability] = useState([])

  const fetchData = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const [apptRes, availRes] = await Promise.all([
        getDoctorAppointments(userId),
        getDoctorAvailability(userId),
      ])
      setAppointments(apptRes.data || [])
      setAvailability(availRes.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />

  const todays = appointments.filter((a) => isToday(a.appointmentDate || a.date))
  const upcoming = appointments.filter((a) => a.status === 'BOOKED' && new Date(a.appointmentDate || a.date) > new Date())
  const completed = appointments.filter((a) => a.status === 'COMPLETED')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
        <p className="text-slate-500 mt-1">Your appointments and schedule overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Today's Appointments" value={todays.length} color="primary" />
        <StatCard icon={CalendarCheck} label="Upcoming" value={upcoming.length} color="accent" />
        <StatCard icon={CalendarCheck} label="Completed" value={completed.length} color="green" />
        <StatCard icon={CalendarClock} label="Availability Slots" value={availability.length} color="amber" />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Appointments</h2>
        {todays.length === 0 ? (
          <EmptyState title="No appointments today" message="You have no appointments scheduled for today." icon={CalendarDays} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Problem</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {todays.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 text-slate-700 font-medium">{a.patientName || a.patient?.name || 'N/A'}</td>
                    <td className="py-3 text-slate-600">{formatTime(a.appointmentTime || a.time)}</td>
                    <td className="py-3 text-slate-600 max-w-xs truncate">{a.problem || 'N/A'}</td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
