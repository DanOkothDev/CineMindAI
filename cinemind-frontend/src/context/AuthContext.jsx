import { createContext, useCallback, useMemo, useState, useEffect } from 'react'
import api from '../api/api.js'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'cinemind_token'
const USER_KEY = 'cinemind_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Keep Axios default header in sync with token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }, [token])

  const register = useCallback(async ({ username, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/auth/register', { username, email, password })
      const { user: u, token: t } = res.data.data
      setToken(t)
      setUser(u)
      localStorage.setItem(USER_KEY, JSON.stringify(u))
      return u
    } catch (err) {
      const msg = err.message || 'Registration failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { user: u, token: t } = res.data.data
      setToken(t)
      setUser(u)
      localStorage.setItem(USER_KEY, JSON.stringify(u))
      return u
    } catch (err) {
      const msg = err.message || 'Login failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, error, register, login, logout, isAuthenticated: Boolean(token && user) }),
    [user, token, loading, error, register, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
