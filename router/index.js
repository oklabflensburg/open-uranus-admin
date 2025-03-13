import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import { useAuth } from '@/composables/useAuth'
import { useNuxtApp } from '#app'

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: '/', name: 'Home', component: () => import('@/pages/index.vue'), meta: { middleware: 'auth' }},
      { path: '/signin', name: 'Signin', component: () => import('@/pages/signin.vue')},
       { path: '/signup', name: 'Signup', component: () => import('@/pages/signup.vue')},
       { path: '/dashboard', name: 'Dashboard', component: () => import('@/pages/dashboard.vue'), meta: { middleware: 'auth' }},
       { path: '/settings', name: 'Settings', component: () => import('@/pages/settings.vue'), meta: { middleware: 'auth' }},
       { path: '/organizer', name: 'Organizer', component: () => import('@/pages/organizer.vue'), meta: { middleware: 'auth' }},
       { path: '/venue', name: 'Venue', component: () => import('~/pages/venue/index.vue'), meta: { middleware: 'auth' }},
       { path: '/event', name: 'Event', component: () => import('~/pages/event/index.vue'), meta: { middleware: 'auth' }},
       { path: '/space', name: 'Space', component: () => import('~/pages/space/index.vue'), meta: { middleware: 'auth' }},
       { path: '/genre/types', name: 'GenreTypes', component: () => import('@/pages/genreTypes.vue')},
       { path: '/venue/types', name: 'VenueTypes', component: () => import('@/pages/venueTypes.vue')},
       { path: '/event/types', name: 'EventTypes', component: () => import('@/pages/eventTypes.vue')},
       { path: '/licence/types', name: 'LicenceTypes', component: () => import('@/pages/licenceTypes.vue')},
       { path: '/image/types', name: 'ImageTypes', component: () => import('@/pages/imageTypes.vue')},
       { path: '/space/types', name: 'SpaceTypes', component: () => import('@/pages/spaceTypes.vue')}
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
