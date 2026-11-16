import { createRouter, createWebHistory, type RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types/auth'

declare module 'vue-router' {
  interface RouteMeta {
    /** Solo usuarios autenticados. */
    requiresAuth?: boolean
    /** Roles permitidos. Si se omite, cualquier usuario autenticado puede entrar. */
    roles?: Role[]
    /** Solo visitantes (login/registro); si ya hay sesión, redirige a su inicio. */
    guestOnly?: boolean
  }
}

/** Página de inicio de cada rol. */
export function homeFor(role: Role): RouteLocationRaw {
  return role === 'admin' ? { name: 'motorcycles' } : { name: 'cars' }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // "/" no tiene vista propia: manda a cada quien a su inicio según su rol.
      path: '/',
      name: 'home',
      redirect: () => {
        const auth = useAuthStore()
        return auth.role ? homeFor(auth.role) : { name: 'login' }
      },
    },
    {
      path: '/carros',
      name: 'cars',
      component: () => import('@/views/CarsView.vue'),
      meta: { requiresAuth: true, roles: ['user'] },
    },
    {
      path: '/motos',
      name: 'motorcycles',
      component: () => import('@/views/MotorcyclesView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.role) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.role) {
    return homeFor(auth.role)
  }
  // Autenticado pero sin permiso para esta ruta (p. ej. un user en /motos).
  if (to.meta.roles && auth.role && !to.meta.roles.includes(auth.role)) {
    return homeFor(auth.role)
  }
})

export default router
