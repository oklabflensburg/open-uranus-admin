import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: '/', name: 'Home', component: () => import('@/pages/index.vue'), meta: { middleware: 'auth' }},
      { path: '/signin', name: 'Signin', component: () => import('@/pages/signin.vue')},
      { path: '/signup', name: 'Signup', component: () => import('@/pages/signup.vue')},
      { path: '/dashboard', name: 'Dashboard', component: () => import('@/pages/dashboard.vue'), meta: { middleware: 'auth' }},
      { path: '/organizer', name: 'Organizer', component: () => import('@/pages/organizer.vue'), meta: { middleware: 'auth' }},
      { path: '/venue', name: 'Venue', component: () => import('@/pages/venue.vue'), meta: { middleware: 'auth' }},
      { path: '/event', name: 'Event', component: () => import('@/pages/event.vue'), meta: { middleware: 'auth' }}
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { accessToken, refreshAccessToken, logout } = useAuth()

  if (to.matched.some(record => record.meta.middleware === 'auth')) {
    if (!accessToken.value) {
      const refreshed = await refreshAccessToken()
      if (!refreshed) {
        logout()
        return next('/signin')
      }
    }
  }

  if (to.path === '/signin' && accessToken.value) {
    return next('/dashboard')
  }

  next()
})

export default router
