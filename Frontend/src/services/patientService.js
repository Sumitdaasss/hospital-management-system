import api from './api'

export function getPatients() {
  return api.get('/api/patients')
}

export function getPatientById(id) {
  return api.get(`/api/patients/${id}`)
}

export function createPatient(data) {
  return api.post('/api/patients', data)
}

export function updatePatient(id, data) {
  return api.put(`/api/patients/${id}`, data)
}

export function deletePatient(id) {
  return api.delete(`/api/patients/${id}`)
}
