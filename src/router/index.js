import { createRouter, createWebHistory } from 'vue-router'
import routes from '@router/routes.js'
import { isAuthenticated } from '@services/authService.js'

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

router.beforeResolve((to, from) => {
  if (to.name !== 'Login') {
    localStorage.setItem('lastVisitedRoute', to.name)
    console.log(`Adding route ${to.name} to localStorage`)

    console.log(`Navigated from ${from.name} to ${to.name}`)
  }
})

export default router
