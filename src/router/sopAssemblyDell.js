const pathPrefix = '/sop/assemblydell/'

const routes = [
  {
    path: 'sops',
    name: 'SOP',
    component: () => import('@pages/Sop/AssemblyDell/SopAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'sops/:id',
    name: 'SOP details',
    component: () => import('@pages/Sop/AssemblyDell/SopDetails.vue'),
    meta: { requiresAuthentication: true }
  },
  {
    path: 'areas',
    name: 'Areas',
    component: () => import('@pages/Sop/AssemblyDell/AreasAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'models',
    name: 'Models',
    component: () => import('@pages/Sop/AssemblyDell/ModelsAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'stations',
    name: 'Stations',
    component: () => import('@pages/Sop/AssemblyDell/StationsAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'lines',
    name: 'Lines',
    component: () => import('@pages/Sop/AssemblyDell/LinesAdminPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  },
  {
    path: 'production',
    name: 'Production',
    component: () => import('@pages/Sop/AssemblyDell/ProductionPage.vue'),
    meta: { requiresAuthentication: true, showInNav: true }
  }
]

const prefixedRoutes = routes.map((route) => ({
  ...route,
  path: `${pathPrefix}${route.path}`
}))

export default prefixedRoutes
