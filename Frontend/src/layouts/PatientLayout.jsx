import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Stethoscope, CalendarPlus, CalendarDays, User, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import RoleGuard from '../components/RoleGuard'

const navItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/patient/doctors', label: 'Doctors', icon: Stethoscope },
  { path: '/patient/book-appointment', label: 'Book Appointment', icon: CalendarPlus },
  { path: '/patient/appointments', label: 'My Appointments', icon: CalendarDays },
  { path: '/patient/profile', label: 'Profile', icon: User },
]

export default function PatientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <RoleGuard allowedRoles={['PATIENT']}>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar items={navItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-slate-100 rounded-lg">
              <Menu size={22} />
            </button>
            <span className="font-semibold text-slate-800">Patient Portal</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
