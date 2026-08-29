import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md animate-slide-up">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="text-red-600" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Access Denied</h1>
        <p className="mt-3 text-slate-500">
          You don't have permission to access this page. Please log in with an appropriate account.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/login" className="btn-primary">Go to Login</Link>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
