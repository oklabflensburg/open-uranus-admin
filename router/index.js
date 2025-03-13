import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import { useAuth } from '@/composables/useAuth'
import { useNuxtApp } from '#app'

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "/", name: 'Home', component: () => import('@/pages/index.vue'), meta: { middleware: 'auth' }},
      { path: "/signin", name: 'Signin', component: () => import('@/pages/signin.vue')},
      { path: "/signup", name: 'Signup', component: () => import('@/pages/signup.vue')},
      { path: "/dashboard", name: 'Dashboard', component: () => import('@/pages/dashboard.vue'), meta: { middleware: 'auth' }},
      { path: "/settings", name: 'Settings', component: () => import('@/pages/settings.vue'), meta: { middleware: 'auth' }},
      { path: "/venue/types", name: 'VenueTypes', component: () => import('@/pages/venueTypes.vue')},
      { path: "/event/types", name: 'EventTypes', component: () => import('@/pages/eventTypes.vue')},
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { accessToken, refreshAccessToken, logout } = useAuth()
  const { $i18n } = useNuxtApp() // ✅ Access i18n globally
  const localePath = (path) => $i18n.localePath(path) // ✅ Define localePath function

  if (to.matched.some(record => record.meta.middleware === 'auth')) {
    if (!accessToken.value) {
      const refreshed = await refreshAccessToken()
      if (!refreshed) {
        logout()
        return next(localePath('/signin'))
      }
    }
  }

  if ((to.name === 'Signin' || to.name === 'Signup') && accessToken.value) {
    return next(localePath('/dashboard'))
  }

  next()
})

export default router
