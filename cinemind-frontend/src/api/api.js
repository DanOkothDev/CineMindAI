import axios from 'axios'


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
