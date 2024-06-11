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
      localStorage.setItem('token', token)
    },
    async login(credentials) {
      const url = 'Authentication/Login'
      const { token } = await apiClient.post(url, credentials)
      this.setToken(token)
    },
    async loginProduction() {
      const url = 'Authentication/LoginProduction'
      const { token } = await apiClient.post(url)
      this.setToken(token)
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
      router.push({ name: 'Login' })
    }
  },
  getters: {
    isLoggedIn() {
      return !!this.token
    }
  }
})
