import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach stored JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinemind_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Normalize errors so every page can just read `error.message`.
// Also handle 401 by clearing local auth state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cinemind_token')
      localStorage.removeItem('cinemind_user')
      delete api.defaults.headers.common['Authorization']
    }
    const data = error.response?.data
    const message =
      (data && (data.message || data.error)) ||
      error.message ||
      'Something went wrong talking to the server.'
    return Promise.reject(new Error(message))
  }
)

export default api
