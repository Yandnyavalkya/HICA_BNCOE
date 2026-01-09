import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 second timeout
})

// Add response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error but don't throw - let components handle it
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.warn('[API] Backend unavailable, using fallback data');
    }
    return Promise.reject(error);
  }
)

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('hica_token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('hica_token')
    delete api.defaults.headers.common.Authorization
  }
}

export function loadAuthTokenFromStorage() {
  const token = localStorage.getItem('hica_token')
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

loadAuthTokenFromStorage()


