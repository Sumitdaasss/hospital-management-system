import { useState, useEffect, useCallback } from 'react'
import { CalendarClock, Plus, Edit2, Trash2 } from 'lucide-react'
import { getDoctors } from '../../services/doctorService'
import { createAvailability, getDoctorAvailability, updateAvailability, deleteAvailability } from '../../services/availabilityService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastContext'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage, formatDate, formatTime } from '../../utils/auth'
import { formatTimeForApi } from '../../utils/dateUtils'

const emptyForm = { doctorId: '', date: '', startTime: '', endTime: '', available: true }

export default function Availability() {
  const [availability, setAvailability] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [doctorFilter, setDoctorFilter] = useState('')
  const toast = useToast()

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const docRes = await getDoctors()
      const docs = docRes.data || []
      setDoctors(docs)
      const allAvail = []
      for (const d of docs) {
        try {
          const res = await getDoctorAvailability(d.id)
          const items = (res.data || []).map((a) => ({ ...a, doctorName: d.name || d.username }))
          allAvail.push(...items)
        } catch { /* skip doctor if availability fetch fails */ }
      }
      setAvailability(allAvail)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const filtered = doctorFilter ? availability.filter((a) => a.doctorId == doctorFilter) : availability

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (a) => { setForm({ doctorId: a.doctorId || '', date: a.date || '', startTime: a.startTime || '', endTime: a.endTime || '', available: a.available }); setEditId(a.id); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        startTime: formatTimeForApi(form.startTime),
        endTime: formatTimeForApi(form.endTime),
      }
      if (editId) {
        await updateAvailability(editId, payload)
        toast.success('Availability updated successfully')
      } else {
        await createAvailability(form.doctorId, payload)
        toast.success('Availability created successfully')
      }
      setModalOpen(false)
      fetchAll()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAvailability(deleteTarget.id)
      toast.success('Availability deleted successfully')
      fetchAll()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner message="Loading availability..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchAll} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Availability Management</h1>
          <p className="text-slate-500 mt-1">Manage doctor availability schedules</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={18} /> Add Availability
        </button>
      </div>

      <div className="card p-4">
        <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="input-field sm:w-64">
          <option value="">All Doctors</option>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.name || d.username}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState title="No availability found" message="Add availability slots for doctors." icon={CalendarClock} /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Start Time</th>
                  <th className="px-4 py-3 font-medium">End Time</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{a.doctorName || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(a.date)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatTime(a.startTime)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatTime(a.endTime)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(a)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteTarget(a)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Availability' : 'Add Availability'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Doctor *</label>
            <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} className="input-field" required disabled={!!editId}>
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name || d.username}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time *</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time *</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Available</label>
            <select value={form.available ? 'true' : 'false'} onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })} className="input-field">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Availability?"
        message="Are you sure you want to delete this availability slot? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  )
}
