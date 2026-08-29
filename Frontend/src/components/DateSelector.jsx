import { Calendar } from 'lucide-react'

export default function DateSelector({ value, onChange, min, label = 'Select Date' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        <Calendar size={16} className="inline mr-1" /> {label} *
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min || new Date().toISOString().split('T')[0]}
        className="input-field"
        required
      />
    </div>
  )
}
