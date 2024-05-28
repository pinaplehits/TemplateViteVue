import axios from 'axios'
import axiosRetry from 'axios-retry'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  onRetry: (error, retryCount, requestConfig) => {
    console.log(
      `Retrying request ${requestConfig.url} for the ${retryCount}th time. Error: ${error.message}`
    )
  }
})

axiosInstance.interceptors.request.use(
  (request) => {
    console.log('Starting Request', request)

    const token = localStorage.getItem('authToken')

    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }

    const controller = new AbortController()
    request.signal = controller.signal

    axiosInstance.activeRequests.set(request.url, controller)

    return request
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response)

    axiosInstance.activeRequests.delete(response.config.url)

    return response
  },
  (error) => {
    console.error('Response Error:', error)

    if (error.config && error.config.url) {
      axiosInstance.activeRequests.delete(error.config.url)
    }

    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
    }

    return Promise.reject(error)
  }
)

axiosInstance.defaults.onDownloadProgress = (progressEvent) => {
  console.log(
    'Download progress: ',
    Math.round((progressEvent.loaded * 100) / progressEvent.total)
  )
}

axiosInstance.defaults.onUploadProgress = (progressEvent) => {
  console.log(
    'Upload progress: ',
    Math.round((progressEvent.loaded * 100) / progressEvent.total)
  )
}

export default axiosInstance
