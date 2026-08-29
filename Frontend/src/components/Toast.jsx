import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const ICON_STYLES = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
}

export default function Toast({ toast, onClose }) {
  const Icon = ICONS[toast.type] || Info

  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 4000)
    return () => clearTimeout(timer)
  }, [onClose, toast.duration])

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg ${STYLES[toast.type] || STYLES.info} animate-slide-in`}>
      <Icon className={`flex-shrink-0 mt-0.5 ${ICON_STYLES[toast.type] || ICON_STYLES.info}`} size={20} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </div>
  )
}
