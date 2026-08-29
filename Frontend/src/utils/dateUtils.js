export function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatTime(timeStr) {
  if (!timeStr) return 'N/A'
  const clean = timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr
  const [h, m] = clean.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const display = hour % 12 || 12
  return `${display}:${m} ${ampm}`
}

export function formatTimeForApi(timeStr) {
  if (!timeStr) return ''
  if (timeStr.length === 5) return `${timeStr}:00`
  return timeStr
}

export function formatDateForApi(dateStr) {
  if (!dateStr) return ''
  return dateStr
}

export function isToday(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

export function isPast(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function generateTimeSlots(startTime, endTime, intervalMinutes = 30) {
  const slots = []
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  let current = sh * 60 + sm
  const end = eh * 60 + em
  while (current < end) {
    const h = Math.floor(current / 60)
    const m = current % 60
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    slots.push(timeStr)
    current += intervalMinutes
  }
  return slots
}
