const pathPrefix = '/sop/assemblyhp/'

const routes = [
  {
    path: 'sops',
    name: 'SOP',
    component: () => import('@pages/Sop/AssemblyHp/SopAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'sops/:id',
    name: 'SOP details',
    component: () => import('@pages/Sop/AssemblyHp/SopDetails.vue'),
    meta: { requiresAuthentication: true }
  },
  {
    path: 'areas',
    name: 'Areas',
    component: () => import('@pages/Sop/AssemblyHp/AreasAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'models',
    name: 'Models',
    component: () => import('@pages/Sop/AssemblyHp/ModelsAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'stations',
    name: 'Stations',
    component: () => import('@pages/Sop/AssemblyHp/StationsAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'lines',
    name: 'Lines',
    component: () => import('@pages/Sop/AssemblyHp/LinesAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'production',
    name: 'Production',
    component: () => import('@pages/Sop/AssemblyHp/ProductionPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  }
]

const prefixedRoutes = routes.map((route) => ({
  ...route,
  path: `${pathPrefix}${route.path}`
}))

export default prefixedRoutes
