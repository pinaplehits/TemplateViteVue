import axios from 'axios'
import axiosRetry from 'axios-retry'
import { useAuthStore } from '@stores/authStore.js'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    DatabaseService: import.meta.env.VITE_DATABASE_TYPE
  }
})

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  onRetry: () => {
    console.log(`Retrying request...`)
  }
})

apiClient.interceptors.request.use(
  (request) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }

    return Promise.reject(error)
  }
)

export default apiClient
