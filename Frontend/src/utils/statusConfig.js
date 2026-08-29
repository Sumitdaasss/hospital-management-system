export const APPOINTMENT_STATUS_CONFIG = {
  BOOKED: {
    label: 'Booked',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  COMPLETED: {
    label: 'Completed',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    dotClass: 'bg-green-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
  },
}

export function getStatusConfig(status) {
  return APPOINTMENT_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  }
}
