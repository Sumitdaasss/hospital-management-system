import { Clock } from 'lucide-react'
import { formatTime } from '../utils/dateUtils'

export default function TimeSlotPicker({ slots, bookedTimes = [], selectedTime, onSelect, loading = false }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent" />
        Checking availability...
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        <Clock size={32} className="mx-auto mb-2 text-slate-300" />
        No available time slots for this date.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isBooked = bookedTimes.includes(slot)
        const isSelected = selectedTime === slot
        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => onSelect(slot)}
            className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                : isBooked
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                : 'bg-white text-slate-700 border-slate-300 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            {formatTime(slot)}
            {isBooked && <span className="block text-[10px] mt-0.5">Booked</span>}
          </button>
        )
      })}
    </div>
  )
}
