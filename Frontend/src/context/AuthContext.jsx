import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api, { setUnauthorizedHandler } from '../services/api'
import { detectRole } from '../utils/roleDetection'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'))
  const [username, setUsername] = useState(() => localStorage.getItem('username'))
  const [email, setEmail] = useState(() => localStorage.getItem('email'))
  const [role, setRole] = useState(() => localStorage.getItem('role'))
  const [authReady, setAuthReady] = useState(true)

  const isAuthenticated = !!token

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout()
    })
  }, [])

  const login = useCallback(async (authData) => {
    localStorage.setItem('token', authData.token)
    localStorage.setItem('userId', String(authData.userId))
    localStorage.setItem('username', authData.username)
    localStorage.setItem('email', authData.email)

    let detectedRole = authData.role
    if (!detectedRole) {
      detectedRole = await detectRole(authData.userId)
    }
    if (detectedRole) {
      localStorage.setItem('role', detectedRole)
    }

    setToken(authData.token)
    setUserId(String(authData.userId))
    setUsername(authData.username)
    setEmail(authData.email)
    setRole(detectedRole)
    setAuthReady(true)
    return detectedRole
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    setToken(null)
    setUserId(null)
    setUsername(null)
    setEmail(null)
    setRole(null)
  }, [])

  const value = {
    token,
    userId,
    username,
    email,
    role,
    isAuthenticated,
    authReady,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
