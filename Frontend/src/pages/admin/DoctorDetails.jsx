import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Stethoscope, Award, Clock, Mail, Phone, MapPin, User, Edit2 } from 'lucide-react'
import { getDoctorById } from '../../services/doctorService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { getErrorMessage } from '../../utils/auth'
import { formatDate } from '../../utils/dateUtils'

export default function AdminDoctorDetails() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoctor = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getDoctorById(id)
      setDoctor(res.data || null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchDoctor() }, [fetchDoctor])

  if (loading) return <LoadingSpinner message="Loading doctor details..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchDoctor} />
  if (!doctor) return <EmptyState title="Doctor not found" message="This doctor does not exist." icon={Stethoscope} />

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/doctors" className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
        <ArrowLeft size={16} /> Back to Doctors
      </Link>

      <div className="card p-8">
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
                  <Clock size={14} /> {doctor.experience} years
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${doctor.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`} />
                {doctor.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
          <Link to="/admin/doctors" className="btn-secondary flex items-center gap-1 text-sm">
            <Edit2 size={16} /> Edit
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact & Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label="Email" value={doctor.email} />
          <InfoRow icon={Phone} label="Phone" value={doctor.phone} />
          <InfoRow icon={User} label="Gender" value={doctor.gender} />
          <InfoRow icon={MapPin} label="Address" value={doctor.address} />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4">
      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="text-primary-600" size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value || 'N/A'}</p>
      </div>
    </div>
  )
}
