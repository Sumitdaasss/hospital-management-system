import { getStatusConfig } from '../utils/statusConfig'

export default function StatusBadge({ status }) {
  const config = getStatusConfig(status)
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dotClass}`} />
      {config.label}
    </span>
  )
}
