import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UserCog, Plus, Search, Edit2, Trash2, Eye } from 'lucide-react'
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, getDoctorsBySpecialization } from '../../services/doctorService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastContext'
import { getErrorMessage } from '../../utils/auth'
import { GENDERS } from '../../utils/constants'

const emptyForm = { name: '', email: '', phone: '', specialization: '', qualification: '', experience: '', gender: 'MALE', address: '', available: true }

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [specFilter, setSpecFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewDoctor, setViewDoctor] = useState(null)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let res
      if (specFilter) {
        res = await getDoctorsBySpecialization(specFilter)
      } else {
        res = await getDoctors()
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
      (d.email || '').toLowerCase().includes(q) ||
      (d.specialization || '').toLowerCase().includes(q)
  })

  const openAdd = () => {
    setForm(emptyForm)
    setEditId(null)
    setModalOpen(true)
  }

  const openEdit = (doctor) => {
    setForm({ ...emptyForm, ...doctor, experience: doctor.experience || '' })
    setEditId(doctor.id)
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, experience: form.experience ? parseInt(form.experience, 10) : 0 }
      if (editId) {
        await updateDoctor(editId, payload)
        toast.success('Doctor updated successfully')
      } else {
        await createDoctor(payload)
        toast.success('Doctor created successfully')
      }
      setModalOpen(false)
      fetchDoctors()
    } catch (err) {
      const msg = getErrorMessage(err)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteDoctor(deleteTarget.id)
      toast.success('Doctor deleted successfully')
      fetchDoctors()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const specializations = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))]

  if (loading) return <LoadingSpinner message="Loading doctors..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchDoctors} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Management</h1>
          <p className="text-slate-500 mt-1">Manage all doctors in the system</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={18} /> Add Doctor
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
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
        <div className="card">
          <EmptyState title="No doctors found" message="Add a new doctor or adjust your filters." icon={UserCog} />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Specialization</th>
                  <th className="px-4 py-3 font-medium">Experience</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{d.name || d.username}</td>
                    <td className="px-4 py-3 text-slate-600">{d.email}</td>
                    <td className="px-4 py-3 text-slate-600">{d.specialization || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600">{d.experience != null ? `${d.experience} yrs` : 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {d.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/doctors/${d.id}`} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg" title="View"><Eye size={18} /></Link>
                        <button onClick={() => openEdit(d)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteTarget(d)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Doctor' : 'Add Doctor'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Specialization *</label>
              <input type="text" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Qualification</label>
              <input type="text" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience (years)</label>
              <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field">
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Available</label>
              <select value={form.available ? 'true' : 'false'} onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })} className="input-field">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" rows={2} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewDoctor} onClose={() => setViewDoctor(null)} title="Doctor Details" size="md">
        {viewDoctor && (
          <div className="space-y-3 text-sm">
            <Detail label="Name" value={viewDoctor.name || viewDoctor.username} />
            <Detail label="Email" value={viewDoctor.email} />
            <Detail label="Phone" value={viewDoctor.phone} />
            <Detail label="Specialization" value={viewDoctor.specialization} />
            <Detail label="Qualification" value={viewDoctor.qualification} />
            <Detail label="Experience" value={viewDoctor.experience != null ? `${viewDoctor.experience} years` : ''} />
            <Detail label="Gender" value={viewDoctor.gender} />
            <Detail label="Address" value={viewDoctor.address} />
            <Detail label="Available" value={viewDoctor.available ? 'Yes' : 'No'} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Doctor?"
        message={`Are you sure you want to delete Dr. ${deleteTarget?.name || deleteTarget?.username}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="flex gap-3">
      <span className="font-medium text-slate-500 w-32 flex-shrink-0">{label}:</span>
      <span className="text-slate-800">{value || 'N/A'}</span>
    </div>
  )
}
