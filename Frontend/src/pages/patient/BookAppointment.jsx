import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarPlus, Stethoscope, Calendar, Clock, FileText, CheckCircle2,
  ChevronRight, ChevronLeft, User, AlertCircle
} from 'lucide-react'
import { getAvailableDoctors } from '../../services/doctorService'
import { getAvailabilityByDate } from '../../services/availabilityService'
import { getDoctorAppointmentsByDate, createAppointment } from '../../services/appointmentService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import TimeSlotPicker from '../../components/TimeSlotPicker'
import { useToast } from '../../components/ToastContext'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/auth'
import { formatTime, formatDate, formatTimeForApi, generateTimeSlots } from '../../utils/dateUtils'

const STEPS = [
  { num: 1, label: 'Select Doctor', icon: Stethoscope },
  { num: 2, label: 'Select Date', icon: Calendar },
  { num: 3, label: 'Select Time', icon: Clock },
  { num: 4, label: 'Patient Details', icon: User },
  { num: 5, label: 'Confirm', icon: CheckCircle2 },
]

export default function BookAppointment() {
  const { userId, username, email } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const preselectedDoctorId = location.state?.doctorId
  const toast = useToast()

  const [step, setStep] = useState(1)
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [error, setError] = useState('')
  const [doctorId, setDoctorId] = useState(preselectedDoctorId || '')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [date, setDate] = useState('')
  const [availability, setAvailability] = useState([])
  const [loadingAvail, setLoadingAvail] = useState(false)
  const [bookedTimes, setBookedTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const [problem, setProblem] = useState('')
  const [patientName, setPatientName] = useState(username || '')
  const [patientEmail, setPatientEmail] = useState(email || '')
  const [submitting, setSubmitting] = useState(false)

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true)
    setError('')
    try {
      const res = await getAvailableDoctors()
      const docs = res.data || []
      setDoctors(docs)
      if (preselectedDoctorId) {
        const doc = docs.find((d) => d.id == preselectedDoctorId)
        if (doc) {
          setSelectedDoctor(doc)
          setDoctorId(String(doc.id))
          setStep(2)
        }
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingDoctors(false)
    }
  }, [preselectedDoctorId])

  useEffect(() => { fetchDoctors() }, [fetchDoctors])

  const fetchAvailabilityAndAppointments = useCallback(async () => {
    if (!doctorId || !date) return
    setLoadingAvail(true)
    try {
      const [availRes, apptRes] = await Promise.all([
        getAvailabilityByDate(doctorId, date),
        getDoctorAppointmentsByDate(doctorId, date),
      ])
      const availItems = (availRes.data || []).filter((a) => a.available !== false)
      setAvailability(availItems)
      const booked = (apptRes.data || [])
        .filter((a) => a.status === 'BOOKED')
        .map((a) => {
          const t = a.appointmentTime || a.time || ''
          return t.length > 5 ? t.substring(0, 5) : t
        })
      setBookedTimes(booked)
    } catch (err) {
      toast.error(getErrorMessage(err))
      setAvailability([])
      setBookedTimes([])
    } finally {
      setLoadingAvail(false)
    }
  }, [doctorId, date, toast])

  useEffect(() => {
    if (step === 3 && doctorId && date) {
      setSelectedTime('')
      fetchAvailabilityAndAppointments()
    }
  }, [step, doctorId, date, fetchAvailabilityAndAppointments])

  const allSlots = availability.flatMap((a) => {
    const start = (a.startTime || '').length > 5 ? a.startTime.substring(0, 5) : a.startTime
    const end = (a.endTime || '').length > 5 ? a.endTime.substring(0, 5) : a.endTime
    return generateTimeSlots(start, end)
  })
  const uniqueSlots = [...new Set(allSlots)]

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setDoctorId(String(doctor.id))
    setStep(2)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await createAppointment({
        patientId: userId,
        doctorId,
        appointmentDate: date,
        appointmentTime: formatTimeForApi(selectedTime),
        problem,
      })
      toast.success('Appointment booked successfully')
      navigate('/patient/appointments')
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg.includes('already booked') || msg.includes('slot')) {
        toast.error('This time slot was just booked. Please choose another available time.')
        setStep(3)
      } else if (msg.includes('not available')) {
        toast.error('This doctor is not available at the selected time. Please choose another time.')
        setStep(3)
      } else {
        toast.error(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingDoctors) return <LoadingSpinner message="Loading doctors..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchDoctors} />

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Book an Appointment</h1>
        <p className="text-slate-500 mt-1">Complete the steps below to schedule your visit</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between max-w-2xl">
        {STEPS.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                step >= s.num
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.num ? <CheckCircle2 size={20} /> : <s.icon size={18} />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= s.num ? 'text-primary-600' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-200 ${step > s.num ? 'bg-primary-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800">Select a Doctor</h2>
          {doctors.length === 0 ? (
            <EmptyState title="No doctors available" message="Please check back later." icon={Stethoscope} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDoctorSelect(d)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    doctorId === String(d.id)
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-slate-200 hover:border-primary-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="text-primary-600" size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">Dr. {d.name || d.username}</p>
                      <p className="text-sm text-primary-600">{d.specialization || 'General'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Date */}
      {step === 2 && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800">Select Appointment Date</h2>
          {selectedDoctor && (
            <div className="bg-primary-50 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Stethoscope className="text-primary-600" size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Dr. {selectedDoctor.name || selectedDoctor.username}</p>
                <p className="text-sm text-primary-600">{selectedDoctor.specialization || 'General'}</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Calendar size={16} className="inline mr-1" /> Choose Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
              required
            />
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-1">
              <ChevronLeft size={18} /> Back
            </button>
            <button onClick={() => date && setStep(3)} disabled={!date} className="btn-primary flex items-center gap-1">
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Time */}
      {step === 3 && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800">Select Available Time</h2>
          <p className="text-sm text-slate-500">{formatDate(date)}</p>
          <TimeSlotPicker
            slots={uniqueSlots}
            bookedTimes={bookedTimes}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            loading={loadingAvail}
          />
          {uniqueSlots.length > 0 && !loadingAvail && (
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-slate-300 bg-white inline-block" /> Available</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary-600 inline-block" /> Selected</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Booked</span>
            </div>
          )}
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className="btn-secondary flex items-center gap-1">
              <ChevronLeft size={18} /> Back
            </button>
            <button onClick={() => selectedTime && setStep(4)} disabled={!selectedTime} className="btn-primary flex items-center gap-1">
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Patient Details */}
      {step === 4 && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800">Patient Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="input-field"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <FileText size={16} className="inline mr-1" /> Describe Your Problem
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Briefly describe your symptoms or reason for visit"
            />
          </div>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(3)} className="btn-secondary flex items-center gap-1">
              <ChevronLeft size={18} /> Back
            </button>
            <button onClick={() => setStep(5)} disabled={!patientName || !patientEmail} className="btn-primary flex items-center gap-1">
              Review Summary <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {step === 5 && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="text-primary-600" size={22} /> Appointment Summary
          </h2>
          <div className="bg-slate-50 rounded-xl p-5 space-y-3">
            <SummaryRow label="Doctor" value={`Dr. ${selectedDoctor?.name || selectedDoctor?.username || ''}`} />
            <SummaryRow label="Specialization" value={selectedDoctor?.specialization || 'General'} />
            <SummaryRow label="Date" value={formatDate(date)} />
            <SummaryRow label="Time" value={formatTime(selectedTime)} />
            <SummaryRow label="Patient" value={patientName} />
            {problem && <SummaryRow label="Problem" value={problem} />}
          </div>
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>Please review the details above. Once confirmed, this time slot will be reserved for you.</span>
          </div>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(4)} className="btn-secondary flex items-center gap-1">
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              {submitting ? 'Booking...' : <><CalendarPlus size={18} /> Confirm Appointment</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex gap-3">
      <span className="text-sm font-medium text-slate-500 w-32 flex-shrink-0">{label}:</span>
      <span className="text-sm text-slate-800 font-medium">{value || 'N/A'}</span>
    </div>
  )
}
