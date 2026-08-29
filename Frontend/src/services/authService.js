import api from './api'

export function register(data) {
  return api.post('/api/auth/register', {
    username: data.username,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword || data.password,
    userType: data.userType,
  })
}

export function login(data) {
  return api.post('/api/auth/login', data)
}
