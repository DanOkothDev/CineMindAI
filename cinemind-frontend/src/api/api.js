import axios from 'axios'

// Talks to the Flask backend described in the architecture doc.
// In dev, requests go to relative /api/... paths and are forwarded by the
// Vite proxy (vite.config.js) to VITE_BACKEND_URL, which avoids CORS.
// In production, set VITE_API_BASE_URL to your deployed backend's origin.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalize errors so every page can just read `error.message`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const message =
      (data && (data.message || data.error)) ||
      error.message ||
      'Something went wrong talking to the server.'
    return Promise.reject(new Error(message))
  }
)

export default api
