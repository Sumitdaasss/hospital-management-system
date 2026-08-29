import { useState, useEffect, useCallback } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Droplet, Heart, Edit2, Save, X } from 'lucide-react'
import { getPatients, updatePatient } from '../../services/patientService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../components/ToastContext'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/auth'
import { formatDate } from '../../utils/dateUtils'
import { GENDERS, BLOOD_GROUPS } from '../../utils/constants'

export default function PatientProfile() {
  const { userId, username, email } = useAuth()
  const toast = useToast()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getPatients()
      const patients = res.data || []
      const found = patients.find((p) => p.email === email || p.id == userId)
      if (found) {
        setPatient(found)
        setForm(found)
      } else {
        setPatient(null)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [email, userId])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updatePatient(patient.id, form)
      toast.success('Profile updated successfully')
      setEditing(false)
      fetchProfile()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading profile..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchProfile} />

  if (!patient) {
    return (
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <div className="card">
          <EmptyState
            title="No patient record found"
            message="Your patient profile has not been set up yet. Please contact the administrator."
            icon={User}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1">View and update your personal information</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-1 text-sm">
            <Edit2 size={16} /> Edit
          </button>
        )}
      </div>

      <div className="card p-6">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input type="text" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                <input type="date" value={form.dateOfBirth || ''} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                <select value={form.gender || 'MALE'} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field">
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Group</label>
                <select value={form.bloodGroup || ''} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="input-field">
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <textarea value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Health Problem</label>
                <textarea value={form.healthProblem || ''} onChange={(e) => setForm({ ...form, healthProblem: e.target.value })} className="input-field" rows={2} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setEditing(false); setForm(patient) }} className="btn-secondary flex items-center gap-1">
                <X size={16} /> Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <User className="text-primary-600" size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{patient.name || username}</h2>
                <p className="text-sm text-slate-500">{patient.email || email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={patient.email} />
              <InfoRow icon={Phone} label="Phone" value={patient.phone} />
              <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(patient.dateOfBirth)} />
              <InfoRow icon={User} label="Gender" value={patient.gender} />
              <InfoRow icon={Droplet} label="Blood Group" value={patient.bloodGroup} />
              <InfoRow icon={MapPin} label="Address" value={patient.address} />
            </div>
            {patient.healthProblem && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                  <Heart size={16} className="text-primary-600" /> Health Problem
                </label>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700">{patient.healthProblem}</div>
              </div>
            )}
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
