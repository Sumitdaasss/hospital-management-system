import api from './api'

export function getDoctors() {
  return api.get('/api/doctors')
}

export function getDoctorById(id) {
  return api.get(`/api/doctors/${id}`)
}

export function createDoctor(data) {
  return api.post('/api/doctors', data)
}

export function updateDoctor(id, data) {
  return api.put(`/api/doctors/${id}`, data)
}

export function deleteDoctor(id) {
  return api.delete(`/api/doctors/${id}`)
}

export function getDoctorsBySpecialization(specialization) {
  return api.get(`/api/doctors/specialization/${specialization}`)
}

export function getAvailableDoctors() {
  return api.get('/api/doctors/available')
}

export function getAvailableDoctorsBySpecialization(specialization) {
  return api.get(`/api/doctors/available/${specialization}`)
}
