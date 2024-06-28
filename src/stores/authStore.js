import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@utils/axiosConfig.js'
import router from '@router/index.js'
import { useNavStore } from '@stores/navStore.js'

export const useAuthStore = defineStore('auth', () => {
  const storageName = 'token'
  const endpointLoginProduction = 'Authentication/LoginProduction'
  const endpointLogin = 'Authentication/Login'
  const token = ref(localStorage.getItem(storageName) || null)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem(storageName, newToken)
  }

  const login = async (credentials) => {
    const { token: newToken } = await apiClient.post(endpointLogin, credentials)
    setToken(newToken)

    useNavStore().setRail(true)
  }

  const loginProduction = async () => {
    const { token: newToken } = await apiClient.post(endpointLoginProduction)
    setToken(newToken)
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem(storageName)
    router.push({ name: 'Login' })
  }

  const isLoggedIn = computed(() => !!token.value)

  return {
    token,
    setToken,
    login,
    loginProduction,
    logout,
    isLoggedIn
  }
})
