import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, Search, Edit2, Trash2, Eye } from 'lucide-react'
import { getPatients, createPatient, updatePatient, deletePatient } from '../../services/patientService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastContext'
import { getErrorMessage } from '../../utils/auth'
import { GENDERS, BLOOD_GROUPS } from '../../utils/constants'

const emptyForm = { name: '', email: '', phone: '', dateOfBirth: '', gender: 'MALE', address: '', bloodGroup: '', healthProblem: '' }

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewPatient, setViewPatient] = useState(null)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const toast = useToast()

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getPatients()
      setPatients(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPatients() }, [fetchPatients])

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase()
    return !q ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q)
  })

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (p) => { setForm({ ...emptyForm, ...p }); setEditId(p.id); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await updatePatient(editId, form)
        toast.success('Patient updated successfully')
      } else {
        await createPatient(form)
        toast.success('Patient created successfully')
      }
      setModalOpen(false)
      fetchPatients()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deletePatient(deleteTarget.id)
      toast.success('Patient deleted successfully')
      fetchPatients()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner message="Loading patients..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchPatients} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Management</h1>
          <p className="text-slate-500 mt-1">Manage all patients in the system</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={18} /> Add Patient
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState title="No patients found" message="Add a new patient or adjust your search." icon={Users} /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Blood Group</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.name || p.username}</td>
                    <td className="px-4 py-3 text-slate-600">{p.email}</td>
                    <td className="px-4 py-3 text-slate-600">{p.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600">{p.bloodGroup || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/patients/${p.id}`} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg" title="View"><Eye size={18} /></Link>
                        <button onClick={() => openEdit(p)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Patient' : 'Add Patient'} size="lg">
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field">
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Group</label>
              <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="input-field">
                <option value="">Select</option>
                {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" rows={2} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Health Problem</label>
              <textarea value={form.healthProblem} onChange={(e) => setForm({ ...form, healthProblem: e.target.value })} className="input-field" rows={2} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!viewPatient} onClose={() => setViewPatient(null)} title="Patient Details" size="md">
        {viewPatient && (
          <div className="space-y-3 text-sm">
            <Detail label="Name" value={viewPatient.name || viewPatient.username} />
            <Detail label="Email" value={viewPatient.email} />
            <Detail label="Phone" value={viewPatient.phone} />
            <Detail label="Date of Birth" value={viewPatient.dateOfBirth} />
            <Detail label="Gender" value={viewPatient.gender} />
            <Detail label="Blood Group" value={viewPatient.bloodGroup} />
            <Detail label="Address" value={viewPatient.address} />
            <Detail label="Health Problem" value={viewPatient.healthProblem} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Patient?"
        message={`Are you sure you want to delete ${deleteTarget?.name || deleteTarget?.username}? This action cannot be undone.`}
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
