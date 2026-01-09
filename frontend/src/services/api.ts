import axios from 'axios'

// In production, if no API URL is set, use an invalid URL to fail fast
// This ensures fallback data is used immediately
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  
  // In production (not localhost), use invalid URL to fail fast
  if (import.meta.env.PROD) {
    return 'https://invalid-backend-url-for-fallback.netlify.app';
  }
  
  // In development, use localhost
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000, // 2 second timeout for faster fallback in production
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


