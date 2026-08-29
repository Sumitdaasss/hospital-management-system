import { Link } from 'react-router-dom'
import { Activity, Stethoscope, Heart, ArrowRight, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-1.5 mb-4">
            <ShieldCheck size={16} className="text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Get Started</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Choose Your Role</h1>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Select whether you are joining as a doctor or a patient to continue to the registration page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Doctor Card */}
          <Link
            to="/register-doctor"
            className="group bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-primary-400 hover:shadow-xl transition-all duration-200 animate-slide-up"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-200">
              <Stethoscope className="text-primary-600 group-hover:text-white transition-colors duration-200" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Doctor</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Register as a doctor to manage your appointments, set availability, and view patient records.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" /> Manage appointments
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" /> Set your availability schedule
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" /> View patient details
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Register as Doctor <ArrowRight size={18} />
            </div>
          </Link>

          {/* Patient Card */}
          <Link
            to="/register-patient"
            className="group bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-accent-400 hover:shadow-xl transition-all duration-200 animate-slide-up"
          >
            <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-600 transition-colors duration-200">
              <Heart className="text-accent-600 group-hover:text-white transition-colors duration-200" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Patient</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Register as a patient to book appointments, browse doctors, and manage your health records.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full" /> Book appointments online
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full" /> Browse available doctors
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full" /> Track your appointment history
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-accent-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Register as Patient <ArrowRight size={18} />
            </div>
          </Link>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-slate-400">
          <Activity size={18} className="text-primary-400" />
          <span className="text-sm font-medium">MediCare Hospital Management System</span>
        </div>
      </div>
    </div>
  )
}
