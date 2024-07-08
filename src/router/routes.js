import sopAssyRoutes from '@router/sopAssemblyDell.js'

const defaultRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@pages/LoginPage.vue'),
    meta: { requiresAuthentication: false, restrictIfAuthenticated: true }
  },
  {
    path: '/',
    redirect: { name: 'Login' }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@pages/NotFoundPage.vue')
  }
]

const routes = [...defaultRoutes, ...sopAssyRoutes].map((route) => ({
  ...route,
  meta: {
    requiresAuthentication: true,
    restrictIfAuthenticated: false,
    ...route.meta
  }
}))

export default routes
