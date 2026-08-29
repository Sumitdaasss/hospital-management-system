import api from './api'

export function createAppointment(data) {
  return api.post('/api/appointments', data)
}

export function getAppointments() {
  return api.get('/api/appointments')
}

export function getAppointmentById(id) {
  return api.get(`/api/appointments/${id}`)
}

export function getPatientAppointments(patientId) {
  return api.get(`/api/appointments/patient/${patientId}`)
}

export function getDoctorAppointments(doctorId) {
  return api.get(`/api/appointments/doctor/${doctorId}`)
}

export function getDoctorAppointmentsByDate(doctorId, date) {
  return api.get(`/api/appointments/doctor/${doctorId}/date/${date}`)
}

export function updateAppointmentStatus(id, status) {
  return api.put(`/api/appointments/${id}/status?status=${status}`)
}

export function cancelAppointment(id) {
  return api.put(`/api/appointments/${id}/cancel`)
}
