import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Stethoscope, Award, Clock, Mail, Phone, MapPin, Calendar, ArrowLeft,
  CalendarClock, User, Activity
} from 'lucide-react'
import { getDoctorById } from '../../services/doctorService'
import { getDoctorAvailability } from '../../services/availabilityService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/auth'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function DoctorDetails() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [docRes, availRes] = await Promise.all([
        getDoctorById(id),
        getDoctorAvailability(id),
      ])
      setDoctor(docRes.data || null)
      const avail = (availRes.data || []).filter((a) => a.available !== false)
      avail.sort((a, b) => new Date(a.date) - new Date(b.date))
      setAvailability(avail)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/patient/book-appointment', { state: { doctorId: id } })
  }

  if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><LoadingSpinner message="Loading doctor profile..." /></div>
  if (error) return <div className="min-h-screen bg-slate-50"><Navbar /><ErrorMessage message={error} onRetry={fetchData} /></div>
  if (!doctor) return <div className="min-h-screen bg-slate-50"><Navbar /><EmptyState title="Doctor not found" message="This doctor profile does not exist." icon={Stethoscope} /></div>

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/doctors" className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline mb-6">
          <ArrowLeft size={16} /> Back to Doctors
        </Link>

        {/* Doctor Header Card */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="text-primary-600" size={40} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">Dr. {doctor.name || doctor.username}</h1>
              <p className="text-primary-600 font-medium mt-1">{doctor.specialization || 'General Medicine'}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {doctor.qualification && (
                  <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Award size={14} /> {doctor.qualification}
                  </span>
                )}
                {doctor.experience != null && (
                  <span className="inline-flex items-center gap-1 bg-accent-50 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Clock size={14} /> {doctor.experience} years experience
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${doctor.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`} />
                  {doctor.available ? 'Available' : 'Currently Unavailable'}
                </span>
              </div>
            </div>
            {doctor.available && (
              <button onClick={handleBook} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <Calendar size={18} /> Book Appointment
              </button>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctor.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center"><Mail className="text-primary-600" size={20} /></div>
                <div><p className="text-xs text-slate-500">Email</p><p className="text-sm font-medium text-slate-800">{doctor.email}</p></div>
              </div>
            )}
            {doctor.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center"><Phone className="text-primary-600" size={20} /></div>
                <div><p className="text-xs text-slate-500">Phone</p><p className="text-sm font-medium text-slate-800">{doctor.phone}</p></div>
              </div>
            )}
            {doctor.gender && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center"><User className="text-primary-600" size={20} /></div>
                <div><p className="text-xs text-slate-500">Gender</p><p className="text-sm font-medium text-slate-800">{doctor.gender}</p></div>
              </div>
            )}
            {doctor.address && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center"><MapPin className="text-primary-600" size={20} /></div>
                <div><p className="text-xs text-slate-500">Address</p><p className="text-sm font-medium text-slate-800">{doctor.address}</p></div>
              </div>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CalendarClock className="text-primary-600" size={22} /> Doctor Availability
          </h2>
          {availability.length === 0 ? (
            <EmptyState title="No availability listed" message="This doctor has not posted any availability slots yet." icon={CalendarClock} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availability.map((a) => (
                <div key={a.id} className="border border-slate-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-primary-600" />
                    <p className="font-semibold text-slate-800">{formatDate(a.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={16} className="text-slate-400" />
                    <span>{formatTime(a.startTime)} - {formatTime(a.endTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {doctor.available && availability.length > 0 && (
            <div className="mt-6">
              <button onClick={handleBook} className="btn-primary w-full flex items-center justify-center gap-2">
                <Calendar size={18} /> Book Appointment with Dr. {doctor.name || doctor.username}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
