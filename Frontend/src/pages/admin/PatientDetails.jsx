import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, Mail, Phone, MapPin, User, Calendar, Heart, Droplet, Edit2 } from 'lucide-react'
import { getPatientById } from '../../services/patientService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { getErrorMessage } from '../../utils/auth'
import { formatDate } from '../../utils/dateUtils'

export default function AdminPatientDetails() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPatient = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getPatientById(id)
      setPatient(res.data || null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchPatient() }, [fetchPatient])

  if (loading) return <LoadingSpinner message="Loading patient details..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchPatient} />
  if (!patient) return <EmptyState title="Patient not found" message="This patient does not exist." icon={Users} />

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/patients" className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
        <ArrowLeft size={16} /> Back to Patients
      </Link>

      <div className="card p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Users className="text-primary-600" size={40} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">{patient.name || patient.username}</h1>
            <p className="text-primary-600 font-medium mt-1">{patient.email}</p>
            {patient.bloodGroup && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium mt-3">
                <Droplet size={14} /> Blood Group: {patient.bloodGroup}
              </span>
            )}
          </div>
          <Link to="/admin/patients" className="btn-secondary flex items-center gap-1 text-sm">
            <Edit2 size={16} /> Edit
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Patient Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label="Email" value={patient.email} />
          <InfoRow icon={Phone} label="Phone" value={patient.phone} />
          <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(patient.dateOfBirth)} />
          <InfoRow icon={User} label="Gender" value={patient.gender} />
          <InfoRow icon={Droplet} label="Blood Group" value={patient.bloodGroup} />
          <InfoRow icon={MapPin} label="Address" value={patient.address} />
        </div>
        {patient.healthProblem && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1">
              <Heart size={16} className="text-primary-600" /> Health Problem
            </label>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700">{patient.healthProblem}</div>
          </div>
        )}
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
