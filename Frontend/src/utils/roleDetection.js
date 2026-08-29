import api from '../services/api'

/**
 * Centralized role detection.
 *
 * The current backend LoginResponseDTO does NOT return a `role` field,
 * and the JWT filter does not populate authorities. Instead of faking a
 * role, we derive it from real backend data:
 *
 *   1. GET /api/doctors/{userId}  → 200  ⇒ DOCTOR
 *   2. GET /api/patients/{userId}  → 200  ⇒ PATIENT
 *   3. both fail                    ⇒ ADMIN
 *
 * If the backend is later updated to include `role` in the login response,
 * simply replace this function with `authData.role` in AuthContext.login().
 */
export async function detectRole(userId) {
  if (!userId) return null
  try {
    await api.get(`/api/doctors/${userId}`)
    return 'DOCTOR'
  } catch {
    /* not a doctor, continue */
  }
  try {
    await api.get(`/api/patients/${userId}`)
    return 'PATIENT'
  } catch {
    /* not a patient, continue */
  }
  return 'ADMIN'
}
