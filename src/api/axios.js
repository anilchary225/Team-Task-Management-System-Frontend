import axios from 'axios'

// Prefer VITE_API_URL so the deployed environment controls the backend.
// Fallback kept for local/preview usage.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://team-task-management-system-backend.vercel.app',
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default API
