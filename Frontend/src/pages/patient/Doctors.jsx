import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stethoscope, Search, ArrowRight } from 'lucide-react'
import { getAvailableDoctors, getAvailableDoctorsBySpecialization } from '../../services/doctorService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { getErrorMessage } from '../../utils/auth'

export default function PatientDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [specFilter, setSpecFilter] = useState('')
  const navigate = useNavigate()

  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let res
      if (specFilter) {
        res = await getAvailableDoctorsBySpecialization(specFilter)
      } else {
        res = await getAvailableDoctors()
      }
      setDoctors(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [specFilter])

  useEffect(() => { fetchDoctors() }, [fetchDoctors])

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase()
    return !q ||
      (d.name || '').toLowerCase().includes(q) ||
      (d.specialization || '').toLowerCase().includes(q) ||
      (d.email || '').toLowerCase().includes(q)
  })

  const specializations = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))]

  const handleBook = (doctor) => {
    navigate('/patient/book-appointment', { state: { doctorId: doctor.id } })
  }

  if (loading) return <LoadingSpinner message="Loading doctors..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchDoctors} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Find a Doctor</h1>
        <p className="text-slate-500 mt-1">Browse available doctors and book an appointment</p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className="input-field sm:w-56">
          <option value="">All Specializations</option>
          {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState title="No doctors found" message="Try adjusting your search or filters." icon={Stethoscope} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <div key={d.id} className="card p-6 animate-slide-up hover:shadow-lg transition-all duration-200 hover:border-primary-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="text-primary-600" size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-lg truncate">Dr. {d.name || d.username}</h3>
                  <p className="text-primary-600 text-sm font-medium">{d.specialization || 'General'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {d.available ? 'Available' : 'Offline'}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigate(`/doctors/${d.id}`)} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1">
                  View Profile <ArrowRight size={16} />
                </button>
                {d.available && (
                  <button onClick={() => handleBook(d)} className="btn-primary flex-1 text-sm">
                    Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
