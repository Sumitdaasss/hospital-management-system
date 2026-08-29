import api from './api'

export function createAvailability(doctorId, data) {
  return api.post(`/api/doctor-availability/doctor/${doctorId}`, data)
}

export function getDoctorAvailability(doctorId) {
  return api.get(`/api/doctor-availability/doctor/${doctorId}`)
}

export function getAvailabilityByDate(doctorId, date) {
  return api.get(`/api/doctor-availability/doctor/${doctorId}/date/${date}`)
}

export function updateAvailability(id, data) {
  return api.put(`/api/doctor-availability/${id}`, data)
}

export function deleteAvailability(id) {
  return api.delete(`/api/doctor-availability/${id}`)
}
