import { Link } from 'react-router-dom'
import {
  Activity, Stethoscope, Users, CalendarCheck, ShieldCheck, Clock,
  Award, Heart, ArrowRight, Phone, Mail, MapPin, CheckCircle2
} from 'lucide-react'
import Navbar from '../components/Navbar'

const services = [
  { icon: Stethoscope, title: 'Find Doctors', desc: 'Browse verified doctors by specialization and availability.' },
  { icon: Clock, title: 'Doctor Availability', desc: 'Check real-time doctor availability and time slots.' },
  { icon: CalendarCheck, title: 'Appointment Booking', desc: 'Book appointments in seconds with available time slots.' },
  { icon: Users, title: 'Patient Management', desc: 'Comprehensive patient records and health information.' },
  { icon: ShieldCheck, title: 'Secure Healthcare', desc: 'JWT-based role security for admin, doctor, and patient access.' },
  { icon: Activity, title: 'Appointment Tracking', desc: 'Track appointment status from booked to completed.' },
]

const features = [
  { icon: CalendarCheck, title: 'Easy Booking', desc: 'Book appointments in seconds with available time slots.' },
  { icon: Award, title: 'Verified Doctors', desc: 'Access to experienced and certified medical professionals.' },
  { icon: Clock, title: 'Real-Time Availability', desc: 'See up-to-date doctor availability and open slots.' },
  { icon: ShieldCheck, title: 'Secure Authentication', desc: 'Bank-grade JWT authentication and role-based access control.' },
  { icon: Activity, title: 'Appointment Tracking', desc: 'Track your appointments from booking to completion.' },
  { icon: Users, title: 'Patient Management', desc: 'Manage your health records and information in one place.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/20">
              <Heart size={16} />
              <span className="text-sm font-medium">Trusted Healthcare Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Better Healthcare.<br />Simpler Appointments.
            </h1>
            <p className="mt-6 text-lg text-primary-100 max-w-2xl">
              Find trusted doctors, check availability, and manage your appointments securely.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/doctors" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 shadow-lg">
                Find a Doctor <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Our Services</h2>
          <p className="mt-4 text-slate-500">Everything you need to run a modern healthcare facility</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="card p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200 animate-slide-up">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <s.icon className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">{s.title}</h3>
              <p className="mt-2 text-slate-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Why Choose Us</h2>
            <p className="mt-4 text-slate-500">Built for reliability, security, and ease of use</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center animate-slide-up">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <f.icon className="text-white" size={28} />
                </div>
                <h3 className="font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-2 text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors CTA */}
      <section id="doctors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card p-8 lg:p-12 bg-gradient-to-r from-primary-600 to-accent-600 border-0 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">Ready to take control of your hospital management?</h2>
              <p className="mt-3 text-primary-100">Join MediCare today and streamline your healthcare operations.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all whitespace-nowrap">
                Choose Role <ArrowRight size={20} />
              </Link>
              <Link to="/doctors" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all whitespace-nowrap">
                Find a Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Activity className="text-white" size={22} />
                </div>
                <span className="font-bold text-lg text-white">MediCare</span>
              </div>
              <p className="text-sm text-slate-400">Modern hospital management system for efficient healthcare delivery.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
                <li><Link to="/doctors" className="hover:text-primary-400 transition-colors">Doctors</Link></li>
                <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Mail size={16} /> info@medicare.com</li>
                <li className="flex items-center gap-2"><MapPin size={16} /> 123 Health St, Medical City</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>&copy; 2026 MediCare Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
