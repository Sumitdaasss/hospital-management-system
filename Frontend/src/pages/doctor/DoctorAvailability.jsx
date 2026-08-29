import { useState, useEffect, useCallback } from 'react'
import { CalendarClock, Plus, Edit2, Trash2 } from 'lucide-react'
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

const emptyForm = { date: '', startTime: '', endTime: '', available: true }

export default function DoctorAvailability() {
  const { userId } = useAuth()
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const toast = useToast()

  const fetchAvailability = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const res = await getDoctorAvailability(userId)
      setAvailability(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchAvailability() }, [fetchAvailability])

  const filtered = dateFilter ? availability.filter((a) => a.date === dateFilter) : availability

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (a) => { setForm({ date: a.date || '', startTime: a.startTime || '', endTime: a.endTime || '', available: a.available }); setEditId(a.id); setModalOpen(true) }

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
        await createAvailability(userId, payload)
        toast.success('Availability created successfully')
      }
      setModalOpen(false)
      fetchAvailability()
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
      fetchAvailability()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner message="Loading availability..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchAvailability} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Availability</h1>
          <p className="text-slate-500 mt-1">Manage your schedule and available time slots</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={18} /> Add Availability
        </button>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Filter by date</label>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-field sm:w-64" />
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState title="No availability found" message="Add your available time slots for patients to book." icon={CalendarClock} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="card p-5 animate-slide-up hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{formatDate(a.date)}</p>
                  <p className="text-sm text-slate-500 mt-1">{formatTime(a.startTime)} - {formatTime(a.endTime)}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {a.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(a)} className="btn-secondary text-sm flex-1 flex items-center justify-center gap-1">
                  <Edit2 size={16} /> Edit
                </button>
                <button onClick={() => setDeleteTarget(a)} className="btn-danger text-sm flex-1 flex items-center justify-center gap-1">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Availability' : 'Add Availability'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
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
        message="Are you sure you want to delete this availability slot?"
        confirmText="Delete"
      />
    </div>
  )
}
