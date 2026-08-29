export function getErrorMessage(error) {
  if (!error) return 'Something went wrong'
  if (error.response) {
    const { status, data } = error.response
    if (data?.message) return data.message
    if (typeof data === 'string') return data
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.'
      case 401:
        return 'Your session has expired. Please login again.'
      case 403:
        return "You don't have permission to perform this action."
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'A conflict occurred with existing data.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return 'Something went wrong'
    }
  }
  if (error.request) return 'Network error. Please check your connection.'
  return error.message || 'Something went wrong'
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatTime(timeStr) {
  if (!timeStr) return 'N/A'
  if (timeStr.length <= 5) {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const display = hour % 12 || 12
    return `${display}:${m} ${ampm}`
  }
  return timeStr
}

export function isToday(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}
