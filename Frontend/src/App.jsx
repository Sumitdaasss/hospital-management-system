import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RoleSelection from './pages/RoleSelection'
import RegisterDoctor from './pages/RegisterDoctor'
import RegisterPatient from './pages/RegisterPatient'
import Unauthorized from './pages/Unauthorized'

import PublicDoctors from './pages/doctors/Doctors'
import PublicDoctorDetails from './pages/doctors/DoctorDetails'

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDoctors from './pages/admin/Doctors'
import AdminDoctorDetails from './pages/admin/DoctorDetails'
import AdminPatients from './pages/admin/Patients'
import AdminPatientDetails from './pages/admin/PatientDetails'
import AdminAppointments from './pages/admin/Appointments'
import AdminAppointmentDetails from './pages/admin/AppointmentDetails'
import AdminAvailability from './pages/admin/Availability'

import DoctorLayout from './layouts/DoctorLayout'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorAppointmentDetails from './pages/doctor/DoctorAppointmentDetails'
import DoctorAvailability from './pages/doctor/DoctorAvailability'
import DoctorProfile from './pages/doctor/DoctorProfile'

import PatientLayout from './layouts/PatientLayout'
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientDoctors from './pages/patient/Doctors'
import BookAppointment from './pages/patient/BookAppointment'
import PatientAppointments from './pages/patient/PatientAppointments'
import PatientAppointmentDetails from './pages/patient/AppointmentDetails'
import PatientProfile from './pages/patient/PatientProfile'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RoleSelection />} />
            <Route path="/register-account" element={<Register />} />
            <Route path="/register-doctor" element={<RegisterDoctor />} />
            <Route path="/register-patient" element={<RegisterPatient />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/doctors" element={<PublicDoctors />} />
            <Route path="/doctors/:id" element={<PublicDoctorDetails />} />

            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="doctors/:id" element={<AdminDoctorDetails />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="patients/:id" element={<AdminPatientDetails />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="appointments/:id" element={<AdminAppointmentDetails />} />
              <Route path="availability" element={<AdminAvailability />} />
            </Route>

            <Route path="/doctor" element={<ProtectedRoute><DoctorLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="appointments/:id" element={<DoctorAppointmentDetails />} />
              <Route path="availability" element={<DoctorAvailability />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>

            <Route path="/patient" element={<ProtectedRoute><PatientLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="doctors" element={<PatientDoctors />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="appointments/:id" element={<PatientAppointmentDetails />} />
              <Route path="profile" element={<PatientProfile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
