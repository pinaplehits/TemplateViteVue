export default [
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
    path: '/home',
    name: 'Home',
    component: () => import('@pages/HomePage.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@pages/NotFoundPage.vue')
  },
  {
    path: '/sops',
    name: 'SOP',
    component: () => import('@pages/EsopAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: '/areas',
    name: 'Areas',
    component: () => import('@pages/AreasAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  }
]
