import { createRouter, createWebHistory } from 'vue-router'
import routes from '@router/routes.js'
import { isAuthenticated } from '@services/authService.js'
import axiosInstance from '@utils/axiosConfig.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// TODO: Check user authorization
router.beforeEach((to, from) => {
  const { requiresAuthentication = true, restrictIfAuthenticated = false } =
    to.meta

  if (!requiresAuthentication && !restrictIfAuthenticated) return true

  const authenticated = isAuthenticated()

  if (restrictIfAuthenticated && authenticated) {
    return !from.name ? { name: 'Home' } : false
  }

  if (!authenticated && requiresAuthentication) return { name: 'Login' }
})

router.beforeResolve(() => {
  if (axiosInstance.activeRequests.size > 0) {
    for (const [url, controller] of axiosInstance.activeRequests.entries()) {
      controller.abort()

      console.log(`Canceled pending request to ${url} due to route change`)
    }

    axiosInstance.activeRequests.clear()
  }
})

router.afterEach((to, from) => {
  localStorage.setItem('lastVisitedRoute', to.name)
  console.log(`Adding route ${to.name} to the local storage `)

  console.log(`Navigated from ${from.name} to ${to.name}`)
})

export default router
