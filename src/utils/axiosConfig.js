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
    if (useAuthStore().isLoggedIn) {
      request.headers.Authorization = `Bearer ${useAuthStore().token}`
    }

    return request
  },
  (error) => error
)

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response, message } = error

    if (response?.data) throw response.data

    if (message) throw message

    throw error
  }
)

export default apiClient
