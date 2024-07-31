import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@utils/axiosConfig.js'
import router from '@router/index.js'
import { useNavStore } from '@stores/navStore.js'
import { jwtDecode } from 'jwt-decode'

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

  const user = computed(() => {
    if (!token.value) return

    const decodedToken = jwtDecode(token.value)

    return {
      id: decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ],
      name: decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ],
      email:
        decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ]
    }
  })

  return {
    token,
    setToken,
    login,
    loginProduction,
    logout,
    isLoggedIn,
    user
  }
})
