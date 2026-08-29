import { Link, useNavigate } from 'react-router-dom'
import { Activity, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dashboardLink = role === 'ADMIN' ? '/admin/dashboard' : role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard'

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={22} />
            </div>
            <span className="font-bold text-lg text-slate-800">MediCare</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Home</Link>
            <Link to="/doctors" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Doctors</Link>
            <a href="/#services" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Services</a>
            <a href="/#about" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">About</a>
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="btn-primary text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 flex flex-col gap-3 animate-slide-in">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-primary-600 font-medium">Home</Link>
            <Link to="/doctors" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-primary-600 font-medium">Doctors</Link>
            <a href="/#services" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-primary-600 font-medium">Services</a>
            <a href="/#about" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-primary-600 font-medium">About</a>
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-primary-600 font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="btn-primary text-sm w-fit">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm w-fit">Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
