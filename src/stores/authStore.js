import { defineStore } from 'pinia'
import apiClient from '@utils/axiosConfig.js'
import router from '@router/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null
  }),
  actions: {
    setToken(token) {
      this.token = token
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
      localStorage.setItem('token', token)
    },
    async login(credentials) {
      const url = 'Authentication/Login'
      const response = await apiClient.post(url, credentials)

      this.setToken(response.token)
    },
    async loginProduction() {
      try {
        const url = 'Authentication/LoginProduction'
        const response = await apiClient.post(url)

        this.setToken(response.token)
      } catch (error) {
        console.error(error.message)
      }
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')

      delete apiClient.defaults.headers.Authorization

      router.push({ name: 'Login' })
    }
  },
  getters: {
    isLoggedIn() {
      return this.token !== null
    }
  }
})
