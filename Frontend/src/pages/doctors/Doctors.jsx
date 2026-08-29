import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, Search, Award, Clock, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { getAvailableDoctors, getDoctorsBySpecialization } from '../../services/doctorService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import Navbar from '../../components/Navbar'
import { getErrorMessage } from '../../utils/auth'

export default function PublicDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [specFilter, setSpecFilter] = useState('')
  const navbar = <Navbar />

  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let res
      if (specFilter) {
        res = await getDoctorsBySpecialization(specFilter)
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

  return (
    <div className="min-h-screen bg-slate-50">
      {navbar}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Find a Doctor</h1>
          <p className="text-slate-500 mt-2">Browse our verified medical professionals</p>
        </div>

        <div className="card p-4 flex flex-col sm:flex-row gap-3 mb-6">
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

        {loading ? (
          <LoadingSpinner message="Loading doctors..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchDoctors} />
        ) : filtered.length === 0 ? (
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
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  {d.qualification && (
                    <div className="flex items-center gap-2"><Award size={16} className="text-slate-400" /> <span>{d.qualification}</span></div>
                  )}
                  {d.experience != null && (
                    <div className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /> <span>{d.experience} years experience</span></div>
                  )}
                  {d.email && (
                    <div className="flex items-center gap-2"><Mail size={16} className="text-slate-400" /> <span className="truncate">{d.email}</span></div>
                  )}
                  {d.phone && (
                    <div className="flex items-center gap-2"><Phone size={16} className="text-slate-400" /> <span>{d.phone}</span></div>
                  )}
                  {d.address && (
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> <span className="truncate">{d.address}</span></div>
                  )}
                </div>
                <div className="mt-5">
                  <Link to={`/doctors/${d.id}`} className="btn-secondary w-full flex items-center justify-center gap-1 text-sm">
                    View Profile <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
