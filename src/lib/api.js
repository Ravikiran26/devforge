import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 → try refresh, retry once, else logout
let refreshing = false
let queue = []

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err)
    }
    original._retry = true

    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then(() => api(original)).catch((e) => Promise.reject(e))
    }

    refreshing = true
    try {
      const { refreshToken, setTokens, logout } = useAuthStore.getState()
      if (!refreshToken) { logout(); return Promise.reject(err) }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
        { refreshToken }
      )
      setTokens(data.accessToken, refreshToken)
      queue.forEach(({ resolve }) => resolve())
      queue = []
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return api(original)
    } catch {
      queue.forEach(({ reject }) => reject())
      queue = []
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      refreshing = false
    }
  }
)

export default api
