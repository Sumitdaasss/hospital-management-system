import { useState, useEffect } from 'react'
import { UserCog, Users, CalendarDays, CalendarCheck } from 'lucide-react'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { getDoctors } from '../../services/doctorService'
import { getPatients } from '../../services/patientService'
import { getAppointments } from '../../services/appointmentService'
import { getErrorMessage, formatDate, formatTime, isToday } from '../../utils/auth'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, booked: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [docRes, patRes, apptRes] = await Promise.all([
        getDoctors(),
        getPatients(),
        getAppointments(),
      ])
      const doctors = docRes.data || []
      const patients = patRes.data || []
      const appointments = apptRes.data || []
      setStats({
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointments.length,
        booked: appointments.filter((a) => a.status === 'BOOKED').length,
      })
      const sorted = [...appointments].sort((a, b) => {
        const da = new Date(a.appointmentDate || a.date || 0)
        const db = new Date(b.appointmentDate || b.date || 0)
        return db - da
      })
      setRecent(sorted.slice(0, 5))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchAll} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of hospital operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UserCog} label="Total Doctors" value={stats.doctors} color="primary" />
        <StatCard icon={Users} label="Total Patients" value={stats.patients} color="accent" />
        <StatCard icon={CalendarDays} label="Total Appointments" value={stats.appointments} color="amber" />
        <StatCard icon={CalendarCheck} label="Booked Appointments" value={stats.booked} color="green" />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Appointments</h2>
        {recent.length === 0 ? (
          <EmptyState title="No appointments found" message="Appointments will appear here once booked." icon={CalendarDays} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 text-slate-700">{a.patientName || a.patient?.name || 'N/A'}</td>
                    <td className="py-3 text-slate-700">{a.doctorName || a.doctor?.name || 'N/A'}</td>
                    <td className="py-3 text-slate-600">{formatDate(a.appointmentDate || a.date)}</td>
                    <td className="py-3 text-slate-600">{formatTime(a.appointmentTime || a.time)}</td>
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
