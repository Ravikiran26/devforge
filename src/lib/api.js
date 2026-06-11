import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // sends the httpOnly refreshToken cookie automatically
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 → silent refresh via httpOnly cookie, retry once, else logout
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
      // Cookie is sent automatically — no token in request body
      const { data } = await axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true })
      useAuthStore.getState().setTokens(data.accessToken)
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
