import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const DASHBOARD_MAP = {
  ADMIN: '/admin/dashboard',
  DOCTOR: '/doctor/dashboard',
  PATIENT: '/patient/dashboard',
}

export default function RoleGuard({ allowedRoles, children }) {
  const { role } = useAuth()

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
